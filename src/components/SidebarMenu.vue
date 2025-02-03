<template>
  <aside class="sidebar">
    <div class="logo">
      <img src="@/assets/office-design-logo-blue.png" alt="Office Design Logo" />
    </div>
    <ul>
      <!-- <li @click="navigate('addReceipt')">เพิ่มข้อมูลการแจ้งซ่อม</li>
      <li @click="navigate('list')">แสดงรายการทั้งหมด</li> -->
      <li @click="navigate('receiptProduct')">เพิ่มสินค้าเข้า Stock</li>
      <li @click="navigate('listStock')">Stock</li>
      <li @click="navigate('DocumentPreparation')">ใบเตรียมจัดของ</li>
      <!-- <li @click="navigate('completed')">รายการที่เสร็จสิ้นแล้ว</li>
      <li @click="navigate('in-progress')">รายการที่กำลังดำเนินการ</li> -->
    </ul>
    <div class="login">
      test
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const emit = defineEmits(['navigate']);
const navigate = (route) => {
  router.push({ name: route });
};
</script>

<style scoped>
.login{
  display: flex;
}

.sidebar {
  max-width: 250px;
  background-color: #f2f2f2;
  color: #333;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: "Arial", sans-serif;
}

.logo {
  text-align: center;
  margin-bottom: 40px;
}

.logo img {
  max-width: 257px;
  height: 100%;
  border-radius: 50%;
}

ul {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 14px 24px;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  text-align: left;
  transition: background-color 0.3s, transform 0.2s ease;
  cursor: pointer;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

li:hover {
  background-color: #004080;
  color: #fff;
  transform: translateX(4px);
}

li:active {
  background-color: #003366;
  transform: translateX(2px);
}

li svg {
  margin-right: 12px;
  transition: transform 0.3s ease;
}

li:hover svg {
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    padding: 20px;
  }

  .logo img {
    max-width: 80px;
  }

  li {
    font-size: 16px;
    padding: 12px 20px;
  }
}
</style>
