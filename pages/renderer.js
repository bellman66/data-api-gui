const requestDataBtn = document.getElementById("request-data-btn");
const fileTitle = document.getElementById("file-title");
const downloadBtn = document.getElementById("download-result-btn");
const counter = document.getElementById('counter')

const isFileStatus = (file) => {
  return file != null && file != undefined
}

const updateDisplayStatus = (id, isDisplay) => {
  document.getElementById(id).style.display = isDisplay
} 

// init
updateDisplayStatus("download-result-btn", 'none')

requestDataBtn.addEventListener('click', (event) => {
  const targetFile = document.getElementById("file").files[0];
  
  // Non Input File
  if (!isFileStatus(targetFile)) {
    alert("파일 입력 필요")

    updateDisplayStatus("download-result-btn", 'none')
    return;
  }

  window.electronAPI.requestDataFile(targetFile.path)
})

downloadBtn.addEventListener('click', (event) => {
  updateDisplayStatus("download-result-btn", 'none')
})

window.electronAPI.handleProcessCnt((event, curr, total) => {
  counter.innerText = curr + " / " + total
})

window.electronAPI.handleEndProcess((event, downloadLink) => {
  downloadBtn.href = downloadLink
  updateDisplayStatus("download-result-btn", 'block')

  alert("생성 완료")
})