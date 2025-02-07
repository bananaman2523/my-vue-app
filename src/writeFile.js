const XLSX = require('xlsx');

function writeFileAndDownload(filename = 'data.xlsx') {
    // Data for each row, where each object represents a row of data with the corresponding columns
    const data = [
        {
            id: 1,
            'วันที่รับ': '2025-02-01',
            'ชื่อ supplier': 'Supplier A',
            'เลขที่ใบส่งสินค้า': 'INV001',
            'วันเลขที่ใบส่งสินค้า': '2025-02-01',
            'เลขที่ใบกำกับภาษี': 'TAX001',
            'Invoice date': '2025-02-01',
            'เลขที่ใบเสร็จ': 'REC001',
            'วันที่ใบเสร็จ': '2025-02-02',
            'เลขที่ใบวางบิล': 'BILL001',
            'วันที่ due ชำระ': '2025-02-15',
            'Item code': 'ITEM001',
            'ชื่อสินค้า (Supplier)': 'Product A',
            'รหัสสินค้า Office Design': 'CODE001',
            'ชื่อสินค้า Office Design': 'Product Office A',
            'หมวดหมู่สินค้า': 'Office',
            model: 'Model A',
            'S/N': 'SN001'
        },
        {
            id: 2,
            'วันที่รับ': '2025-02-02',
            'ชื่อ supplier': 'Supplier B',
            'เลขที่ใบส่งสินค้า': 'INV002',
            'วันเลขที่ใบส่งสินค้า': '2025-02-02',
            'เลขที่ใบกำกับภาษี': 'TAX002',
            'Invoice date': '2025-02-02',
            'เลขที่ใบเสร็จ': 'REC002',
            'วันที่ใบเสร็จ': '2025-02-03',
            'เลขที่ใบวางบิล': 'BILL002',
            'วันที่ due ชำระ': '2025-02-16',
            'Item code': 'ITEM002',
            'ชื่อสินค้า (Supplier)': 'Product B',
            'รหัสสินค้า Office Design': 'CODE002',
            'ชื่อสินค้า Office Design': 'Product Office B',
            'หมวดหมู่สินค้า': 'Office',
            model: 'Model B',
            'S/N': 'SN002'
        }
        // Add more rows as needed
    ];

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(data, {
        header: [
            'id', 'วันที่รับ', 'ชื่อ supplier', 'เลขที่ใบส่งสินค้า', 'วันเลขที่ใบส่งสินค้า',
            'เลขที่ใบกำกับภาษี', 'Invoice date', 'เลขที่ใบเสร็จ', 'วันที่ใบเสร็จ', 'เลขที่ใบวางบิล',
            'วันที่ due ชำระ', 'Item code', 'ชื่อสินค้า (Supplier)', 'รหัสสินค้า Office Design',
            'ชื่อสินค้า Office Design', 'หมวดหมู่สินค้า', 'model', 'S/N'
        ]
    });

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write the file to disk
    XLSX.writeFile(wb, filename);
}

module.exports = { writeFileAndDownload };
