const formFile = document.getElementById("formFile");
const requestDataBtn = document.getElementById("request-data-btn");

const counterWrapper = document.getElementById("counter-wrapper");
const counter = document.getElementById("counter");


// Function
const isFileStatus = (file) => {
  return file != null && file != undefined;
};

const updateVisibility = (target, status) => {
  document.getElementById(target).style.visibility = status
}

const handleViewFileStatus = (status) => {
  updateVisibility("counter-wrapper", status);
  updateVisibility("request-data-btn", status);
}


// Init
handleViewFileStatus('hidden')


// Listener
formFile.addEventListener("change", (event) => {
    // Non Input File
  if (!isFileStatus(formFile.files[0])) {
    handleViewFileStatus('hidden')
    alert("파일 입력 필요");
    return;
  }

  handleViewFileStatus('visible')
})

requestDataBtn.addEventListener("click", (event) => {
  const targetFile = formFile.files[0];
  window.electronAPI.requestDataFile(targetFile.path);
  updateVisibility("request-data-btn", 'hidden');
});

window.electronAPI.handleProcessCnt((event, curr, total) => {
  const per = ((curr / total) * 100);
  counter.innerText = Math.trunc(per) + '%';
  counter.style.width = per + '%';
});

window.electronAPI.handleEndProcess((event, downloadLink) => {
  handleViewFileStatus('hidden')
  alert("생성 완료");
});
