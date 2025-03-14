<template>
  <div class="repair-form">
    <SidebarMenu />
    <main>
      <h1>รายการทั้งหมด</h1>
      <div class="input-container">
        <input type="text" id="inputField" class="input-field" placeholder="พิมพ์เลขที่เอกสาร">
        <button class="input-button">ค้นหา</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ชื่อร้านค้า</th>
              <th>ชื่อสาขา</th>
              <th>อุปกรณ์</th>
              <th>รุ่น/แบรนด์</th>
              <th>S/N</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ item.company_name }}</td>
              <td>{{ item.branch_name }}</td>
              <td>{{ item.equipment_name }}</td>
              <td>{{ item.model }}</td>
              <td>{{ item.serial_number }}</td>
              <td class="action-buttons">
                <button class="update-button" @click="goToUpdateReceipt(item.id)">อัปเดตข้อมูล</button>
                <button class="details-button" @click="goToDetailPage(item.id)">ดูรายละเอียด</button>
              </td>
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
const itemsPerPage = 10;

const fetchData = async () => {
  try {
    const response = await directus.request(
      readItems("device_transfer_details", {
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
  
  return data.value.slice(start, start + itemsPerPage);
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

const goToUpdateReceipt = (itemId) => {
  router.push({ name: 'updateReceipt', params: { id: itemId } });
};

const goToDetailPage = (itemId) => {
  router.push({ name: 'detail', params: { id: itemId } });
};
</script>

<style scoped>
.repair-form {
  display: flex;
  justify-content: center;
  /* max-width: 1440px; */
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

.input-container {
  padding: 15px;
  display: flex;
  width: 300px;
}
.input-field {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-right: none;
  border-radius: 10px 0 0 10px;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.input-button {
  width: 150px;
  padding: 10px;
  background-color: #FFC300;
  color: black;
  border: 1px solid #ccc;
  border-left: none;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
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
