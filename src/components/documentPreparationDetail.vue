<template>
  <div class="repair-form">
    <SidebarMenu/>
    <main>
      <h1>เพิ่มรายการจัดของ</h1>
      <div class="container">
        <form @submit.prevent="submitForm">
          <div class="form-row">
            <label>ชื่อลูกค้า</label>
            <input v-model="formData.customer_name" type="text" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>ชื่อบริษัท</label>
            <select v-model="formData.company_name" disabled class="disable-form">
              <option disabled :value="formData.company_name">{{formData.company_name}}</option>
            </select>
          </div>
          <div class="form-row" v-if="form.companyName !== 'ไม่ระบุ'">
            <label>สาขา</label>
            <select v-model="formData.branch_name" :disabled="!form.companyName" class="disable-form">
              <option disabled :value="formData.branch_name">{{formData.branch_name}}</option>
            </select>
          </div>
          <div class="form-row" v-if="form.companyName === 'ไม่ระบุ'">
            <label>สาขา</label>
            <input v-model="formData.branch_name" type="text" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>รหัสสาขา</label>
            <input v-model="formData.branch_code" type="text" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>เลขที่ใบเสนอราคา (Office Design)</label>
            <input v-model="formData.quotation_number_office_design" type="text" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>เลขที่ใบสั่งซื้อของลูกค้า</label>
            <input v-model="formData.customer_order_number" type="text" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>วันเตรียมสินค้า</label>
            <input v-model="formData.plan_delivery_date" type="date" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>วัน plan จัดส่ง</label>
            <input v-model="formData.plan_delivery_date" type="date" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>จัดเตรียมโดย</label>
            <input v-model="formData.prepared_by" type="text" disabled class="disable-form"/>
          </div>
        </form>
      </div>
      <h1>อุปกรณ์</h1>
      <div>
        <table class="stock-table">
          <thead>
            <tr>
              <th>รหัสสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th>รุ่น</th>
              <th>S/N</th>
              <th style="text-align: center;">คุณภาพสินค้า</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in formData.stock" :key="item.id">
              <tr>
                <td>{{ item.product_code_office_design }}</td>
                <td>{{ item.product_name_office_design }}</td>
                <td>{{ item.model }}</td>
                <td>{{ item.serial_number }}</td>
                <td style="display: flex; justify-content: center; align-items: center;">
                  <select v-model="item.status" :disabled="formData.status === 'ผ่าน'">
                    <option>ระบุ</option>
                    <option style="color: white; background-color: greenyellow;">ผ่าน</option>
                    <option style="color: white; background-color: red;">ชำรุด</option>
                  </select>
                </td>
              </tr>
              <tr v-if="item.status === 'ชำรุด'">
                <td colspan="6" style="background-color: #f8d7da; color: #721c24; text-align: center;">
                  กรุณาระบุรายละเอียดเพิ่มเติมเกี่ยวกับความเสียหาย
                </td>
              </tr>
              <tr v-if="item.status === 'ชำรุด'">
                <td>
                  <input type="text" v-model="selectedItem.product_code_office_design" disabled/>
                </td>
                <td>
                  <input type="text" v-model="selectedItem.product_name_office_design" disabled/>
                </td>
                <td>
                  <input type="text" v-model="selectedItem.model" disabled />
                </td>
                <td>
                  <select v-model="selectedSerialNumber" @change="updateSelectedItem">
                    <option value="">S/N</option>
                    <option v-for="serial in serialNumbers" :key="serial.id" :value="serial.serial_number">
                      {{ serial.serial_number }}
                    </option>
                  </select>
                </td>
                <td>
                  <button>สับเปลี่ยน</button>
                </td>
              </tr>
              <tr v-if="item.status === 'ชำรุด'">
                <td colspan="5" style="text-align: left;">
                  <label>เหตุผล</label>
                  <input type="text" style="display: flex;"/>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="form-actions">
        <label style="padding-right: 8px;">ผู้ตรวจสอบ</label>
        <input v-model="user" type="text" disabled class="disable-form-user"/>
        <button v-if="formData.status !== 'ผ่าน'" type="button" @click="submitForm()">บันทึก</button>
        <button v-if="formData.status === 'ผ่าน'" style="margin-left: 16px;" type="button" @click="downloadReport">Export</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { directus } from "@/services/directus";
