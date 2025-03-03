<template>
    <div class="repair-form">
        <SidebarMenu />
        <main>
            <h1>ใบจัดเตรียมสินค้า</h1>
            <TableList :table="table" :data="data"/>
        </main>
    </div>
</template>

<script setup>
import { directus } from "@/services/directus";
import { ref } from "vue";
import { readItems } from "@directus/sdk";
import SidebarMenu from "@/components/SidebarMenu.vue";
import TableList from "@/components/Table.vue";

const table = ref({
    headers: ['Cloud', 'บริษัท', 'ร้าน', 'รหัสสาขา', 'สาขา', 'สถานะ'],
    navigate: 'serviceFeeListDetail',
    format: ["id","delivery_sheet.id","status"]
});

const data = ref([]);

const fetchData = async () => {
    try {
        const response = await directus.request(
            readItems("service_fee", {
                fields: [
                    "id",
                    "delivery_sheet.id",
                    "delivery_sheet.packing_sheet.branch_code",
                    "delivery_sheet.packing_sheet.branch_name",
                    "delivery_sheet.packing_sheet.company_name",
                    "delivery_sheet.packing_sheet.customer_name"
                ],
            })
        );
        
        data.value = response;
    } catch (error) {
        console.error("Error fetching activities:", error);
    }
};

fetchData();
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
    /* background-color: #f8f9fa; */
    font-weight: bold;
    color: #333;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 2;
    border-bottom: gray 2px solid;
    border-top: none;
    border-left: none;
    border-right: none;
}
table th:nth-last-child(1), table td:nth-last-child(1) {
  position: sticky;
  right: -1px;
  background-color: #ffffff;
  z-index: 4;
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