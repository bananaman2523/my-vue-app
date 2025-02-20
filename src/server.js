const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;
const { addRows } = require('./services/node.js');
const { writeFileAndDownload } = require('./services/writeFile.js');
const { writeExcel } = require('./services/writeFileProduct.js');
const { writeExcelShipping } = require('./services/writeFileShipping.js');
const { generatePDF } = require("./template/install/installation-report.js");

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
    const filename = 'output_with_image.xlsx';

    writeExcel(filename, data).then(() => {
        // Send the file back as a response
        res.download(filename, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).send("Error downloading the report");
            }
        });
    }).catch((err) => {
        console.error("Error generating report:", err);
        res.status(500).send('Error generating report');
    });
});

app.post('/downloadShipping', (req, res) => {
    const data = req.body;
    const filename = 'output_with_image.xlsx';

    writeExcelShipping(filename, data).then(() => {
        res.download(filename, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).send("Error downloading the report");
            }
        });
    }).catch((err) => {
        console.error("Error generating report:", err);
        res.status(500).send('Error generating report');
    });
});

app.post('/downloadPDF', async (req, res) => {
    try {
        const filePath = 'install_document.pdf';

        await generatePDF(filePath, req.body);

        res.download(filePath, 'install_document.pdf', (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).send('Error downloading file');
            }
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
