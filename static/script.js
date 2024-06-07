document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const ALLOWED_EXT = ['jpg', 'jpeg', 'png'];

    function isFileAllowed(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return ALLOWED_EXT.includes(fileExtension);
    }

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('drag-over');
        const files = event.dataTransfer.files;
        if (files.length > 0 && isFileAllowed(files[0])) {
            fileInput.files = files;
        } else {
            alert('Only image files (jpg, jpeg, png) are allowed.');
        }
    });

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!isFileAllowed(file)) {
            alert('Only image files (jpg, jpeg, png) are allowed.');
            fileInput.value = ''; // Clear the input
        }
    });
});
