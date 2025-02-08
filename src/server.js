const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const { addRows } = require('./services/node.js');
const { writeFileAndDownload } = require('./services/writeFile.js');
// const { writeFileProductAndDownload } = require('./services/writeFileProduct.js');

app.use(express.json());
app.post('/api/addRows', (req, res) => {
    addRows(req, res);
});

app.use(cors({
    origin: 'http://localhost:8080',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  }));

app.post('/download', (req, res) => {
    const data = req.body;
    const filename = 'report.xlsx';

    writeFileAndDownload(filename, data);

    res.download(filename, filename, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error generating report');
        }
    });
});

app.post('/downloadProduct', (req, res) => {
    const data = req.body;
    const filename = 'report.xlsx';

    writeFileProductAndDownload(filename, data);

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
