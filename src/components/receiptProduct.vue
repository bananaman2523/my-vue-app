<template>
  <div class="repair-form">
    <SidebarMenu />
    <main>
      <h1>เพิ่มสินค้านำเข้า</h1>
      <div class="container">
        <form @submit.prevent="submitForm">
          <div class="form-row">
            <label>วันที่รับ <label style="color: red;">*</label></label>
            <input type="date" v-model="formData.receivedDate" required/>
          </div>
          <div class="form-row">
            <label>ชื่อ supplier <label style="color: red;">*</label></label>
            <input type="text" v-model="formData.supplierName" required/>
          </div>
          <div class="form-row">
            <label>เลข PO <label style="color: red;">*</label></label>
            <input type="text" v-model="formData.poNumber" required/>
          </div>
          <div class="form-row">
            <label>เลขที่ใบส่งสินค้า</label>
            <input type="text" v-model="formData.deliveryNoteNumber" />
          </div>
          <div class="form-row">
            <label>วันที่ในใบส่งสินค้า</label>
            <input type="date" v-model="formData.deliveryNoteDate" />
          </div>
          <div class="form-row">
            <label>สถานะสินค้า</label>
            <select v-model="formData.statusProduct">
              <option value="สินค้าขาย">สินค้าขาย</option>
              <option value="เครื่องสำรอง">เครื่องสำรอง</option>
              <option value="อะไหล่สำรอง">อะไหล่สำรอง</option>
            </select>
          </div>
          <div class="form-row">
            <label>เลขที่ใบกำกับภาษี <label style="color: red;">*</label></label>
            <input type="text" v-model="formData.taxInvoiceNumber" required/>
          </div>
          <div class="form-row">
            <label>Invoice date <label style="color: red;">*</label></label>
            <input type="date" v-model="formData.invoiceDate" required/>
          </div>
          <br>
          <div class="form-row">
            <label>เลขที่ใบเสร็จ</label>
            <input type="text" v-model="formData.receiptNumber" />
          </div>
          <div class="form-row">
            <label>วันที่ใบเสร็จ</label>
            <input type="date" v-model="formData.receiptDate" />
          </div>
          <br>
          <div class="form-row">
            <label>เลขที่ใบวางบิล</label>
            <input type="text" v-model="formData.billingNoteNumber" />
          </div>
          <div class="form-row">
            <label>วันที่ due ชำระ</label>
            <input type="date" v-model="formData.dueDate" />
          </div>
          <br>
          <!-- <div class="form-row">
            <label>Item code <label style="color: red;">*</label></label>
            <input type="text" v-model="formData.itemCode" required/>
          </div>
          <div class="form-row">
            <label>ชื่อสินค้า (Supplier) <label style="color: red;">*</label></label>
            <input type="text" v-model="formData.supplierProductName" required/>
          </div> -->
        </form>
      </div>
      <h1>อุปกรณ์</h1>
      <addReceiptProduct v-model:products="receiptProducts"/>
      <ApprovePopup ref="approvePopup"/>
      <ErrorPopup ref="errorPopup" />
      <WarningPopup ref="warningPopup"/>
      <div class="form-actions">
        <button type="button" @click="submitForm">บันทึก</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { directus } from "@/services/directus";
import { createItems } from "@directus/sdk";
import SidebarMenu from "@/components/SidebarMenu.vue";
import addReceiptProduct from "./addReceiptProduct.vue";
import axios from 'axios';
import ApprovePopup from "@/components/popup/ApprovePopup.vue";
import ErrorPopup from "@/components/popup/ErrorPopup.vue";
import WarningPopup from "@/components/popup/WarningPopup.vue";
import data from '@/components/checklists/template.js';
const warningPopup = ref(null);
const approvePopup = ref(null);
const errorPopup = ref(null);

// function formatObjectDates(obj) {
//     Object.keys(obj).forEach(key => {
//         if (obj[key] && typeof obj[key] === 'string' && !isNaN(Date.parse(obj[key]))) {
//             obj[key] = formatDate(obj[key]);
//         }
//     });
//     return obj;
// }

function checklist(field,group_product) {
  const checklistPrinter = ["Recript printer","Lable printer","Kitchen printer"]
  const checklistKiosk = ['KIOSK']
  const checklistUPS = ['UPS']
  const checklistScanner = ['Scanner']
  const checklistDrawer = ['Drawer']
  const checklistPOSMonitor = ["POS VIVIPOS (1st Monitor)","POS VIVIPOS (2st Monitor)","POS Casio"]
  if (checklistPrinter.includes(group_product)) {
    return data.printer_final;
  } else if (checklistKiosk.includes(group_product)) {
    return data.kiosk_final;
  } else if (checklistUPS.includes(group_product)) {
    return data.ups_final;
  } else if (checklistScanner.includes(group_product)) {
    return data.scanner_final;
  } else if (checklistDrawer.includes(group_product)) {
    return data.drawer_final;
  } else if (checklistPOSMonitor.includes(group_product)) {
    return data.pos_monitor_final;
  }
  return null;
}

