document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('upload-form');
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('image-preview');
    const predictButton = uploadForm.querySelector('input[type="submit"]');

    function updateImagePreview(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.innerHTML = `
                    <div class="image-container">
                        <img src="${event.target.result}" class="img-thumbnail" alt="Selected Image">
                        <span class="close-icon">&times;</span>
                    </div>
                `;
                const closeIcon = imagePreview.querySelector('.close-icon');
                closeIcon.addEventListener('click', () => {
                    fileInput.value = '';
                    imagePreview.innerHTML = '';
                    predictButton.disabled = true;
                });
            };
            reader.readAsDataURL(file);
            predictButton.disabled = false;
        } else {
            imagePreview.innerHTML = '';
            predictButton.disabled = true;
        }
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
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            fileInput.files = files;
            updateImagePreview(files[0]);
        } else {
            alert('Please drop an image file.');
        }
    });

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            updateImagePreview(files[0]);
        } else {
            alert('Please select an image file.');
            fileInput.value = ''; // Clear the input
            updateImagePreview(null);
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
                        <img src="${data.image_path}" class="img-thumbnail result-image" alt="Processed Image">
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
