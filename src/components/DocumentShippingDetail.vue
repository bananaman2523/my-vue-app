<template>
  <div class="repair-form">
    <SidebarMenu/>
    <main>
      <h1>ใบจัดส่งสินค้า</h1>
      <div class="container">
        <form @submit.prevent="submitForm">
          <div class="form-row">
            <label>วันที่จัดส่งสินค้า</label>
            <input v-model="formData.delivery_date" type="date"/>
          </div>
          <div class="form-row">
            <label>ชื่อลูกค้า</label>
            <input v-model="formData.customer_name" type="text" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>ชื่อสาขา</label>
            <input v-model="formData.branch_name" type="text" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>เลขที่ใบเสนอราคา</label>
            <input v-model="formData.quotation_number_office_design" type="text" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>เลขที่ใบแจ้งหนี้</label>
            <input v-model="formData.invoice_number" type="text"/>
          </div>
          <div class="form-row">
            <label>เลขที่ใบสั่งซื้อ (ของลูกค้า)</label>
            <input v-model="formData.customer_order_number" type="text" disabled class="disable-form"/>
          </div>
        </form>
      </div>
      <h1>อุปกรณ์</h1>
      <div v-for="(item, index) in formData.stock" :key="index" class="container-product">
        <form>
          <div class="form-row">
            <label>รหัสสินค้า</label>
            <input type="text" v-model="item.product_code_office_design" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>ชื่อสินค้าของ</label>
            <input type="text" v-model="item.product_name_office_design" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>กลุ่มสินค้า</label>
            <input type="text" v-model="item.product_name_office_design" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>อุปกรณ์</label>
            <input type="text" v-model="item.group_product" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>Serial Number</label>
            <input type="text" v-model="item.serial_number" disabled class="disable-form"/>
          </div>
        </form>
      </div>
      <div class="form-actions">
        <label style="padding-right: 8px;">ผู้ตรวจสอบ</label>
        <input v-model="user" type="text" disabled class="disable-form-user"/>
        <button v-if="formData.status !== 'ผ่าน'" type="button" @click="downloadReport()">Export</button>
        <button v-if="formData.status !== 'ผ่าน'" type="button" @click="submitForm()">บันทึก</button>
        <button v-if="formData.status === 'ผ่าน'" style="margin-left: 16px;" type="button" @click="downloadReport">Export</button>
      </div>
      <div class="form-delete">
        <button type="button" @click="deleteForm">ลบ</button>
      </div>
    </main>
  </div>
  <WarningPopup ref="warningPopup"/>
  <ApprovePopup ref="approvePopup"/>
  <ErrorPopup ref="errorPopup" />
</template>

<script setup>
import { ref } from 'vue';
import { directus } from "@/services/directus";
import { updateItems , readItems , updateItem , deleteItem , createItem } from "@directus/sdk";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { useRoute , useRouter} from "vue-router";
import axios from 'axios';
import ApprovePopup from "@/components/popup/ApprovePopup.vue";
import ErrorPopup from "@/components/popup/ErrorPopup.vue";
import WarningPopup from "@/components/popup/WarningPopup.vue";
const warningPopup = ref(null);
const approvePopup = ref(null);

const getUser = JSON.parse(localStorage.getItem('user'))
const user = `${getUser.first_name} ${getUser.last_name}`
const formData = ref({
  id: "",
  customer_name: "",
  branch_name: "",
  branch_code: "",
  quotation_number_office_design: "",
  customer_order_number: "",
  plan_delivery_date: "",
  product_preparation_date: "",
  company_name: "",
  prepared_by: "",
  status: "",
  document_preparation_number: "",
  invoice_number: "",
  stock: [],
});
const route = useRoute();
const router = useRouter();

async function submitForm() {
  try {
    const packingID = route.params.id
    const allPassed = formData.value.stock.every(item => item.status === 'ผ่าน');
    if (allPassed) {
      const updatePacking = await directus.request(
        updateItem('packing_sheet', packingID, {
          status: 'ผ่าน',
          checked_by: user
        })
      );
      const ids = formData.value.stock.map(item => item.id);      
      const updateStock = await directus.request(
        updateItems('stock', ids, {
          status: 'ผ่าน',
      })
      )
      // window.scrollTo(0, 0);
      // window.location.reload();
      createShippingDocument();
      approvePopup.value.showSuccess();
    } else {
      console.warn('Not all items are marked as "ผ่าน". Update skipped.');
    }
  } catch (error) {
    console.error('Error updating stock:', error);
  }
}

