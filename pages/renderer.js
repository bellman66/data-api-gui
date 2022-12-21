const test_btn = document.getElementById("test_btn");
const file = document.getElementById("file");

file.addEventListener('change', (event) => {
    const fileList = event.target.files;

    
})

test_btn.addEventListener("click", () => {
  file_title.innerText = "test ok";
});
