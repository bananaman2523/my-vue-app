<template>
  <div class="repair-form">
    <SidebarMenu />
    <main>
      <h1>ใบจัดเตรียมสินค้า</h1>
      <div v-show="isFilterVisible" class="input-container">
        <div class="form-row">
          <label>ค้นหาด้วย วันส่งสินค้า เริ่มต้น</label>
          <input type="date" v-model="filterData.delivery_date_from" placeholder="From Date">
        </div>
        <div class="form-row">
          <label>ค้นหาด้วย วันส่งสินค้า สิ้นสุด</label>
          <input type="date" v-model="filterData.delivery_date_to" placeholder="To Date">
        </div>
        <br>
        <div class="form-row">
          <label class="label-filter">ค้นหาด้วย เลขที่ใบจัดส่งสินค้า</label>
          <input v-model="filterData.document_delivery_number" type="text" class="input-field" placeholder="เลขที่ใบจัดส่งสินค้า">
        </div>
        <div class="form-row">
          <label class="label-filter">ค้นหาด้วย เลขที่ใบเสนอราคา</label>
          <input v-model="filterData.customer_order_number" type="text" class="input-field" placeholder="เลขที่ใบเสนอราคา">
        </div>
        <div class="form-row">
          <label class="label-filter">ค้นหาด้วย เลขที่ใบสั่งซื้อ</label>
          <input v-model="filterData.quotation_number_office_design" type="text" class="input-field" placeholder="เลขที่ใบสั่งซื้อ">
        </div>
        <div class="form-row">
          <label class="label-filter">ค้นหาด้วย ชื่อลูกค้า</label>
          <input v-model="filterData.customer_name" type="text" class="input-field" placeholder="ชื่อลูกค้า">
        </div>
        <div class="form-row">
          <label class="label-filter">ค้นหาด้วย ชื่อสาขา</label>
          <input v-model="filterData.branch_name" type="text" class="input-field" placeholder="ชื่อสาขา">
        </div>
        <br>
        <div class="form-row">
          <label class="label-filter">ค้นหาด้วย สถานะจัดส่งสินค้า</label>
          <select v-model="filterData.delivery_status">
            <option value=""></option>
            <option value="รอการจัดส่งสินค้า">รอการจัดส่งสินค้า</option>
            <option value="จัดส่งสินค้าเสร็จสิ้น">จัดส่งสินค้าเสร็จสิ้น</option>
          </select>
        </div>
        <div class="form-row">
          <label class="label-filter">ค้นหาด้วย สถานะรายงานติดตั้ง</label>
          <select v-model="filterData.install_status">
            <option value=""></option>
            <option value="รอการติดตั้ง">รอการติดตั้ง</option>
            <option value="ติดตั้งเสร็จสิ้น">ติดตั้งเสร็จสิ้น</option>
          </select>
        </div>
        <div class="form-row">
          <label class="label-filter">ค้นหาด้วย พนักงานติดตั้ง</label>
          <select v-model="filterData.prepared_by">
            <option value="">เลือกจัดเตรียมโดย</option>
            <option v-for="(item, index) in preparedByList" :key="index" :value="item.prepared_by">
              {{ item.prepared_by }}
            </option>
          </select>
        </div>
        <label style="grid-column: 1/4;">จำนวนสถานะ ผ่าน {{ countSuccess }} , รอเช็คก่อนส่ง {{ countWaitCheck }} <br> จำนวน รายการจัดของ {{ countPreparTotal }}</label>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>วันส่งสินค้า</th>
              <th>เลขที่ใบจัดส่งสินค้า</th>
              <th>เลขที่ใบสั่งซื้อ</th>
              <th>เลขที่ใบเสนอราคา</th>
              <th>ชื่อลูกค้า</th>
              <th>ชื่อสาขา</th>
              <th>สถานะจัดส่งสินค้า</th>
              <th>สถานะรายงานติดตั้ง</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="index" :id="item.id"
              @click="navigate('documentShippingDetail', item.id)">
              <td>{{ item.delivery_date }}</td>
              <td>{{ item.document_delivery_number }}</td>
              <td>{{ item.packing_sheet[0]?.customer_order_number }}</td>
              <td>{{ item.packing_sheet[0]?.quotation_number_office_design }}</td>
              <td>{{ item.packing_sheet[0]?.customer_name }}</td>
              <td>{{ item.packing_sheet[0]?.branch_name }}</td>
              <td>{{ item.delivery_status }}</td>
              <td>{{ item.install_status }}</td>
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

