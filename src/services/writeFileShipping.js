const ExcelJS = require("exceljs");
const fs = require("fs");

function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

async function writeExcelShipping(filename, data) {

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const borderStyle = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } }
    };

    // Merge A1:C4 for the image
    worksheet.mergeCells("A1:C4");

    // Merge N1:Q1 for the company name
    worksheet.mergeCells("N1:Q1");
    worksheet.mergeCells("N2:Q2");
    worksheet.mergeCells("N3:Q3");
    worksheet.mergeCells("N4:Q4");
    worksheet.mergeCells("N5:Q5");

    // Add company name text in N1
    const cell1 = worksheet.getCell("N1");
    cell1.value = "บริษัท ออฟฟิศดีไซน์ จำกัด (สำนักงานใหญ่)";
    cell1.font = { bold: false, size: 10, color: { argb: "000000" } };
    cell1.alignment = { horizontal: "right", vertical: "middle" };

    const cell2 = worksheet.getCell("N2");
    cell2.value = "เลขที่ 304 อาคาร วานิชเพลส อารีย์ ห้องเลขที่ 2208 ชั้นที่ 22";
    cell2.font = { bold: false, size: 10, color: { argb: "000000" } };
    cell2.alignment = { horizontal: "right", vertical: "middle" };

    const cell3 = worksheet.getCell("N3");
    cell3.value = "ถนน พหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพมหานคร  10400";
    cell3.font = { bold: false, size: 10, color: { argb: "000000" } };
    cell3.alignment = { horizontal: "right", vertical: "middle" };

    const cell4 = worksheet.getCell("N4");
    cell4.value = "เลขประจำตัวผู้เสียภาษี 0105547064270";
    cell4.font = { bold: false, size: 10, color: { argb: "000000" } };
    cell4.alignment = { horizontal: "right", vertical: "middle" };

    const cell5 = worksheet.getCell("N5");
    cell5.value = "โทร : 02-623-1515";
    cell5.font = { bold: false, size: 10, color: { argb: "000000" } };
    cell5.alignment = { horizontal: "right", vertical: "middle" };

    // Merge A6:Q8 for "เอกสารจัดเตรียมสินค้า"
    worksheet.mergeCells("A6:Q8");
    worksheet.getCell("A6").value = "เอกสารการส่งมอบสินค้า ปี 2025";
    worksheet.getCell("A6").font = { bold: true, size: 22 };
    worksheet.getCell("A6").alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("A9:Q9");
    worksheet.getCell("A9").value = "เอกสารภายในบริษัท";
    worksheet.getCell("A9").font = { bold: false, size: 12 };
    worksheet.getCell("A9").alignment = { horizontal: "center", vertical: "middle" };

    worksheet.getCell("O10").value = "เอกสารเลขที่ :";
    worksheet.getCell("O10").font = { bold: true, size: 12 };
    worksheet.getCell("O10").alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("P10:Q10");

    worksheet.mergeCells("M11:O11");
    worksheet.getCell("M11").value = "อ้างอิง ใบวางบิล/ใบส่งของ เลขที่ :";
    worksheet.getCell("M11").font = { bold: false, size: 12 };
    worksheet.getCell("M11").alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("P11:Q11");

    worksheet.getCell("B13").value = "บริษัท / ร้าน :";
    worksheet.getCell("B13").font = { bold: false, size: 12 };
    worksheet.getCell("B13").alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("C13:D13");

    worksheet.getCell("E13").value = "สาขา :";
    worksheet.getCell("E13").font = { bold: false, size: 12 };
    worksheet.getCell("E13").alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("F13:H13");

    worksheet.getCell("I13").value = "โทร :";
    worksheet.getCell("I13").font = { bold: false, size: 12 };
    worksheet.getCell("I13").alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("J13:L13");

    worksheet.getCell("M13").value = "วันที่ส่งมอบ :";
    worksheet.getCell("M13").font = { bold: false, size: 12 };
    worksheet.getCell("M13").alignment = { horizontal: "right", vertical: "middle" };

    worksheet.mergeCells("N13:P13");

    worksheet.mergeCells("B42:H42");
    worksheet.getCell("B42").value = "รายละเอียดเพิ่มเติม / หมายเหตุ : ..............................................................................................................................................";
    worksheet.getCell("B42").font = { bold: false, size: 12 };
    worksheet.getCell("B42").alignment = { horizontal: "left", vertical: "middle" };
    worksheet.mergeCells("B43:H43");
    worksheet.getCell("B43").value = "...................................................................................................................................................................................................";
    worksheet.getCell("B43").font = { bold: false, size: 12 };
    worksheet.getCell("B43").alignment = { horizontal: "left", vertical: "middle" };
    worksheet.mergeCells("B44:H44");
    worksheet.getCell("B44").value = "...................................................................................................................................................................................................";
    worksheet.getCell("B44").font = { bold: false, size: 12 };
    worksheet.getCell("B44").alignment = { horizontal: "left", vertical: "middle" };

    worksheet.mergeCells("B46:H46");
    worksheet.getCell("B46").value = "สำหรับลูกค้า : กรุณาตรวจสอบ ลงลายมือชื่อ และเก็บสำเนาเอกสารไว้เป็นหลักฐานการรับสินค้า";
    worksheet.getCell("B46").font = { bold: false, size: 12 };
    worksheet.getCell("B46").alignment = { horizontal: "left", vertical: "middle" };
    worksheet.mergeCells("B47:H47");
    worksheet.getCell("B47").value = "สำหรับแอดมิน Office Design :  กรุณาเก็บเอกสารนี้ไว้ในระบบ เพื่อใช้แทนใบเบิกสินค้า";
    worksheet.getCell("B47").font = { bold: false, size: 12 };
    worksheet.getCell("B47").alignment = { horizontal: "left", vertical: "middle" };




    worksheet.mergeCells("N41:Q41");
    worksheet.getCell("N41").value = "**กรุณาเขียนตัวบรรจง**";
    worksheet.getCell("N41").font = { bold: false, size: 12 };
    worksheet.getCell("N41").alignment = { horizontal: "center", vertical: "middle" };


    worksheet.getCell("K42").value = "ผู้จัดเตรียม";
    worksheet.getCell("K42").font = { bold: false, size: 12 };
    worksheet.getCell("K42").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("L42").value = "ผู้ตรวจส่ง";
    worksheet.getCell("L42").font = { bold: false, size: 12 };
    worksheet.getCell("L42").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("M42").value = "ผู้ตรวจรับ (ลูกค้า)";
    worksheet.getCell("M42").font = { bold: false, size: 12 };
    worksheet.getCell("M42").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("J43").value = "วันที่";
    worksheet.getCell("J43").font = { bold: false, size: 12 };
    worksheet.getCell("J43").alignment = { horizontal: "right", vertical: "middle" };

    worksheet.getCell("M41").value = "..............................";
    worksheet.getCell("M41").font = { bold: false, size: 12 };
    worksheet.getCell("M41").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("M43").value = "..............................";
    worksheet.getCell("M43").font = { bold: false, size: 12 };
    worksheet.getCell("M43").alignment = { horizontal: "center", vertical: "middle" };

    // Apply styles and alignment
    for (let row = 15; row <= 40; row++) {
        for (let col = 1; col <= 17; col++) {
            const cell = worksheet.getCell(row, col);
            cell.border = borderStyle;
        }
    }
    for (let row = 15; row <= 40; row++) {
        worksheet.mergeCells(`B${row}:C${row}`);
    }
    for (let row = 15; row <= 40; row++) {
        worksheet.mergeCells(`E${row}:G${row}`);
    }
    for (let row = 15; row <= 40; row++) {
        worksheet.mergeCells(`H${row}:J${row}`);
    }
    for (let row = 15; row <= 40; row++) {
        worksheet.mergeCells(`N${row}:Q${row}`);
    }
    // Set column widths for A:Q
    const columnWidths = [
        { width: 80 / 7 }, { width: 100 / 7 }, { width: 185 / 7 }, { width: 100 / 7 }, { width: 100 / 7 }, { width: 100 / 7 },
        { width: 100 / 7 }, { width: 100 / 7 }, { width: 100 / 7 }, { width: 100 / 7 }, { width: 120 / 7 }, { width: 120 / 7 },
        { width: 120 / 7 }, { width: 100 / 7 }, { width: 100 / 7 }, { width: 100 / 7 }, { width: 100 / 7 }
    ];

    for (let i = 0; i < 17; i++) {
        worksheet.getColumn(i + 1).width = columnWidths[i].width;
    }

    const fields = [
        { cell: "A15", value: "ลำดับที่" },
        { cell: "B15", value: "อุปกรณ์" },
        { cell: "D15", value: "จำนวน" },
        { cell: "E15", value: "รุ่น" },
        { cell: "H15", value: "Serial number" },
        { cell: "K15", value: "ตรวจโดย\nผู้จัดเตรียม" },
        { cell: "L15", value: "ตรวจโดย\nผู้ตรวจส่ง" },
        { cell: "M15", value: "ตรวจโดยผู้รับ\n(ลูกค้า)" },
        { cell: "N15", value: "หมายเหตุ" },
    ];

    fields.forEach(({ cell, value }) => {
        const c = worksheet.getCell(cell);
        c.value = value;
        c.font = { bold: true, size: 12 };
        c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    });

    // input data

    data.packing_sheet[0].stock.forEach((stock, index) => {
        const row = 16 + index;

        worksheet.getCell(`A${row}`).value = (index + 1);;
        worksheet.getCell(`B${row}`).value = stock.group_product;
        worksheet.getCell(`D${row}`).value = 1;
        worksheet.getCell(`E${row}`).value = stock.model;
        worksheet.getCell(`H${row}`).value = stock.serial_number;
        worksheet.getCell(`K${row}`).value = data.packing_sheet[0].prepared_by || "N/A";
        worksheet.getCell(`L${row}`).value = data.packing_sheet[0].checked_by || "N/A";
        worksheet.getCell(`N${row}`).value = stock.description;
    });


    worksheet.getCell(`K41`).value = data.packing_sheet[0].prepared_by;
    worksheet.getCell(`K43`).value = formatDate(data.packing_sheet[0].product_preparation_date);
    worksheet.getCell("K41").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("K43").alignment = { horizontal: "center", vertical: "middle" };

    worksheet.getCell(`L41`).value = data.packing_sheet[0].checked_by;
    worksheet.getCell(`L43`).value = formatDate(data.packing_sheet[0].checked_date);
    worksheet.getCell("L41").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("L43").alignment = { horizontal: "center", vertical: "middle" };

    // info input
    worksheet.getCell(`P10`).value = data.document_delivery_number;
    worksheet.getCell("P10").alignment = { horizontal: "left", vertical: "middle" };

    worksheet.getCell(`P11`).value = data.document_delivery_number;
    worksheet.getCell("P11").alignment = { horizontal: "left", vertical: "middle" };

    worksheet.getCell(`C13`).value = data.packing_sheet[0].company_name;
    worksheet.getCell("C13").alignment = { horizontal: "left", vertical: "middle" };

    worksheet.getCell(`F13`).value = data.packing_sheet[0].branch_name;
    worksheet.getCell("F13").alignment = { horizontal: "left", vertical: "middle" };

    worksheet.getCell(`N13`).value = formatDate(data.delivery_date);
    worksheet.getCell("N13").alignment = { horizontal: "left", vertical: "middle" };

    // Load image file and add it to the worksheet
    const imagePath = "logo.png";
    if (fs.existsSync(imagePath)) {
        const imageId = workbook.addImage({
            filename: imagePath,
            extension: "png",
        });

        worksheet.addImage(imageId, {
            tl: { col: 0, row: 0 }, // Top-left corner (A1)
            br: { col: 3, row: 4 }, // Bottom-right corner (C4)
        });
    }

    try {
        await workbook.xlsx.writeFile(filename);
        console.log("Excel file created successfully!");
    } catch (err) {
        console.error("Error creating Excel file:", err);
    }

}

module.exports = { writeExcelShipping };
