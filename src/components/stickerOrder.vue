<template>
  <div class="repair-form">
    <SidebarMenu />
    <main>
      <h1>ใบสติ๊กเกอร์ติดสินค้า</h1>
      <div class="container">
        <form @submit.prevent="submitForm">
          <div class="form-row">
            <label>รหัสสินค้า</label>
            <input type="text" />
          </div>
          <div class="form-row">
            <label>ชื่อสินค้า<label style="color: red;">*</label></label>
            <input type="text" />
          </div>
          <div class="form-row">
            <label>ชื่อกลุ่มสินค้า<label style="color: red;">*</label></label>
            <input type="text" />
          </div>
          <div class="form-row">
            <label>ชื่อลูกค้า<label style="color: red;">*</label></label>
            <input type="text"  />
          </div>
          <div class="form-row">
            <label>ชื่อสาขา<label style="color: red;">*</label></label>
            <input type="text" />
          </div>
          <div class="form-row">
            <label>รหัสสาขา<label style="color: red;">*</label></label>
            <input type="text" />
          </div>
          <div class="form-row">
            <label>วันที่ส่งสินค้า<label style="color: red;">*</label></label>
            <input type="date" />
          </div>
        </form>
      </div>
      <div class="form-actions">
        <button type="button" @click="submitForm">บันทึก</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { directus } from "@/services/directus";
import { createItem, readItems } from "@directus/sdk";
import SidebarMenu from "@/components/SidebarMenu.vue";

</script>

<style scoped>
.disable-form{
  background-color: #D9D9D9;
}
.container {
  padding: 20px;
  overflow-x: auto;
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