const isFilterVisible = ref(true);
const router = useRouter();
const data = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const preparedByList = ref([]);

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
  status: "",
  delivery_status: "",
  install_status: "",
});

const fetchData = async () => {
  try {
    const response = await directus.request(
      readItems("delivery_sheet", {
        fields: ["*.*"],
      })
    );
    data.value = response;

    const getAdmin = await directus.request(
      readItems("packing_sheet", {
        groupBy: ["prepared_by"],
      })
    );
    preparedByList.value = getAdmin
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

fetchData();

const totalPages = computed(() => Math.ceil(data.value.length / itemsPerPage));

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;

  const filteredData = data.value.filter(item => {
    const itemReceiveDate = new Date(item.delivery_date);
    const fromDate = filterData.value.delivery_date_from ? new Date(filterData.value.delivery_date_from) : null;
    const toDate = filterData.value.delivery_date_to ? new Date(filterData.value.delivery_date_to) : null;

    const isInDateRange = (!fromDate || itemReceiveDate >= fromDate) && (!toDate || itemReceiveDate <= toDate);

    return (
      isInDateRange &&
      (!filterData.value.document_delivery_number || (item.document_delivery_number && item.document_delivery_number.includes(filterData.value.document_delivery_number))) &&
      (!filterData.value.delivery_status || (item.delivery_status && item.delivery_status.includes(filterData.value.delivery_status))) &&
      (!filterData.value.install_status || (item.install_status && item.install_status.includes(filterData.value.install_status))) &&
      (!filterData.value.document_delivery_number || (item.document_delivery_number && item.document_delivery_number.includes(filterData.value.document_delivery_number))) &&
      (!filterData.value.customer_order_number || (item.packing_sheet[0].customer_order_number && item.packing_sheet[0].customer_order_number.includes(filterData.value.customer_order_number))) &&
      (!filterData.value.quotation_number_office_design || (item.packing_sheet[0].quotation_number_office_design && item.packing_sheet[0].quotation_number_office_design.includes(filterData.value.quotation_number_office_design))) &&
      (!filterData.value.branch_name || (item.packing_sheet[0].branch_name && item.packing_sheet[0].branch_name.includes(filterData.value.branch_name))) &&
      (!filterData.value.customer_name || (item.packing_sheet[0].customer_name && item.packing_sheet[0].customer_name.includes(filterData.value.customer_name))) 
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
  router.push({ name: route, params: { id: itemId } });
};

const toggleFilterVisibility = () => {
  isFilterVisible.value = !isFilterVisible.value;
};
</script>

<style scoped>
select {
  padding: 12px;
  margin-top: 4px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f7f7f7;
  color: #333;
  transition: all 0.3s ease;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggle-btn {
  margin: 16px;
  border-radius: 16px;
  font-size: 16px;
  align-content: flex-end;
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

.table-container {
  padding: 20px;
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

.info-container {
  display: grid;
  gap: 20px;
  padding: 25px;
  max-width: 100%;
  box-sizing: border-box;
  background-color: #f4f4f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-container {
  display: grid;
  /* grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); */
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
  border-color: #004080;
  box-shadow: 0 0 8px rgba(0, 64, 128, 0.5);
}

input[type="date"] {
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
}

.input-button {
  background: linear-gradient(90deg, #4CAF50, #66BB6A);
  /* Gradient green */
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
  margin-top: auto;
}
</style>