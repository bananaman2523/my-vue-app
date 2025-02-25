<template>
  <div class="repair-form">
    <SidebarMenu/>
    <main>
      <h1>ตรวจสอบรายการจัดของ</h1>
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
            <label>เลขใบจัดของ</label>
            <input v-model="formData.document_preparation_number" type="text" disabled class="disable-form"/>
          </div>
          <div class="form-row">
            <label>จัดเตรียมโดย</label>
            <input v-model="formData.prepared_by" type="text" disabled class="disable-form"/>
          </div>
        </form>
      </div>
      <h1>อุปกรณ์</h1>
      <div v-for="(item, index) in formData.stock" :key="index" class="container-product">
        <form>
          <div class="form-row">
            <label>รหัสสินค้าของ Office Design</label>
            <input type="text" v-model="item.product_code_office_design" disabled/>
          </div>
          <div class="form-row">
            <label>ชื่อสินค้าของ Office Design</label>
            <input type="text" v-model="item.product_name_office_design" disabled/>
          </div>
          <div class="form-row">
            <label>อุปกรณ์</label>
            <input type="text" v-model="item.group_product" disabled/>
          </div>
          <div class="form-row">
            <label>รุ่น/แบรนด์</label>
            <input type="text" v-model="item.model" disabled/>
          </div>
          <div class="form-row">
            <label>Serial Number</label>
            <input type="text" v-model="item.serial_number" disabled/>
          </div>
          <!-- <div class="form-row" style="grid-column: 1 / span 3; width: 345px;">
            <label>คุณภาพสินค้า</label>
            <select v-model="item.status" :disabled="formData.status === 'ผ่าน'">
              <option>ระบุ</option>
              <option>ผ่าน</option>
              <option>ชำรุด</option>
            </select>
          </div> -->
        </form>
        <ChecklistFinal :id="item.id" style="margin-top: 16px;margin-bottom: 16px;"/>
        <form>
          <div v-if="item.status === 'ชำรุด'" style="display: contents;">
            <div class="form-row">
              <label>ชื่อสินค้าของ Office Design</label>
              <select v-model="item.productName" @change="updateProduct(index)">
                <option value="">Select a category</option>
                <option v-for="productName in filteredProducts" :key="productName.product_name" :value="productName.product_name">
                  {{ productName.product_name }}
                </option>
              </select>
            </div>
            <div class="form-row">
              <label>รหัสสินค้าของ Office Design</label>
              <input v-model="item.productCode" type="text" disabled class="disable-form"/>
            </div>
            <div class="form-row">
              <label>อุปกรณ์</label>
              <input v-model="item.productModel" type="text" disabled class="disable-form"/>
            </div>
            <div class="form-row">
              <label>รุ่น/แบรนด์</label>
              <input v-model="item.productBrand" type="text" disabled class="disable-form"/>
            </div>
            <div class="form-row">
              <label>Serial Number</label>
              <input v-model="item.serialNumber" @change="cheakSerialNumberInStock(item.serialNumber, formData.stock[index])" type="text" :disabled="!item.productCode" :class="!item.productCode ? 'disable-form' : ''"/>
            </div>
            <br>
            <div class="form-row">
              <label>ประเภทชำรุด</label>
              <select v-model="item.brokenCategory" :disabled="!item.serialNumber" :class="!item.serialNumber ? 'disable-form' : ''">
                <option>ระบุ</option>
                <option>software</option>
                <option>hardware</option>
              </select>
            </div>
            <div class="form-row">
              <label>รายละเอียด</label>
              <input v-model="item.brokenDescription" type="text" style="width: 320px;" :disabled="!item.serialNumber" :class="!item.serialNumber ? 'disable-form' : ''"/>
            </div>
            <div style="display: flex; align-items: flex-end;">
              <button type="button" @click="switchEquipment(item)">สับเปลี่ยน</button>
            </div>
          </div>
        </form>
      </div>
      <div class="form-actions">
        <label style="padding-right: 8px;">ผู้ตรวจสอบ</label>
        <input v-model="user" type="text" disabled class="disable-form-user"/>
        <button v-if="formData.status !== 'ผ่าน'" type="button" @click="submitForm()">บันทึก</button>
        <button v-if="formData.status === 'ผ่าน'" style="margin-left: 16px;" type="button" @click="downloadReport">Export</button>
        <button v-if="formData.status === 'ผ่าน' && formData.packing_sheet_id === null" style="margin-left: 16px;" type="button" @click="createShippingDocument()">สร้างใบจัดส่งสินค้า</button>
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
import { ref , computed} from 'vue';
import { directus } from "@/services/directus";
import { updateItems , readItems , updateItem , deleteItem , createItem } from "@directus/sdk";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { useRoute , useRouter} from "vue-router";
import axios from 'axios';
import ApprovePopup from "@/components/popup/ApprovePopup.vue";
import ErrorPopup from "@/components/popup/ErrorPopup.vue";
import WarningPopup from "@/components/popup/WarningPopup.vue";
import ChecklistFinal from './checklists/ChecklistFinal.vue';
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
  stock: [],
});
const serialNumbers = ref([])
const route = useRoute();
const router = useRouter();
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
const productConfig = ref({ product: [] });


