const requestDataBtn = document.getElementById("request-data-btn");
const fileTitle = document.getElementById("file-title");
const counter = document.getElementById('counter')

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

window.electronAPI.handleProcessCnt((event, curr, total) => {
  counter.innerText = curr + " / " + total
})

window.electronAPI.handleEndProcess((event, downloadLink) => {
  alert("생성 완료")
})