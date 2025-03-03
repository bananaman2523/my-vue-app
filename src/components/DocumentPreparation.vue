<template>
  <div class="repair-form">
    <SidebarMenu/>
    <main>
      <h1>เพิ่มรายการจัดของ</h1>
      <div class="container">
        <form @submit.prevent="submitForm">
          <div class="form-row">
            <label>ชื่อลูกค้า</label>
            <input v-model="form.customerName" type="text"/>
          </div>
          <div class="form-row">
            <label>ชื่อบริษัท</label>
            <select v-model="form.companyName">
              <option disabled value="">เลือกบริษัท</option>
              <option v-for="company in data.companies" :key="company.companyName" :value="company.companyName">
                {{ company.companyName }}
              </option>
            </select>
          </div>
          <div class="form-row" v-if="form.companyName !== 'ไม่ระบุ'">
            <label>สาขา</label>
            <select v-model="form.branchName" :disabled="!form.companyName">
              <option disabled value="">เลือกสาขา</option>
              <option v-for="branch in getBranches(form.companyName)" :key="branch" :value="branch">
                {{ branch }}
              </option>
            </select>
          </div>
          <div class="form-row" v-if="form.companyName === 'ไม่ระบุ'">
            <label>สาขา</label>
            <input v-model="form.branchName" type="text"/>
          </div>
          <div class="form-row">
            <label>รหัสสาขา</label>
            <input v-model="form.branchCode" type="text"/>
          </div>
          <div class="form-row">
            <label>เลขที่ใบเสนอราคา (Office Design)</label>
            <input v-model="form.quotationNumber" type="text"/>
          </div>
          <div class="form-row">
            <label>เลขที่ใบสั่งซื้อของลูกค้า</label>
            <input v-model="form.customerOrderNumber" type="text"/>
          </div>
          <div class="form-row">
            <label>วันเตรียมสินค้า</label>
            <input v-model="form.preparedDate" type="date"/>
          </div>
          <div class="form-row">
            <label>วัน plan จัดส่ง</label>
            <input v-model="form.deliveryDate" type="date"/>
          </div>
          <div class="form-row">
            <label>จัดเตรียมโดย</label>
            <input v-model="user" type="text" disabled class="disable-form"/>
          </div>
        </form>
      </div>
      <h1>อุปกรณ์</h1>
      <addReceiptProduct v-model:products="receiptProducts"/>
      <div class="form-actions">
        <button type="button" @click="submitForm">บันทึก</button>
      </div>
      <WarningPopup ref="warningPopup"/>
      <ApprovePopup ref="approvePopup"/>
      <ErrorPopup ref="errorPopup" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { directus } from "@/services/directus";
import { createItem, readItems , updateItems } from "@directus/sdk";
import SidebarMenu from "@/components/SidebarMenu.vue";
import ApprovePopup from "@/components/popup/ApprovePopup.vue";
import ErrorPopup from "@/components/popup/ErrorPopup.vue";
import WarningPopup from "@/components/popup/WarningPopup.vue";
import addReceiptProduct from "./addReceiptProduct.vue";

const warningPopup = ref(null);
const approvePopup = ref(null);
const receiptProducts = ref([]);
const getUser = JSON.parse(localStorage.getItem('user'))
const user = `${getUser.first_name} ${getUser.last_name}`
const productConfig = ref({ product: [] });
const data = ref({
  companies: [],
  equipments: [],
});

const serialNumbers = ref([])
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
    { productCode: '', productName: '', productModel: '', productBrand: '', serialNumber: '' }
  ]
});

function simplifyInput(input) {
  const result = {
    companies: [],
  };

  input.forEach(item => {
    if (item.company) {
      item.company.forEach(company => {
        const branches = company.branch.map(branch => branch.branch_id.branch_name);
        result.companies.push({
          companyName: company.company_name,
          branches
        });
      });
    }
  });

  return result;
}


const fetchData = async () => {
  try {
    const response = await directus.request(
      readItems("config", {
        fields: [
          "company.company_name",
          "company.branch.branch_id.branch_name",
        ],
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

    Object.assign(data.value, simplifyInput(response));

    const config = await directus.request(
      readItems("config", {
        fields: [
          "product_code"
        ],
      })
    );
    productConfig.value = config[0].product_code
    

  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

const getBranches = (companyName) =>
  data.value.companies.find((c) => c.companyName === companyName)?.branches ||
  [];

fetchData();

async function generatePreparationNumber() {
  const prefix = "OFD-";
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}${month}${day}`;
  let docNumber = "";

  try {
    const packing_sheet = await directus.request(
      readItems("packing_sheet", {
        fields: ['*'],
        filter: {
          document_preparation_number: {
            _contains: `${prefix}${formattedDate}`,
          },
        },
      })
    );

    const sequence = String(packing_sheet.length + 1).padStart(2, '0');
    docNumber = `${prefix}${formattedDate}${sequence}`;
  } catch (error) {
    console.error("Error generating preparation number:", error);
  }

  return docNumber;
}


const addStock = async () => {
  const docNumber = await generatePreparationNumber()
  try {
    for (let index = 0; index < receiptProducts.value.length; index++) {
      const create = await directus.request(
        createItem('packing_sheet', {
          document_preparation_number: docNumber,
          customer_name: form.value.customerName,
          company_name: form.value.companyName,
          branch_name: form.value.branchName,
          branch_code: form.value.branchCode,
          product_preparation_date: form.value.preparedDate,
          plan_delivery_date: form.value.deliveryDate,
          quotation_number_office_design: form.value.quotationNumber,
          customer_order_number: form.value.customerOrderNumber,
          prepared_by: user,
          status: 'รอเช็คก่อนส่ง'
        })
      )
      const stockIds = receiptProducts.value[index].serialNumbers;
      const readStock = await directus.request(
        readItems("stock", {
          fields: ['*'],
          filter: {
            serial_number: {
              _in: stockIds,
            },
          },
        })
      );

      const stock = readStock.map(item => item.id);
      
      await directus.request(
        updateItems('stock', stock, {
          status: 'รอเช็คก่อนส่ง',
          stock_id: create.id,
        })
      )
      
    }
    approvePopup.value.showSuccess();
  } catch (error) {
    console.error('Error creating article:', error);
  }
}

const submitForm = () => {
  addStock();
};

</script>

<style scoped>
.disable-form{
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
  /* max-width: 1440px; */
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
</style>
