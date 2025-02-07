const express = require('express');
const app = express();
const port = 3000;
const { addRows } = require('./node.js');

app.use(express.json());
app.post('/api/addRows', (req, res) => {
    addRows(req, res);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
