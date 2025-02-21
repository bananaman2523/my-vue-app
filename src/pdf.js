import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(`
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;700&display=swap');
        body { font-family: 'Sarabun', sans-serif; font-size: 14px; padding: 20px; }
        h1, h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid black; padding: 8px; text-align: center; }
        .company-info { text-align: center; font-size: 16px; margin-bottom: 20px; }
        .signature { margin-top: 50px; text-align: center; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="company-info">
        <strong>บริษัท ออฟฟิศดีไซน์ จำกัด (สำนักงานใหญ่)</strong><br>
        เลขที่ 304 อาคาร วานิชเพลส อารีย์ ห้องเลขที่ 2208 ชั้นที่ 22<br>
        ถนน พหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพมหานคร 10400<br>
        เลขประจำตัวผู้เสียภาษี 0105547064270<br>
        โทร : 02-623-1515
      </div>

      <h1>เอกสารจัดเตรียมสินค้า</h1>
      <h2>เอกสารภายในบริษัท</h2>

      <table>
        <tr>
          <th>บริษัท / ร้าน</th>
          <th>สาขา</th>
          <th>รหัสสาขา</th>
          <th>วันจัดเตรียมสินค้า</th>
          <th>วันแพลนติดตั้ง</th>
        </tr>
        <tr>
          <td colspan="5">&nbsp;</td>
        </tr>
      </table>

      <table>
        <tr>
          <th>ใบสั่งซื้อเลขที่</th>
          <th>ใบเสนอราคาเลขที่</th>
          <th>เอกสารเลขที่</th>
        </tr>
        <tr>
          <td colspan="3">&nbsp;</td>
        </tr>
      </table>

      <table>
        <tr>
          <th>ลำดับที่</th>
          <th>รหัสสินค้า</th>
          <th>ชื่อสินค้า</th>
          <th>รุ่น/แบรนด์</th>
          <th>S/N</th>
          <th>สถานะการตรวจสอบ</th>
          <th>หมายเหตุ</th>
          <th>จัดเตรียมโดย</th>
          <th>ตรวจสินค้าโดย</th>
        </tr>
        <tr>
          <td>#NUM!</td>
          <td colspan="8">&nbsp;</td>
        </tr>
      </table>

      <div class="signature">
        **กรุณาเขียนตัวบรรจง**<br><br>
        ........................... &nbsp;&nbsp;&nbsp;&nbsp; ...........................<br>
        ผู้จัดเตรียม &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ผู้ตรวจสินค้า<br><br>
        วันที่ ........................... &nbsp;&nbsp;&nbsp;&nbsp; วันที่ ...........................
      </div>
    </body>
    </html>
  `);

    await page.pdf({ path: "document.pdf", format: "A4", printBackground: true });

    await browser.close();
})();
