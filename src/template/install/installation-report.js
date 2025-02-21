import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";  // Install pdf-lib using npm or yarn

export async function generatePDF(outputPath = "document.pdf", payload) {
  const installationReport = path.resolve("./template/install/installation-report.html");
  const queueSystemTest = path.resolve("./template/install/queue-system-test.html");
  const queueSystemUser = path.resolve("./template/install/queue-system-user.html");
  const crmSystemTest = path.resolve("./template/install/crm-system-test.html");
  const crmSystemUser = path.resolve("./template/install/crm-system-user.html");

  const htmlContent1 = await fs.readFile(installationReport, "utf-8");
  const htmlContent2 = await fs.readFile(queueSystemTest, "utf-8");
  const htmlContent3 = await fs.readFile(queueSystemUser, "utf-8");
  const htmlContent4 = await fs.readFile(crmSystemTest, "utf-8");
  const htmlContent5 = await fs.readFile(crmSystemUser, "utf-8");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const scaleFactor = 0.8;

  await page.setContent(htmlContent1);
  const pdfBuffer1 = await page.pdf({ format: "A4", printBackground: true, scale: scaleFactor });

  await page.setContent(htmlContent2);
  const pdfBuffer2 = await page.pdf({ format: "A4", printBackground: true, scale: scaleFactor });

  await page.setContent(htmlContent3);
  const pdfBuffer3 = await page.pdf({ format: "A4", printBackground: true, scale: scaleFactor });

  await page.setContent(htmlContent4);
  const pdfBuffer4 = await page.pdf({ format: "A4", printBackground: true, scale: scaleFactor });

  await page.setContent(htmlContent5);
  const pdfBuffer5 = await page.pdf({ format: "A4", printBackground: true, scale: scaleFactor });

  const mergedPdf = await PDFDocument.create();

  const pdf1 = await PDFDocument.load(pdfBuffer1);
  const pdf1Pages = await mergedPdf.copyPages(pdf1, pdf1.getPages().map((_, i) => i));
  pdf1Pages.forEach(page => mergedPdf.addPage(page));

  if (payload.thirdSection.queueChecked) {
    const pdf2 = await PDFDocument.load(pdfBuffer2);
    const pdf2Pages = await mergedPdf.copyPages(pdf2, pdf2.getPages().map((_, i) => i));
    pdf2Pages.forEach(page => mergedPdf.addPage(page));

    const pdf3 = await PDFDocument.load(pdfBuffer3);
    const pdf3Pages = await mergedPdf.copyPages(pdf3, pdf3.getPages().map((_, i) => i));
    pdf3Pages.forEach(page => mergedPdf.addPage(page));


  } else {
    await fs.writeFile(outputPath, pdfBuffer1);
  }

  if (payload.thirdSection.crmChecked) {
    const pdf4 = await PDFDocument.load(pdfBuffer4);
    const pdf4Pages = await mergedPdf.copyPages(pdf4, pdf4.getPages().map((_, i) => i));
    pdf4Pages.forEach(page => mergedPdf.addPage(page));

    const pdf5 = await PDFDocument.load(pdfBuffer5);
    const pdf5Pages = await mergedPdf.copyPages(pdf5, pdf5.getPages().map((_, i) => i));
    pdf5Pages.forEach(page => mergedPdf.addPage(page));
  } else {
    await fs.writeFile(outputPath, pdfBuffer1);
  }

  const mergedPdfBytes = await mergedPdf.save();
  await fs.writeFile(outputPath, mergedPdfBytes);

  await browser.close();
}
