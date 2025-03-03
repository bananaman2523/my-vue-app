<template>
    <div class="repair-form">
        <SidebarMenu />
        <main>
            <h1>รายละเอียด</h1>
            <div class="container">
                <form @submit.prevent="submitForm">
                    <div class="form-row">
                        <label>สถานะ</label>
                        <input type="text" />
                    </div>
                    <div class="form-row">
                        <label>ชื่อบริษัท</label>
                        <input type="text" />
                    </div>
                    <div class="form-row">
                        <label>ชื่อร้าน</label>
                        <input type="text" />
                    </div>
                    <div class="form-row">
                        <label>ชื่อสาขา</label>
                        <input type="text"/>
                    </div>
                    <div class="form-row">
                        <label>รหัสสาขา</label>
                        <input type="text" />
                    </div>
                    <div class="form-row">
                        <label>เลขที่ใบแจ้งหนี้</label>
                        <input type="text" />
                    </div>
                </form>
            </div>
            <div class="container">
                <form @submit.prevent="submitForm">
                    <div class="form-row">
                        <label>คลาวด์</label>
                        <input type="text" />
                    </div>
                    <div class="form-row">
                        <label>แพ็คเกจ</label>
                        <input type="text" />
                    </div>
                    <div class="form-row">
                        <label>จ่ายจริง</label>
                        <input type="text" />
                    </div>
                    <div class="form-row">
                        <label>วันเริ่มรอบปัจจุบัน</label>
                        <input type="date"/>
                    </div>
                    <div class="form-row">
                        <label>วันที่ครบกำหนด</label>
                        <input type="date"/>
                    </div>
                </form>
            </div>
        </main>
    </div>
</template>

<script setup>
import SidebarMenu from "@/components/SidebarMenu.vue";
import { ref } from "vue";

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

.disable-form {
    background-color: #D9D9D9;
}

.disable-form-user {
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

.disable-form {
    background-color: #D9D9D9;
}

.container {
    padding: 20px;
    overflow-x: auto;
}

.container-product {
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