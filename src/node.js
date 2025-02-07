const { google } = require("googleapis");
const sheets = google.sheets("v4");
const fs = require("fs");

const credentials = JSON.parse(fs.readFileSync("./services/service-account.json"));
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
});

async function addRows(req, res) {
    try {
        const authClient = await auth.getClient();

        const spreadsheetId = "16XsciBwffGUXPSpf4bFQQf996Oil58RmvbMBBc1ZxHs";
        const range = "SheetA!A1";
        const newRows = [req.body.rows];
        const requestBody = {
            values: newRows,
        };
        const response = await sheets.spreadsheets.values.append({
            auth: authClient,
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody,
        });

        console.log("Rows added successfully:", response.data);
        res.status(200).json(response.data);
    } catch (err) {
        console.error("Error adding rows:", err);
        res.status(500).json({ error: err.message || "Unknown error occurred" });
    }
}


module.exports = { addRows };
