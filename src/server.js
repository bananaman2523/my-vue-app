const express = require('express');
const app = express();
const port = 3000;
const { addRows } = require('./node.js');
const { writeFileAndDownload } = require('./writeFile.js');
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.post('/api/addRows', (req, res) => {
    addRows(req, res);
});

app.get('/download', (req, res) => {
    const filename = 'data.xlsx';

    // Generate the Excel file
    writeFileAndDownload(filename);

    // Wait for the file to be created and send it to the client
    setTimeout(() => {
        const filePath = path.join(__dirname, filename);

        // Send the file as a download response
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                return;
            }

            // Delete the file after sending it
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
            });
        });
    }, 1000); // Wait 1 second to make sure the file is generated
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