async function submitForm() {
  try {
    const packingID = route.params.id
    console.log(formData.value);
    
    const allPassed = formData.value.stock.every(item => item.status === 'ผ่าน');
    const timestamp = new Date().toISOString().split('.')[0];
    if (allPassed) {
      const updatePacking = await directus.request(
        updateItem('packing_sheet', packingID, {
          status: 'ผ่าน',
          checked_by: user,
          checked_date: timestamp,
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
const filteredProducts = computed(() => {
  const index = 0;
  const text = formData.value.stock[index].product_name_office_design;
  const textBeforeHash = text.split('#')[0];

  return productConfig.value.filter(product => product.product_name.includes(textBeforeHash));
});


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
        packing_sheet: [packing.id],
        delivery_status: 'รอการจัดส่งสินค้า',
        install_status: 'รอการติดตั้ง',
      })
    );
    window.location.reload();
  } catch (error) {
    console.error('Error updating stock:', error);
  }
}

async function switchEquipment(item) {
  try {
    const packingID = route.params.id;

    const [packing_sheet] = await directus.request(
      readItems("packing_sheet", {
        fields: ["stock"],
      })
    );

    const newStockItem = await directus.request(
      readItems("stock", {
        fields: ["id"],
        filter: {
          serial_number: { _eq: item.serialNumber }
        }
      })
    );

    if (newStockItem.length === 0) {
      throw new Error("Stock item not found with the given serial number.");
    }

    let selectValue = item.id;
    let newValue = newStockItem[0].id;

    let updatedArr = packing_sheet.stock.map(num => num === selectValue ? newValue : num);

    await directus.request(
      updateItem('stock', item.id, { 
        status: 'ชำรุด',
        broken_description: item.brokenDescription,
        broken_category: item.brokenCategory,
      })
    );

    await directus.request(
      updateItem('packing_sheet', packingID, { stock: updatedArr })
    );

    await directus.request(
      updateItem('stock', newStockItem[0].id, { status: 'รอเช็คก่อนส่ง' })
    );

    window.location.reload();
  } catch (error) {
    console.error("Error updating equipment:", error);
  }
}

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

    const config = await directus.request(
      readItems("config", {
        fields: [
          "product_code"
        ],
      })
    );
    productConfig.value = config[0].product_code

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
        document_preparation_number: data.document_preparation_number || "",
        stock: data.stock || [],
        packing_sheet_id: data.packing_sheet_id || null
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

    const response = await axios.post('http://localhost:3000/downloadProduct', payload, {
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
    const ids = formData.value.stock.map(item => item.id);
    const updateStock = await directus.request(
        updateItems('stock', ids, {
          status: 'พร้อมใช้งาน',
      })
    )
    await directus.request(
      deleteItem("packing_sheet", route.params.id)
    );
    if (formData.value.packing_sheet_id != null) {
      await directus.request(
        deleteItem("delivery_sheet", formData.value.packing_sheet_id.id)
      );
    }
    approvePopup.value.showSuccessDelete()
    router.push({ name: 'listPreparation' });
  } catch (error) {
    alert("Failed to delete item: " + error.message);
  }
}

const updateProduct = (index) => {
  const formItem = formData.value.stock[index];
  const selectedProduct = productConfig.value.find(
    (product) => product.product_name === formItem.productName
  );

  if (selectedProduct) {
    formItem.productCode = selectedProduct.product_code || '';
    formItem.productModel = selectedProduct.equipment.model || '';
    formItem.productBrand = selectedProduct.equipment.brand || '';
  }else{
    formItem.productCode = '';
    formItem.productModel = '';
    formItem.productBrand = '';
  }
};

async function cheakSerialNumberInStock(serialNumber, formItem) {
  try {
    if (serialNumber) {
      const isDuplicateInForm = form.value.items.some(
        (item) => item !== formItem && item.serialNumber === serialNumber
      );

      if (isDuplicateInForm) {
        warningPopup.value.showWarningDuplicate();
        formItem.serialNumber = "";
        return;
      }

      const checks = (await directus.request(
        readItems("stock", {
          filter: {
            serial_number: {
              _eq: serialNumber,
            },
            model: {
              _eq: formItem.productBrand,
            },
            group_product: {
              _eq: formItem.productModel,
            },
            product_name_office_design: {
              _eq: formItem.productName,
            },
            product_code_office_design: {
              _eq: formItem.productCode,
            },
          },
        })
      )) || [];

      const checksStatus = checks[0]

      if (checks.length != 0) {
        if (checksStatus.status === 'ชำรุด') {
          warningPopup.value.showWarningBroken();
          formItem.serialNumber = "";
        } else if (checksStatus.stock_id !== null) {
          warningPopup.value.showWarningAlreadyUse();
          formItem.serialNumber = "";
        }  else if (checksStatus.device_status === 'เครื่องสำรอง') {
          warningPopup.value.showWarningBackupDevice();
          formItem.serialNumber = "";
        }
        
        if (Array.isArray(checks) && checks.length == 0) {
          warningPopup.value.showWarning();
          formItem.serialNumber = "";
        }  
      }else{
        warningPopup.value.showWarning();
        formItem.serialNumber = "";
      }
      
      
    }
    
  } catch (error) {
    console.error("Error generating preparation number:", error);
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
