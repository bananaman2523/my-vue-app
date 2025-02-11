<template>
  <aside class="sidebar">
    <div class="logo">
      <img src="@/assets/office-design-logo-blue.png" alt="Office Design Logo" />
    </div>
    <ul>
      <!-- <li @click="navigate('addReceipt')">เพิ่มข้อมูลการแจ้งซ่อม</li>
      <li @click="navigate('list')">แสดงรายการทั้งหมด</li> -->
      <li @click="navigate('receiptProduct')">เพิ่มสินค้านำเข้า</li>
      <li @click="navigate('listStock')">คลังสินค้า</li>
      <li @click="navigate('listStockDefective')">อุปกรณ์ชำรุด</li>
      <li @click="navigate('DocumentPreparation')">เพิ่มรายการจัดของ</li>
      <li @click="navigate('listPreparationPage')">แสดงรายการจัดของ</li>
      <li @click="navigate('productOrder')">ใบส่งสินค้า</li>
      <!-- <li @click="navigate('stickerOrder')">ใบสติ๊กเกอร์ติดอุปกรณ์</li> -->
      <!-- <li @click="navigate('completed')">รายการที่เสร็จสิ้นแล้ว</li>
      <li @click="navigate('in-progress')">รายการที่กำลังดำเนินการ</li> -->
    </ul>
    <div class="login">
      <div>
        <p>{{ user?.first_name }} {{ user?.last_name }}</p>
        <p>Email: {{ user?.email }}</p>
      </div>

      <button @click="handleLogout">Log out</button>
    </div>
  </aside>
</template>

<script setup>
import { directus } from '@/services/directus';
import { useRouter } from 'vue-router';
import { readUsers } from "@directus/sdk";
import { ref } from 'vue';

const router = useRouter();
const user = ref();
const emit = defineEmits(['navigate']);
const navigate = (route) => {
  router.push({ name: route });
};
const fetchData = async () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    return;
  }

  try {
    const response = await directus.request(
      readUsers({
        filter: {
          email: { _eq: localStorage.getItem('user_email') },
        },
        fields: ["*"],
      })
    );
    
    user.value = response[0];
    localStorage.setItem('user', JSON.stringify(user.value));
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

fetchData();

const handleLogout = () => {
  localStorage.removeItem('directus-data');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user')
  
  router.push({ name: 'login' });
};
</script>

<style scoped>
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

.login {
  margin-top: auto;
  width: 100%;
  text-align: center;
}

.login button {
  padding: 12px 20px;
  background-color: #004080;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.login button:hover {
  background-color: #003366;
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

  .login button {
    font-size: 14px;
  }
}
</style>