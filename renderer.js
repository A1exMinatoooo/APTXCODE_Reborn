const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const folderPathInput = document.getElementById('folderPath');
    const chunkSizeInput = document.getElementById('chunkSize');
    const templateTextarea = document.getElementById('template');
    const generateButton = document.getElementById('generateButton');
    const resultTextarea = document.getElementById('resultTextarea');

    generateButton.addEventListener('click', () => {
        const folderPath = folderPathInput.value;
        const chunkSize = parseInt(chunkSizeInput.value) || 1;
        const template = templateTextarea.value;

        if (!folderPath || !chunkSize || !template) {
            alert('Please fill in all fields.');
            return;
        }

        // Process folder and generate result
        const result = processFolder(folderPath, chunkSize, template);
        resultTextarea.value = result;
    });

    function processFolder(folderPath, chunkSize, template) {
        // TODO: file processing logic and generate BT seed and magnet link
        // For now, just return a placeholder result
        return `Generate content for ${folderPath}, ${chunkSize}, ${template}`;
    }
});