const addStock = async () => {
  const stockItems = []
  const hasEmptySerialNumber = receiptProducts.value.some(product =>
    product.serialNumbers.some(serial => serial.trim() === "")
  );

  if (hasEmptySerialNumber) {
    warningPopup.value.showWarningNoFullField();
    return
  }
  for (let i = 0; i < receiptProducts.value.length; i++) {
    for (let j = 0; j < receiptProducts.value[i].serialNumbers.length; j++) {
      const stockItem = {
        receive_date: formData.value.receivedDate || null,
        name_supplier: formData.value.supplierName || null,
        bill_lading_number: formData.value.deliveryNoteNumber || null,
        bill_lading_number_date: formData.value.deliveryNoteDate || null,
        invoice_number: formData.value.taxInvoiceNumber || null,
        invoice_number_date: formData.value.invoiceDate || null,
        receipt_number: formData.value.receiptNumber || null,
        receipt_number_date: formData.value.receiptDate || null,
        bill_number: formData.value.billingNoteNumber || null,
        due_date: formData.value.dueDate || null,
        product_name_supplier: formData.value.supplierProductName || null,
        product_code_office_design: receiptProducts.value[i].productCode || null,
        product_name_office_design: receiptProducts.value[i].productName || null,
        serial_number: receiptProducts.value[i].serialNumbers[j] || null,
        group_product: receiptProducts.value[i].productModel || null,
        model: receiptProducts.value[i].productBrand|| null,
        po_number: formData.value.poNumber || null,
        device_status: formData.value.statusProduct,
        status: 'รอตรวจสอบอุปกรณ์',
        checklist: checklist('checklist_final' ,receiptProducts.value[i].productModel),
      };
      stockItems.push(stockItem);
    }
    // const format = formatObjectDates(result)
    // const payload = objectToArray(format);
    // await axios.post('http://localhost:3000/api/addRows', { rows: payload });
  }
  try {
    const result = await directus.request(createItems('stock', stockItems));
    approvePopup.value.showSuccess();

  } catch (error) {
    errorPopup.value.showError();
    console.error('Error creating article:', error);
  }
};

const formData = ref({
  receivedDate: new Date().toISOString().split("T")[0],
  supplierName: "",
  deliveryNoteNumber: "",
  deliveryNoteDate: "",
  taxInvoiceNumber: "",
  invoiceDate: "",
  receiptNumber: "",
  receiptDate: "",
  billingNoteNumber: "",
  dueDate: "",
  poNumber: "",
  statusProduct: "สินค้าขาย",
});

const receiptProducts = ref([]);

const submitForm = () => {
  if (
    !formData.value.receivedDate ||
    !formData.value.supplierName ||
    !formData.value.taxInvoiceNumber ||
    !formData.value.invoiceDate ||
    !formData.value.poNumber
  ) {
    warningPopup.value.showWarningNoFullField();
    return;
  }

  addStock();
};

</script>

<style scoped>
.disable-form{
  background-color: #D9D9D9;
}
.container {
  padding: 20px;
  overflow-x: auto;
}
.repair-form {
  display: flex;
  justify-content: center;
  max-width: 1440px;
  color: #333;
  margin: 0 auto;
  /* padding: 20px; */
}

main {
  flex: 1;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 100vh;
}

h1 {
  color: #ffffff;
  background-color: #003566;
  font-size: 24px;
  padding: 20px 30px;
  margin: 0;
  text-align: left;
}

form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 16px;
  color: #555;
}

input,
select {
  padding: 12px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f7f7f7;
  color: #333;
  transition: all 0.3s ease;
}

input:focus,
select:focus {
  border-color: #0073e6;
  background-color: #fff;
  box-shadow: 0 0 6px rgba(0, 115, 230, 0.3);
  outline: none;
}

input::placeholder,
select::placeholder {
  color: #bbb;
}

.checkbox-group {
  display: flex;
  gap: 15px;
  align-items: center;
}

button {
  background-color: #f8c344;
  border: none;
  padding: 14px 28px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease;
}

button:hover {
  background-color: #e89a28;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

button:disabled {
  background-color: #d0d0d0;
  cursor: not-allowed;
}

.form-actions {
  grid-column: span 3;
  text-align: right;
  margin: 20px;
}

@media (max-width: 768px) {
  .repair-form {
    padding: 20px;
  }

  main {
    width: 100%;
    padding: 20px;
  }

  form {
    grid-template-columns: 1fr;
  }

  .form-actions {
    grid-column: span 1;
  }
}
</style>
