const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const xlsx = require("xlsx");
const axios = require("axios");

let win;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./pages/index.html");
  return win;
};

// b_stt , tax_type , end_dt
const transResponse = (aDataList) => {
  const result = aDataList.map((data) => {
    return {
      b_no: data["b_no"],
      tax_type: data["tax_type"],
      end_dt: data["end_dt"],
    };
  });
  return result;
};

const isEmpty = (target) => {
  return target == null || target == undefined;
};

const callDataPortal = async (dataList) => {
  const portalUrl =
    "https://api.odcloud.kr/api/nts-businessman/v1/status" +
    "?serviceKey=" +
    "ifyAoaKqxfgiVhk%2FgPgUZO21ZVQjlIy8kH0M9JygCw5mKqFYgU79I5h3Nzr%2FSB%2BwFUS3%2FvK%2BhAPwAuw%2Br6xVJw%3D%3D";

  const body = {
    b_no: dataList,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  try {
    let response = await axios.post(portalUrl, body, config);
    return response.status == 200 ? response.data : null;
  } catch (err) {
    console.log(err);
  }
};

const collectDataList = async (jsonsheet, defaultStep) => {
  let result = [];
  const range = jsonsheet.length;
  const cnt = Math.floor(range / defaultStep);

  for (let i = 0; i <= cnt; i++) {
    const start = i * defaultStep;
    const end = start + 99 > range ? range - 1 : start + 99;

    // Insert ID List
    let targetList = [];
    for (let k = start; k <= end; k++) {
      targetList.push(String(jsonsheet[k]["id"]));
    }

    let response = await callDataPortal(targetList);

    // Match Data
    chunkdata = transResponse(response["data"]);
    result.push(...chunkdata);

    handleProcessCnt(i, cnt);
  }

  return result;
};

const createNewXlsxFile = (aDataList, aDirPath) => {
  let makeBook = xlsx.utils.book_new();
  let makesheet = xlsx.utils.json_to_sheet(aDataList);
  xlsx.utils.book_append_sheet(makeBook, makesheet, "result");
  xlsx.writeFile(makeBook, path.join(aDirPath, "out.xlsx"));
};

const handleProcessCnt = (curr, total) =>
  win.webContents.send("update-counter", curr, total);
const handleEndProcess = () => win.webContents.send("end-process");

const handleDataFile = (event, filePath) => {
  const workbook = xlsx.readFile(filePath, { type: "binary" });

  workbook.SheetNames.forEach(async (name) => {
    const jsonsheet = xlsx.utils.sheet_to_json(workbook.Sheets[name]);
    const range = jsonsheet.length;
    const defaultStep = 100;
    const cnt = Math.floor(range / defaultStep);

    // Call Data
    let datalist = await collectDataList(jsonsheet, defaultStep);

    try {
      const dirPath = path.parse(filePath).dir;
      createNewXlsxFile(datalist, dirPath);
      handleEndProcess();
    } catch (err) {
      console.log(err);
    }
  });
};

app.whenReady().then(() => {
  ipcMain.on("request-data-file", handleDataFile);

  // Create View
  win = createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
