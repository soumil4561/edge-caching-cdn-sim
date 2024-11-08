// services/download.service.js
const fs = require('fs');

const sendFilefromPath = (filePath) => {
    return new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error("File does not exist:", filePath);
                return resolve({ success: false, error: 'File not found' });
            }
            resolve({ success: true, filePath });
        });
    });
};

module.exports = {
    sendFilefromPath
};