const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

async function createShippingDocument() {
  try {
    const packing_sheet = await directus.request(
      readItems("packing_sheet", {
        fields: ['*.*'],
        filter: {
          id: { _eq: route.params.id }
        }
      })
    );
    const packing = packing_sheet[0]
    const result = await directus.request(
      createItem('delivery_sheet', {
        document_delivery_number: packing.document_preparation_number,
        delivery_date: packing.plan_delivery_date,
        packing_sheet: [packing.id]
      })
    );
  } catch (error) {
    console.error('Error updating stock:', error);
  }
}

const fetchData = async () => {
  try {
    const delivery_sheet = await directus.request(
      readItems("delivery_sheet", {
        fields: [
          "*.*.*",
        ],
        filter:{
          id:{
            _eq: route.params.id
          }
        }
      })
    );
    
    if (delivery_sheet.length > 0) {
      const data = delivery_sheet[0];
      
      formData.value = {
        id: data.id || "",
        delivery_date: formatDate(data.delivery_date) || "",
        document_delivery_number: data.document_delivery_number || "",
        customer_name: data.packing_sheet[0].customer_name || "",
        branch_name: data.packing_sheet[0].branch_name || "",
        quotation_number_office_design: data.packing_sheet[0].quotation_number_office_design || "",
        customer_order_number: data.packing_sheet[0].customer_order_number || "",
        stock: data.packing_sheet[0].stock || []
      };
    }
      

  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

fetchData();

const downloadReport = async () => {
  try {
    const packing_sheet = await directus.request(
      readItems("delivery_sheet", {
        fields: [
          "*.*.*",
        ],
        filter:{
          id:{
            _eq: route.params.id
          }
        }
      })
    );
    
    const payload = packing_sheet[0]
    
    const response = await axios.post('http://localhost:3000/downloadShipping', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob'
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(response.data);
    link.download = 'ใบจัดเตรียมสินค้า.xlsx';
    link.click();
  } catch (error) {
    console.error('Error exporting report:', error);
  }
};

async function deleteForm() {
  const confirmDeleteResult = await warningPopup.value.confirmDelete();
  
  if (!confirmDeleteResult.isConfirmed) return;

  try {
    await directus.request(
      deleteItem("delivery_sheet", route.params.id)
    );
    approvePopup.value.showSuccessDelete()
    router.push({ name: 'listStock' });
  } catch (error) {
    alert("Failed to delete item: " + error.message);
  }
}
</script>

<style scoped>
.form-delete {
  grid-column: span 3;
  text-align: right;
  margin: 20px;
}
.form-delete button {
  background-color: red;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.stock-table th,
.stock-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.stock-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.stock-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.stock-table tr:hover {
  background-color: #f1f1f1;
}

.disable-form{
  background-color: #D9D9D9;
}

.disable-form-user{
  margin-right: 8px;
  background-color: #D9D9D9;
}

.add-button {
  margin-left: 16px;
  margin-top: 10px;
  padding: 8px 12px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  border-radius: 5px;
}

.add-button:hover {
  background-color: #0056b3;
}

.disable-form{
  background-color: #D9D9D9;
}
.container {
  padding: 20px;
  overflow-x: auto;
}
.container-product{
  padding: 20px;
  border: 2px solid #F1F0E8;
  border-radius: 16px;
  margin: 16px;
}

.repair-form {
  display: flex;
  justify-content: center;
  max-width: 1440px;
  color: #333;
  margin: 0 auto;
  padding: 20px;
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

.delete-button {
  background-color: #e74c3c;
  color: white;
  /* width: 30px; */
  height: 30px;
  padding: 6px 12px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  /* border-radius: 5px; */
  /* margin-top: 10px; */
}

.delete-button:hover {
  background-color: #c0392b;
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
