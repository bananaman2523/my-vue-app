<template>
  <div class="repair-form">
    <SidebarMenu />
    <main>
      <h1>รายการจัดของ</h1>
      <div class="input-container">
        <input type="date" v-model="filterData.receive_date_from" placeholder="From Date">
        <input type="date" v-model="filterData.receive_date_to" placeholder="To Date">
        <input v-model="filterData.name_supplier" type="text" class="input-field" placeholder="ชื่อ supplier">
        <input v-model="filterData.bill_lading_number" type="text" class="input-field" placeholder="เลขที่ใบส่งสินค้า">
        <input v-model="filterData.bill_lading_number_date" type="text" class="input-field" placeholder="เลขที่ใบกำกับภาษี">
        <input v-model="filterData.invoice_number" type="text" class="input-field" placeholder="เลขที่ใบเสร็จ">
        <input v-model="filterData.invoice_number_date" type="text" class="input-field" placeholder="เลขที่ใบวางบิล">
        <input v-model="filterData.item_code" type="text" class="input-field" placeholder="Item code">
        <input v-model="filterData.product_name_supplier" type="text" class="input-field" placeholder="ชื่อสินค้า (Supplier)">
        <input v-model="filterData.product_code_office_design" type="text" class="input-field" placeholder="รหัสสินค้า Office Design">
        <input v-model="filterData.product_name_office_design" type="text" class="input-field" placeholder="ชื่อสินค้า Office Design">
        <input v-model="filterData.product_category" type="text" class="input-field" placeholder="หมวดหมู่สินค้า">
        <input v-model="filterData.model" type="text" class="input-field" placeholder="model">
        <input v-model="filterData.sn" type="text" class="input-field" placeholder="S/N">
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>เลขที่ใบจัดสินค้า</th>
              <th>ชื่อลูกค้า</th>
              <th>ชื่อบริษัท</th>
              <th>สาขา</th>
              <th>รหัสสาขา</th>
              <th>เลขที่ใบเสนอราคา (Office Design)</th>
              <th>เลขที่ใบสั่งซื้อของลูกค้า</th>
              <th>วันเตรียมสินค้า</th>
              <th>วัน plan จัดส่ง</th>
              <th>จัดเตรียมโดย</th>
              <th style="text-align: center;">สถานะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="index" :id="item.id" @click="navigate('documentPreparationDetail',item.id)">
              <td>{{ item.document_preparation_number }}</td>
              <td>{{ item.customer_name }}</td>
              <td>{{ item.company_name }}</td>
              <td>{{ item.branch_name }}</td>
              <td>{{ item.branch_code }}</td>
              <td>{{ item.quotation_number_office_design }}</td>
              <td>{{ item.customer_order_number }}</td>
              <td>{{ item.product_preparation_date }}</td>
              <td>{{ item.plan_delivery_date }}</td>
              <td>{{ item.prepared_by }}</td>
              <td>{{ item.status }}</td>
              <td><button style="background-color: #003566;color: white;">ตรวจเช็ค</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <button @click="goToFirstPage" :disabled="currentPage === 1">หน้ากแรก</button>
        <button @click="goToPreviousPage" :disabled="currentPage === 1">ก่อนหน้า</button>
        <button class="active">{{ currentPage }}</button>
        <button @click="goToNextPage" :disabled="currentPage === totalPages">ถัดไป</button>
        <button @click="goToLastPage" :disabled="currentPage === totalPages">หน้าสุดท้าย</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { directus } from "@/services/directus";
import { ref, computed } from "vue";
import { readItems } from "@directus/sdk";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const data = ref([]);
const currentPage = ref(1);
const itemsPerPage = 20;

const filterData = ref({
  receive_date: "",
  name_supplier: "",
  bill_lading_number: "",
  bill_lading_number_date: "",
  invoice_number: "",
  invoice_number_date: "",
  item_code: "",
  product_name_supplier: "",
  product_code_office_design: "",
  product_name_office_design: "",
  product_category: "",
  model: "",
  sn: "",
});

