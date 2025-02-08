const ExcelJS = require("exceljs");
const fs = require("fs");

// Create a new workbook and worksheet
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("Sheet1");

// Merge A1:C4 for the image
worksheet.mergeCells("A1:C4");

// Merge N1:Q1 for the company name
worksheet.mergeCells("N1:Q1");
worksheet.mergeCells("N2:Q2");
worksheet.mergeCells("N3:Q3");
worksheet.mergeCells("N4:Q4");
worksheet.mergeCells("N5:Q5");
worksheet.mergeCells("A11:B11");
worksheet.mergeCells("C11:D11");
worksheet.mergeCells("F11:G11");
worksheet.mergeCells("I11:K11");
worksheet.mergeCells("M11:N11");


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
worksheet.getCell("A6").value = "เอกสารจัดเตรียมสินค้า";
worksheet.getCell("A6").font = { bold: true, size: 22 };
worksheet.getCell("A6").alignment = { horizontal: "center", vertical: "middle" };

worksheet.mergeCells("A9:Q9");
worksheet.getCell("A9").value = "เอกสารภายในบริษัท";
worksheet.getCell("A9").font = { bold: false, size: 12 };
worksheet.getCell("A9").alignment = { horizontal: "center", vertical: "middle" };

const cellA11B11 = worksheet.getCell("A11");
cellA11B11.value = "บริษัท / ร้าน :";
cellA11B11.font = { bold: false, size: 12, color: { argb: "000000" } };
cellA11B11.alignment = { horizontal: "right", vertical: "middle" };

// Define other fields
const fields = [
    { cell: "E11", value: "สาขา :" },
    { cell: "H11", value: "รหัสสาขา :" },
    { cell: "L11", value: "วันจัดเตรียมสินค้า :" },
    { cell: "O11", value: "วันแพลนติดตั้ง :" },
    { cell: "B12", value: "ใบสั่งซื้อเลขที่ :" },
    { cell: "E12", value: "ใบเสนอราคาเลขที่ :" },
    { cell: "H12", value: "เอกสารเลขที่ :" },
];

worksheet.mergeCells("A13:Q13");

// Table fields
worksheet.getCell("A14").value = "ลำดับที่";
worksheet.getCell("A14").font = { bold: true, size: 12 };
worksheet.getCell("A14").alignment = { horizontal: "center", vertical: "middle" };
worksheet.mergeCells("B14:C14");
worksheet.getCell("B14").value = "เอกสารภายในบริษัท";
worksheet.getCell("B14").font = { bold: true, size: 12 };
worksheet.getCell("B14").alignment = { horizontal: "center", vertical: "middle" };
worksheet.mergeCells("D14:F14");
worksheet.getCell("D14").value = "ชื่อสินค้า";
worksheet.getCell("D14").font = { bold: true, size: 12 };
worksheet.getCell("D14").alignment = { horizontal: "center", vertical: "middle" };
worksheet.mergeCells("G14:H14");
worksheet.getCell("G14").value = "ชื่อสินค้า";
worksheet.getCell("G14").font = { bold: true, size: 12 };
worksheet.getCell("G14").alignment = { horizontal: "center", vertical: "middle" };
worksheet.mergeCells("I14:K14");
worksheet.getCell("I14").value = "S/N";
worksheet.getCell("I14").font = { bold: true, size: 12 };
worksheet.getCell("I14").alignment = { horizontal: "center", vertical: "middle" };
worksheet.getCell("L14").value = "สถานะ\nการตรวจสอบ";
worksheet.getCell("L14").font = { bold: true, size: 12 };
worksheet.getCell("L14").alignment = { horizontal: "center", vertical: "middle" };
worksheet.mergeCells("M14:O14");
worksheet.getCell("I14").value = "หมายเหตุ";
worksheet.getCell("I14").font = { bold: true, size: 12 };
worksheet.getCell("I14").alignment = { horizontal: "center", vertical: "middle" };
worksheet.getCell("P14").value = "จัดเตรียมโดย";
worksheet.getCell("P14").font = { bold: true, size: 12 };
worksheet.getCell("P14").alignment = { horizontal: "center", vertical: "middle" };
worksheet.getCell("G14").value = "ตรวจสินค้าโดย";
worksheet.getCell("G14").font = { bold: true, size: 12 };
worksheet.getCell("G14").alignment = { horizontal: "center", vertical: "middle" };

// Apply styles and alignment
fields.forEach(({ cell, value }) => {
    const c = worksheet.getCell(cell);
    c.value = value;
    c.font = { bold: false, size: 12 };
    c.alignment = { horizontal: "left", vertical: "middle" };
});

// Set column widths for A:Q
const columnWidths = [
    { width: 80 / 7 }, { width: 100 / 7 }, { width: 185 / 7 }, { width: 107 / 7 }, { width: 100 / 7 }, { width: 200 / 7 },
    { width: 104 / 7 }, { width: 117 / 7 }, { width: 97 / 7 }, { width: 100 / 7 }, { width: 120 / 7 }, { width: 126 / 7 },
    { width: 100 / 7 }, { width: 100 / 7 }, { width: 110 / 7 }, { width: 120 / 7 }, { width: 120 / 7 }
];

for (let i = 0; i < 17; i++) {
    worksheet.getColumn(i + 1).width = columnWidths[i].width;
}

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

// Write the workbook to a file
workbook.xlsx
    .writeFile("output_with_image.xlsx")
    .then(() => console.log("Excel file created successfully with formatted text and image!"))
    .catch((err) => console.error("Error creating Excel file:", err));
