const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const xlsx = require("xlsx");
const axios = require("axios");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.webContents.on('did-finish-load', (event) => {
    win.webContents.send('onWebcontentsValue', 'OK')
  })

  win.loadFile("./pages/index.html");
};

// b_stt , tax_type , end_dt
const transResponse = (aDataList) => {
  const result = aDataList.map((data) => {
    return {
      b_no: data["b_no"],
      tax_type: data["tax_type"],
      end_dt: data["end_dt"]
    }
  })
  return result
}

const isEmpty = (target) => {
  return target == null || target == undefined
}

const callDataPortal = async (dataList) => {
  const portalUrl = "https://api.odcloud.kr/api/nts-businessman/v1/status" 
                    + "?serviceKey=" 
                    + "ifyAoaKqxfgiVhk%2FgPgUZO21ZVQjlIy8kH0M9JygCw5mKqFYgU79I5h3Nzr%2FSB%2BwFUS3%2FvK%2BhAPwAuw%2Br6xVJw%3D%3D"

  const body = {
    b_no: dataList
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  try {
    let response = await axios.post(portalUrl, body, config)
    return response.status == 200 ? response.data : null
  }
  catch (err) {
    console.log(err)
  }
}

const handleDataFile = async (event, filePath) => {
  const workbook = xlsx.readFile(filePath, { type: 'binary' });

  workbook.SheetNames.forEach((name) => {
    const jsonsheet = xlsx.utils.sheet_to_json(workbook.Sheets[name])
    const range = jsonsheet.length
    const defaultStep = 100;
    const cnt = Math.floor(range / defaultStep);

    let datalist = []
    for(let i=0; i<=cnt; i++) {
        const start = i * defaultStep
        const end = start+99 > range ? range-1 : start+99;

        // Insert ID List
        let targetList = []
        for (let k=start; k<=end; k++) {
         
          targetList.push(String(jsonsheet[k]['id']))
        }

        (async () => {
          let response = await callDataPortal(targetList)

          // Match Data
          chunkdata= transResponse(response["data"])
          datalist.push(...chunkdata)

          console.log(datalist)
        })();

        // callDataPortal(targetList)
        //               .then((res) => {
        //                 data = res.data;
        //                 dataList = data["data"]
        //                 return transResponse(dataList)
        //               })
        //               .then((data) => {
        //                 let result = {}
        //                 for (let k=start; k<=end; k++) {
        //                   const val = data[cnt++];

        //                   result[k]["b_no"] = val["b_no"];
        //                   result[k]["tax_type"] = val["tax_type"];
        //                   result[k]["end_dt"] = val["end_dt"];
        //                 }
        //                 return result
        //               })
        //               .then((sheet) => {
        //                 console.log("\n update \n")
        //                 console.log(sheet)
        //               })
    }
  })
}

app.whenReady().then(() => {

  ipcMain.on('request-data-file', handleDataFile)

  // Create View 
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
