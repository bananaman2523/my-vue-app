const XLSX = require('xlsx-js-style');

function formatDate(date) {
    if (!date) return ''; // Handle null or undefined dates
    return new Date(date).toLocaleDateString('en-GB'); // Format to 'DD/MM/YYYY' or adjust as needed
}

function writeFileAndDownload(filename = 'data.xlsx', data) {
    const transformedData = data.map(item => ({
        id: item.id,
        'วันที่รับ': formatDate(item.receive_date),
        'ชื่อ supplier': item.name_supplier,
        'เลขที่ใบส่งสินค้า': item.bill_lading_number,
        'วันเลขที่ใบส่งสินค้า': formatDate(item.bill_lading_number_date),
        'เลขที่ใบกำกับภาษี': item.invoice_number,
        'Invoice date': formatDate(item.invoice_number_date),
        'เลขที่ใบเสร็จ': item.receipt_number,
        'วันที่ใบเสร็จ': formatDate(item.receipt_number_date),
        'เลขที่ใบวางบิล': item.bill_number,
        'วันที่ due ชำระ': formatDate(item.due_date),
        'Item code': item.item_code,
        'ชื่อสินค้า (Supplier)': item.product_name_supplier,
        'รหัสสินค้า Office Design': item.product_code_office_design,
        'ชื่อสินค้า Office Design': item.product_name_office_design,
        'หมวดหมู่สินค้า': item.group_product,
        model: item.model,
        'S/N': item.serial_number
    }));

    const ws = XLSX.utils.json_to_sheet(transformedData, {
        header: [
            'id', 'วันที่รับ', 'ชื่อ supplier', 'เลขที่ใบส่งสินค้า', 'วันเลขที่ใบส่งสินค้า',
            'เลขที่ใบกำกับภาษี', 'Invoice date', 'เลขที่ใบเสร็จ', 'วันที่ใบเสร็จ', 'เลขที่ใบวางบิล',
            'วันที่ due ชำระ', 'Item code', 'ชื่อสินค้า (Supplier)', 'รหัสสินค้า Office Design',
            'ชื่อสินค้า Office Design', 'หมวดหมู่สินค้า', 'model', 'S/N'
        ]
    });

    // Define column widths
    ws['!cols'] = [
        { wpx: 50 }, { wpx: 100 }, { wpx: 150 }, { wpx: 150 }, { wpx: 120 },
        { wpx: 150 }, { wpx: 100 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 },
        { wpx: 120 }, { wpx: 120 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 },
        { wpx: 120 }, { wpx: 100 }, { wpx: 100 },
    ];

    // Apply styles to headers
    const headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '4F81BD' } }, // Blue background
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
        }
    };

    // Apply styles to data cells
    const cellStyle = {
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
        }
    };

    // Loop through all cells and apply styles
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
        if (ws[headerCell]) ws[headerCell].s = headerStyle;

        for (let R = 1; R <= range.e.r; ++R) {
            const dataCell = XLSX.utils.encode_cell({ r: R, c: C });
            if (ws[dataCell]) ws[dataCell].s = cellStyle;
        }
    }

    // Create a new workbook and append the styled sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write the Excel file
    XLSX.writeFile(wb, filename);
}

module.exports = { writeFileAndDownload };
