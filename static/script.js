document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('upload-form');
    const resultDiv = document.getElementById('result');

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
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            fileInput.files = files;
        } else {
            alert('Please drop an image file.');
        }
    });

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        if (files.length > 0 && !files[0].type.startsWith('image/')) {
            alert('Please select an image file.');
            fileInput.value = ''; // Clear the input
        }
    });

    uploadForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData();
        const file = fileInput.files[0];
        if (file) {
            formData.append('file', file);

            fetch('/predict', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    resultDiv.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
                } else {
                    resultDiv.innerHTML = `
                        <div class="alert alert-success">Prediction successful!</div>
                        <p>${data.info}</p>
                        <img src="${data.image_path}" class="img-responsive" alt="Processed Image">
                    `;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultDiv.innerHTML = `<div class="alert alert-danger">An error occurred while processing the image.</div>`;
            });
        } else {
            alert('Please select an image file first.');
        }
    });
});
