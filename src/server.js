const express = require('express');
const app = express();
const port = 3000;
const { addRows } = require('./node.js');
const { writeFileAndDownload } = require('./writeFile.js');

app.use(express.json());
app.post('/api/addRows', (req, res) => {
    addRows(req, res);
});

app.post('/download', (req, res) => {
    const data = req.body;  // The data received from the frontend
    const filename = 'report.xlsx';

    // Call your function to write the file
    writeFileAndDownload(filename, data);

    // Send the file back to the client
    res.download(filename, filename, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error generating report');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
