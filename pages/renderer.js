const requestDataBtn = document.getElementById("request-data-btn");
const fileTitle = document.getElementById("file-title");

// onWebcontentsValue에 대한 이벤트 수신
// ipcRenderer.on('onWebcontentsValue', (evt, payload) => {
//   file_title.innerText = 'init OK'
// })

const isFileStatus = (file) => {
  return file != null && file != undefined
}

requestDataBtn.addEventListener('click', (event) => {
  const targetFile = document.getElementById("file").files[0];
  
  // Non Input File
  if (!isFileStatus(targetFile)) {
    alert("파일 입력 필요")
    return;
  }

  window.electronAPI.requestDataFile(targetFile.path)
})
