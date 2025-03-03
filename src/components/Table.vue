<template>
    <div class="repair-form">
        <main>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th v-for="header in table.headers" :key="header">{{ header }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in paginatedData" :key="index" :id="item.id">
                            <td v-for="(field, fieldIndex) in table.format" :key="fieldIndex" @click="navigate(table.navigate, item.id)">
                                {{ item[field] }}
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
import { ref, computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  table: Object,
  data: Array
});

const { data } = toRefs(props);

const itemsPerPage = 10;
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil((data.value?.length || 0) / itemsPerPage));

const paginatedData = computed(() => {
    if (!data.value) return [];
    const start = (currentPage.value - 1) * itemsPerPage;
    return data.value.slice(start, start + itemsPerPage);
});

const goToFirstPage = () => (currentPage.value = 1);
const goToPreviousPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};
const goToNextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};
const goToLastPage = () => (currentPage.value = totalPages.value);

const navigate = (route, id) => {
    router.push({ name: route , params: { id: id }});
};
</script>

<style scoped>
.repair-form {
    display: flex;
    justify-content: center;
    color: #333;
    margin: 0 auto;
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
</style>