import { updateItems , readItems , updateItem } from "@directus/sdk";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { useRoute , useRouter} from "vue-router";
import axios from 'axios';

const getUser = JSON.parse(localStorage.getItem('user'))
const user = `${getUser.first_name} ${getUser.last_name}`

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
      window.scrollTo(0, 0);
      window.location.reload();
    } else {
      console.warn('Not all items are marked as "ผ่าน". Update skipped.');
    }
  } catch (error) {
    console.error('Error updating stock:', error);
  }
}
const selectedSerialNumber = ref("");
const selectedItem = ref({
  product_code_office_design: "",
  product_name_office_design: "",
  group_product: "",
  model: "",
});
const updateSelectedItem = () => {
  const found = serialNumbers.value.find((s) => s.serial_number === selectedSerialNumber.value);
  if (found) {
    selectedItem.value = { ...found };
  } else {
    selectedItem.value = {
      product_code_office_design: "",
      product_name_office_design: "",
      group_product: "",
      model: "",
    };
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};
const serialNumbers = ref([])
const route = useRoute();
const router = useRouter();
const data = ref({
  companies: [],
  equipments: [],
});

const form = ref({
  customerName: '',
  companyName: '',
  branchName: '',
  branchCode: '',
  quotationNumber: '',
  customerOrderNumber: '',
  preparedDate: '',
  deliveryDate: '',
  items: [
    { productCode: '', productName: '', selectedCategory: '', selectedModel: '', serialNumber: '' }
  ]
});

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
  stock: [],
});

const fetchData = async () => {
  try {
    const packing_sheet = await directus.request(
      readItems("packing_sheet", {
        fields: [
          "*.*",
        ],
        filter:{
          id:{
            _eq: route.params.id
          }
        }
      })
    );  

    const stock = await directus.request(
      readItems("stock", {
        fields: [
          "id",
          "product_code_office_design",
          "product_name_office_design",
          "serial_number",
          "group_product",
          "model"
        ],
        filter:{
          status:{
            _eq:null
          }
        }
      })
    );  

    serialNumbers.value = stock.map(item => ({
      id: item.id,
      serial_number: item.serial_number,
      product_code_office_design: item.product_code_office_design,
      product_name_office_design: item.product_name_office_design,
      group_product: item.group_product,
      model: item.model
    }));
    

    if (packing_sheet.length > 0) {
      const data = packing_sheet[0];
      
      formData.value = {
        id: data.id || "",
        customer_name: data.customer_name || "",
        branch_name: data.branch_name || "",
        branch_code: data.branch_code || "",
        quotation_number_office_design: data.quotation_number_office_design || "",
        customer_order_number: data.customer_order_number || "",
        plan_delivery_date: formatDate(data.plan_delivery_date) || "",
        product_preparation_date: formatDate(data.product_preparation_date) || "",
        company_name: data.company_name || "",
        prepared_by: data.prepared_by || "",
        status: data.status || "",
        stock: data.stock || []
      };
    }
      

  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

const getBranches = (companyName) =>
  data.value.companies.find((c) => c.companyName === companyName)?.branches ||
  [];

fetchData();

const downloadReport = async () => {
  try {
    const packing_sheet = await directus.request(
      readItems("packing_sheet", {
        fields: [
          "*.*",
        ],
        filter:{
          id:{
            _eq: route.params.id
          }
        }
      })
    );
    
    const payload = packing_sheet[0]
    console.log(payload);

    const response = await axios.post('http://localhost:3000/downloadProduct', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob'
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(response.data);
    link.download = 'report.xlsx';
    link.click();
  } catch (error) {
    console.error('Error exporting report:', error);
  }
};
</script>

<style scoped>
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
