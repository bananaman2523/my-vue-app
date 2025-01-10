<template>
  <div class="repair-form">
    <SidebarMenu />
    <main>
      <h1>อัปเดตข้อมูลการแจ้งซ่อม</h1>
      <div class="container">
        <div class="detail-item">
          <table  v-for="(item, index) in form" :key="index" class="item">
            <tr>
              <td>
                {{ item.label }}
              </td>
            </tr>
            <tr>
              <td>
                {{ item.value }}
              </td>
              
            </tr>
          </table>
          <div>
            <div class="form-actions">
              <button type="submit" @click="goToUpdateReceipt()">บันทึก</button>
            </div>
          </div>
          
        </div>  
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute , useRouter} from "vue-router";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { directus } from "@/services/directus";
import { readItems } from "@directus/sdk";

const router = useRouter(); 
const route = useRoute();
const itemId = route.params.id;
const data = ref([]);
const form = ref([
  { label: 'เลขที่เอกสาร', value: '' },
  { label: 'ชื่อร้านค้า', value: '' },
  { label: 'ชื่อสาขา', value: '' },
  { label: 'เบอร์โทรศัพท์', value: '' },
  { label: 'อุปกรณ์', value: '' },
  { label: 'รุ่น/แบรนด์', value: '' },
  { label: 'S/N', value: '' },
  { label: 'POS Terminal', value: '' },
  { label: 'ประกันเครื่อง', value: '' },
  { label: 'รายละเอียดของปัญหา', value: '' },
  { label: 'เลขที่ใบเสนอราคา/ใบวางบิล', value: '' },
  { label: 'วัตถุประสงค์ในการส่งเครื่อง', value: '' },
  { label: 'บริษทที่รับซ่อม', value: '' },
  { label: 'วันที่รับเครื่อง', value: '' },
  { label: 'วันที่ส่งซ่อม', value: '' },
  { label: 'วันที่รับคืน', value: '' },
  { label: 'วันที่จัดส่ง', value: '' },
  { label: 'รายละเอียดเพิ่มเติม/หมายเหตุ', value: '' },
]);

const formatDate = (date) => {
  if (!date) return "";
  const formattedDate = new Date(date);
  return formattedDate.toISOString().slice(0, 10);
};

const prefillForm = (item) => {
  form.value[0].value = item.document_number || "";
  form.value[1].value = item.company_name || "";
  form.value[2].value = item.branch_name || "";
  form.value[3].value = item.phone_number || "";
  form.value[4].value = item.equipment_name || "";
  form.value[5].value = item.model || "";
  form.value[6].value = item.serial_number || "";
  form.value[7].value = item.pos_terminal || "";
  form.value[8].value = item.warranty_status || "";
  form.value[9].value = item.detail || "";
  form.value[10].value = item.quotation_number || "";
  form.value[11].value = item.repair_reason || "";
  form.value[12].value = item.repair_company || "";
  form.value[13].value = formatDate(item.repair_received_date);
  form.value[14].value = formatDate(item.repair_date);
  form.value[15].value = formatDate(item.shipping_date);
  form.value[16].value = formatDate(item.refund_date);
  form.value[17].value = item.additional_details || "";
};

const fetchData = async () => {
  try {
    const response = await directus.request(
      readItems("device_transfer_details", {
        filter: {
          id: { _eq: itemId },
        },
        fields: ["*"],
      })
    );
    if (response.length) {
      data.value = response[0];
      prefillForm(data.value);
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

const goToUpdateReceipt = () => {
  router.push({ name: 'updateReceipt', params: { id: itemId } });
};

fetchData();
</script>

<style scoped>
.detail-item {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  background-color: #F2F2F2;
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  justify-content: center;
  box-sizing: border-box;
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

.container {
  padding: 20px;
}

.repair-form {
  display: flex;
  justify-content: center;
  max-width: 1440px;
  color: #333;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.form-row {
  display: contents;
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
  margin-top: 20px;
}

.item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 350px;
  padding: 10px;
  border-radius: 5px;
}

.label {
  font-weight: bold;
}

.value {
  color: #333;
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
