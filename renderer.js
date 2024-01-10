const { ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const Promise = require('bluebird');

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

        try {
            const result = await processFolder(folderPath, chunkSize, template);
            resultTextarea.value = result;
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    async function processFolder(folderPath, chunkSize, template) {
        const files = await readFilesInFolder(folderPath);
        const seedInfo = await generateSeedInfo(files, chunkSize, template);
        const bbCode = generateBBCode(seedInfo);
        return bbCode;
    }

    async function readFilesInFolder(folderPath) {
        try {
            const fileNames = await fs.readdir(folderPath);
            const filePaths = fileNames.map(fileName => path.join(folderPath, fileName));
            return Promise.filter(filePaths, async filePath => {
                const stat = await fs.stat(filePath);
                return stat.isFile();
            });
        } catch (error) {
            throw new Error(`Error reading files in folder: ${error.message}`);
        }
    }

    async function generateSeedInfo(files, chunkSize, template) {
        try { 
            const chunks = await Promise.map(files, async filePath => {
                const hash = await calculateFileHash(filePath);
                const fileSize = (await fs.stat(filePath)).size;
                const numChunks = Math.ceil(fileSize / (chunkSize * 1024 * 1024));
                return { filePath, hash, fileSize, numChunks };
            });
            
            return { chunks, template };
        } catch (error) {
            throw new Error(`Error generating seed info: ${error.message}`);
        }
    }

    async function calculateFileHash(filePath) {
        const hash = crypto.createHash('sha1');
        const fileStream = fs.createReadStream(filePath);
        return new Promise((resolve, reject) => {
            fileStream.on('data', data => hash.update(data));
            fileStream.on('end', () => resolve(hash.digest('hex')));
            fileStream.on('error', error => reject(error));
        })
    }

    function generateBBCode(seedInfo) {
        // TODO: Implement BBCode generation logic using the seedInfo
        // For now, just return a placeholder BBCode
        return `Generated BBCode: ${seedInfo.template}`;
    }
});