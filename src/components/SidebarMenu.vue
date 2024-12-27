<template>
    <aside class="sidebar">
      <div class="logo">
        <img src="@/assets/office-design-logo-blue.png" alt="Office Design Logo" />
      </div>
      <ul>
        <li @click="navigate('add')">เพิ่มข้อมูลการแจ้งซ่อม</li>
        <li @click="navigate('all')">แสดงรายการทั้งหมด</li>
        <li @click="navigate('completed')">รายการที่เสร็จสิ้นแล้ว</li>
        <li @click="navigate('in-progress')">รายการที่กำลังดำเนินการ</li>
      </ul>
    </aside>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['navigate']);
  
  const navigate = (route) => {
    emit('navigate', route);
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    background-color: #ffffff;
    color: #333;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
    font-family: "Arial", sans-serif;
    border-radius: 12px;
    /* transition: all 0.3s ease; */
  }

  .sidebar:hover {
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
  }

  .logo {
    text-align: center;
    margin-bottom: 40px;
  }

  .logo img {
    max-width: 120px;
    height: auto;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  .logo img:hover {
    transform: scale(1.1);
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

  .sidebar-footer {
    margin-top: auto;
    font-size: 14px;
    color: #aaa;
    text-align: center;
    margin-top: 40px;
  }

  .sidebar-footer a {
    color: #f8c344;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s, transform 0.3s ease;
  }

  .sidebar-footer a:hover {
    color: #d6a22e;
    transform: translateY(-2px);
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
