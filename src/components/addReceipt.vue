<template>
    <div class="table-container">
      <button class="navigate-btn" @click="navigateToReceipt">ไปยังหน้ารับเครื่องซ่อม</button>
      <h1>ตารางข้อมูล</h1>
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index">
            <td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  // ใช้ Vue Router เพื่อควบคุมการนำทาง
  const router = useRouter();
  
  // กำหนดข้อมูลคอลัมน์
  const columns = ref([
    { label: 'เลขที่เอกสาร', key: 'documentNumber' },
    { label: 'ชื่อบริษัท', key: 'companyName' },
    { label: 'เบอร์โทรศัพท์', key: 'phone' },
    { label: 'วันที่รับเครื่องซ่อมมา', key: 'receivedDate' },
  ]);
  
  // ข้อมูลตัวอย่างในตาราง
  const tableData = ref([
    {
      documentNumber: 'R240001',
      companyName: 'บริษัท เอ',
      phone: '081-111-2222',
      receivedDate: '2024-12-01',
    },
    {
      documentNumber: 'R240002',
      companyName: 'บริษัท บี',
      phone: '081-333-4444',
      receivedDate: '2024-12-05',
    },
    {
      documentNumber: 'R240003',
      companyName: 'บริษัท ซี',
      phone: '081-555-6666',
      receivedDate: '2024-12-10',
    },
  ]);
  
  // ฟังก์ชันย้ายไปยังหน้า /receipt
  const navigateToReceipt = () => {
    router.push('/receipt');
  };
  </script>
  
  <style scoped>
  /* จัดการรูปแบบพื้นฐาน */
  .table-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-family: 'Arial', sans-serif;
    position: relative; /* สำหรับกำหนดตำแหน่งปุ่ม */
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  /* สไตล์ตาราง */
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
  }
  
  /* ส่วนหัวตาราง */
  thead {
    background: #4CAF50;
    color: white;
  }
  
  th {
    padding: 12px;
    font-size: 1rem;
    text-transform: capitalize;
    font-weight: normal;
  }
  
  /* แถวในตาราง */
  tr {
    border-bottom: 1px solid #ddd;
    transition: background 0.2s ease-in-out;
  }
  
  tr:hover {
    background: #f1f1f1;
  }
  
  /* เซลล์ข้อมูล */
  td {
    padding: 12px;
    font-size: 0.9rem;
    color: #555;
    word-wrap: break-word;
  }
  
  /* เพิ่มระยะห่าง */
  tbody tr:last-child {
    border-bottom: none;
  }
  
  /* ปุ่มย้ายหน้า */
  .navigate-btn {
    position: absolute; /* ตั้งตำแหน่งให้ปุ่ม */
    top: 10px;
    right: 10px; /* มุมขวาบน */
    padding: 10px 20px;
    background-color: #2196F3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .navigate-btn:hover {
    background-color: #1976D2;
  }
  </style>
  