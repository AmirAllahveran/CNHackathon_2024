document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('upload-form');
    const resultDiv = document.getElementById('result');
    const imageInfo = document.getElementById('image-info');
    const imageName = document.getElementById('image-name');
    const viewImageButton = document.getElementById('view-image');
    const removeImageButton = document.getElementById('remove-image');
    const modalImage = document.getElementById('modal-image');
    const imageModal = $('#imageModal');
    const predictButton = uploadForm.querySelector('input[type="submit"]');

    function showImageInfo(file) {
        imageName.textContent = `File name: ${file.name}`;
        imageInfo.style.display = 'block';
        dropArea.style.display = 'none';
        predictButton.disabled = false;

        const reader = new FileReader();
        reader.onload = function(event) {
            modalImage.src = event.target.result;
        };
        reader.readAsDataURL(file);

        viewImageButton.addEventListener('click', () => {
            imageModal.modal('show');
        });

        removeImageButton.addEventListener('click', () => {
            fileInput.value = '';
            imageInfo.style.display = 'none';
            dropArea.style.display = 'flex';
            predictButton.disabled = true;
            modalImage.src = '';
            resultDiv.innerHTML = ''; // Clear the result section
        });
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
            showImageInfo(files[0]);
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
            showImageInfo(files[0]);
        } else {
            alert('Please select an image file.');
            fileInput.value = ''; // Clear the input
            imageInfo.style.display = 'none';
            dropArea.style.display = 'flex';
            predictButton.disabled = true;
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
