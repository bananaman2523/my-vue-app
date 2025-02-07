const XLSX = require('xlsx');

function writeFileAndDownload(filename = 'data.xlsx', data) {
    // Transform data to match the header
    const transformedData = data.map(item => ({
        id: item.id,
        'วันที่รับ': item.receive_date,
        'ชื่อ supplier': item.name_supplier,
        'เลขที่ใบส่งสินค้า': item.bill_lading_number,
        'วันเลขที่ใบส่งสินค้า': item.bill_lading_number_date,
        'เลขที่ใบกำกับภาษี': item.invoice_number,
        'Invoice date': item.invoice_number_date,
        'เลขที่ใบเสร็จ': item.receipt_number,
        'วันที่ใบเสร็จ': item.receipt_number_date,
        'เลขที่ใบวางบิล': item.bill_number,
        'วันที่ due ชำระ': item.due_date,
        'Item code': item.item_code,
        'ชื่อสินค้า (Supplier)': item.product_name_supplier,
        'รหัสสินค้า Office Design': item.product_code_office_design,
        'ชื่อสินค้า Office Design': item.product_name_office_design,
        'หมวดหมู่สินค้า': item.group_product,
        model: item.model,
        'S/N': item.serial_number
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(transformedData, {
        header: [
            'id', 'วันที่รับ', 'ชื่อ supplier', 'เลขที่ใบส่งสินค้า', 'วันเลขที่ใบส่งสินค้า',
            'เลขที่ใบกำกับภาษี', 'Invoice date', 'เลขที่ใบเสร็จ', 'วันที่ใบเสร็จ', 'เลขที่ใบวางบิล',
            'วันที่ due ชำระ', 'Item code', 'ชื่อสินค้า (Supplier)', 'รหัสสินค้า Office Design',
            'ชื่อสินค้า Office Design', 'หมวดหมู่สินค้า', 'model', 'S/N'
        ]
    });

    // Create workbook and append the sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write to file
    XLSX.writeFile(wb, filename);
}

module.exports = { writeFileAndDownload };
