const requestDataBtn = document.getElementById("request-data-btn");
const counter = document.getElementById("counter");

const isFileStatus = (file) => {
  return file != null && file != undefined;
};

requestDataBtn.addEventListener("click", (event) => {
  const targetFile = document.getElementById("formFile").files[0];

  // Non Input File
  if (!isFileStatus(targetFile)) {
    alert("파일 입력 필요");
    return;
  }

  window.electronAPI.requestDataFile(targetFile.path);
});

window.electronAPI.handleProcessCnt((event, curr, total) => {
  counter.innerText = curr + " / " + total;
  counter.style.width = 100;
});

window.electronAPI.handleEndProcess((event, downloadLink) => {
  alert("생성 완료");
});