const fetchData = async () => {
  try {
    const response = await directus.request(
      readItems("packing_sheet", {
        fields: ["*.*"],
      })
    );
    data.value = response;
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

fetchData();

const totalPages = computed(() => Math.ceil(data.value.length / itemsPerPage));

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;

  const filteredData = data.value.filter(item => {
    const itemReceiveDate = new Date(item.receive_date);
    const fromDate = filterData.value.receive_date_from ? new Date(filterData.value.receive_date_from) : null;
    const toDate = filterData.value.receive_date_to ? new Date(filterData.value.receive_date_to) : null;

    const isInDateRange = (!fromDate || itemReceiveDate >= fromDate) && (!toDate || itemReceiveDate <= toDate);

    return (
      isInDateRange &&
      (!filterData.value.name_supplier || (item.name_supplier && item.name_supplier.includes(filterData.value.name_supplier))) &&
      (!filterData.value.bill_lading_number || (item.bill_lading_number && item.bill_lading_number.includes(filterData.value.bill_lading_number))) &&
      (!filterData.value.bill_lading_number_date || (item.bill_lading_number_date && item.bill_lading_number_date.includes(filterData.value.bill_lading_number_date))) &&
      (!filterData.value.invoice_number || (item.invoice_number && item.invoice_number.includes(filterData.value.invoice_number))) &&
      (!filterData.value.invoice_number_date || (item.invoice_number_date && item.invoice_number_date.includes(filterData.value.invoice_number_date))) &&
      (!filterData.value.item_code || (item.item_code && item.item_code.includes(filterData.value.item_code))) &&
      (!filterData.value.product_name_supplier || (item.product_name_supplier && item.product_name_supplier.includes(filterData.value.product_name_supplier))) &&
      (!filterData.value.product_code_office_design || (item.product_code_office_design && item.product_code_office_design.includes(filterData.value.product_code_office_design))) &&
      (!filterData.value.product_name_office_design || (item.product_name_office_design && item.product_name_office_design.includes(filterData.value.product_name_office_design))) &&
      (!filterData.value.product_category || (item.product_category && item.product_category.includes(filterData.value.product_category))) &&
      (!filterData.value.model || (item.model && item.model.includes(filterData.value.model))) &&
      (!filterData.value.sn || (item.sn && item.sn.includes(filterData.value.sn)))
    );
  });

  const reverseData = filteredData.reverse()

  return reverseData.slice(start, start + itemsPerPage);
});

const goToFirstPage = () => {
  currentPage.value = 1;
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const goToLastPage = () => {
  currentPage.value = totalPages.value;
};

const navigate = (route, itemId) => {
  router.push({ name: route , params: { id: itemId }});
};
</script>

<style scoped>
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

.table-container {
  padding-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  background-color: #ffffff;
}

table th,
table td {
  padding: 16px;
  border: 1px solid #ddd;
  font-size: 14px;
  white-space: nowrap;
}

table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
  position: sticky;
  top: 0;
  z-index: 2;
}

table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

table tbody tr:hover {
  background-color: #eaf4fc;
  transition: background-color 0.3s ease;
}

table th:nth-last-child(1), table td:nth-last-child(1) {
  position: sticky;
  right: -1px;
  background-color: #ffffff;
  z-index: 4;
}
table th:nth-last-child(2), table td:nth-last-child(2) {
  position: sticky;
  right: 7%;
  background-color: #ffffff;
  z-index: 4;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.update-button,
.details-button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 3px rgba(14, 6, 6, 0.4);
}

.update-button {
  background-color: #F2F2F2;
  color: #000000;
}

.update-button:hover {
  background-color: #d7d7d7;
  transform: scale(1.05);
}

.details-button {
  background-color: #003566;
  color: #ffffff;
}

.details-button:hover {
  background-color: #002242;
  transform: scale(1.05);
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination button {
  padding: 10px 14px;
  border: none;
  background-color: #f8f9fa;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.pagination button:hover {
  background-color: #e2e6ea;
  transform: scale(1.05);
}

.pagination button.active {
  background-color: #007bff;
  color: #ffffff;
  pointer-events: none;
}

.pagination button:disabled {
  background-color: #e9ecef;
  color: #bbb;
  cursor: not-allowed;
}

.input-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 25px;
  max-width: 100%;
  box-sizing: border-box;
  background-color: #f4f4f9; 
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-field {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  margin: 5px 0;
  background-color: #fff;
  transition: all 0.3s ease-in-out;
}

.input-field:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
}

input[type="date"] {
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
}

.input-button {
  background: linear-gradient(90deg, #4CAF50, #66BB6A); /* Gradient green */
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  /* transition: background 0.3s ease, transform 0.3s ease; */
}

.input-button:hover {
  background: linear-gradient(90deg, #66BB6A, #4CAF50);
  transform: translateY(-2px);
}

.input-button:active {
  transform: translateY(1px);
}

button.input-button {
  margin-top: 20px;
}

.input-container input[type="text"] {
  height: 45px;
}

@media (max-width: 768px) {
  .input-container {
    grid-template-columns: 1fr;
  }

  .input-button {
    width: 100%;
  }

  .repair-form {
    flex-direction: column;
    padding: 10px;
  }

  main {
    width: 100%;
  }

  table th,
  table td {
    font-size: 12px;
    padding: 10px;
  }

  .update-button,
  .details-button {
    padding: 6px 12px;
    font-size: 12px;
  }

  .pagination button {
    padding: 8px 10px;
    font-size: 12px;
  }
}
</style>
