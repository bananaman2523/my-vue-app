import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";  // Install pdf-lib using npm or yarn

export async function generatePDF(outputPath = "document.pdf", payload) {
  const installationReport = path.resolve("./template/install/installation-report.html");
  const queueSystemTest = path.resolve("./template/install/queue-system-test.html");

  const htmlContent1 = await fs.readFile(installationReport, "utf-8");
  const htmlContent2 = await fs.readFile(queueSystemTest, "utf-8");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // First PDF generation
  await page.setContent(htmlContent1);
  const pdfBuffer1 = await page.pdf({ format: "A4", printBackground: true });

  if (payload.thirdSection.queueChecked) {
    // Second PDF generation if queueChecked is true
    await page.setContent(htmlContent2);
    const pdfBuffer2 = await page.pdf({ format: "A4", printBackground: true });

    // Merge PDFs
    const mergedPdf = await PDFDocument.create();

    // Load first PDF
    const pdf1 = await PDFDocument.load(pdfBuffer1);
    const pdf1Pages = await mergedPdf.copyPages(pdf1, pdf1.getPages().map((_, i) => i));
    pdf1Pages.forEach(page => mergedPdf.addPage(page));

    // Load second PDF
    const pdf2 = await PDFDocument.load(pdfBuffer2);
    const pdf2Pages = await mergedPdf.copyPages(pdf2, pdf2.getPages().map((_, i) => i));
    pdf2Pages.forEach(page => mergedPdf.addPage(page));

    // Save merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    await fs.writeFile(outputPath, mergedPdfBytes);
  } else {
    // If queueChecked is not true, save only the first PDF
    await fs.writeFile(outputPath, pdfBuffer1);
  }

  await browser.close();
}
