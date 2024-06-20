document.getElementById('pdfForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    // Show loading spinner and hide result div
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';

    fetch('/compress', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('result');
        const loadingDiv = document.getElementById('loading');

        if (data.success) {
            const originalSizeKB = (data.originalSize / 1024).toFixed(2);
            const compressedSizeKB = (data.compressedSize / 1024).toFixed(2);

            resultDiv.innerHTML = `
                <p><strong>PDF is compressed!</strong></p>
                <p>Original Size: ${originalSizeKB} KB</p>
                <p>Compressed Size: ${compressedSizeKB} KB</p>
                <a href="${data.url}" download>Download</a>
            `;
            loadingDiv.style.display = 'none';
            resultDiv.style.display = 'flex';
        } else {
            resultDiv.innerHTML = `<p><strong>${data.message}</strong></p>`;
            loadingDiv.style.display = 'none';
            resultDiv.style.display = 'flex';
        }
    })
    .catch(error => {
        const resultDiv = document.getElementById('result');
        const loadingDiv = document.getElementById('loading');

        resultDiv.textContent = 'Error compressing PDF.';
        loadingDiv.style.display = 'none';
        resultDiv.style.display = 'flex';
        console.error('Error:', error);
    });
});

const fileDropArea = document.getElementById('fileDropArea');
const fileInput = document.getElementById('pdfFile');

fileDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    fileDropArea.classList.add('drag-over');
});

fileDropArea.addEventListener('dragleave', () => {
    fileDropArea.classList.remove('drag-over');
});

fileDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    fileDropArea.classList.remove('drag-over');

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
    }
});