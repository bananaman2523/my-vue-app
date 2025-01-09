<template>
  <div class="repair-form">
    <SidebarMenu />
    <main>
      <h1>อัปเดตข้อมูลการแจ้งซ่อม</h1>
      <div class="container">
        <form @submit.prevent="submitForm">
        <div class="form-row">
          <label>เลขที่เอกสาร</label>
          <input type="text" disabled v-model="form.documentNumber"/>
        </div>
        <div class="form-row">
          <label>เลขที่ใบเสนอราคา/ใบวางบิล</label>
          <input type="text" v-model="form.quotationNumber" />
        </div>
        <div class="form-row">
          <label>ชื่อบริษัท</label>
          <select v-model="form.companyName">
            <option disabled value="">เลือกบริษัท</option>
            <option v-for="company in config.companies" :key="company.companyName" :value="company.companyName">
              {{ company.companyName }}
            </option>
          </select>
        </div>
        <div class="form-row">
          <label>ชื่อสาขา</label>
          <select v-model="form.branchName" :disabled="!form.companyName">
            <option disabled value="">เลือกสาขา</option>
            <option v-for="branch in getBranches(form.companyName)" :key="branch" :value="branch">
              {{ branch }}
            </option>
          </select>
        </div>
        <div class="form-row">
          <label>เบอร์โทรศัพท์</label>
          <input type="text" v-model="form.phoneNumber"/>
        </div>
        <div class="form-row">
          <label>วันที่รับเครื่อง</label>
          <input type="date" v-model="form.receivedDate" />
        </div>
        <div class="form-row">
          <label>วันที่ส่งซ่อม</label>
          <input type="date" v-model="form.repairDate" />
        </div>
        <div class="form-row">
          <label>วันที่จัดส่ง</label>
          <input type="date" v-model="form.shippingDate" />
        </div>
        <div class="form-row">
          <label>วันที่รับคืน</label>
          <input type="date" v-model="form.refundDate" />
        </div>
        <div class="form-row">
          <label>อุปกรณ์</label>
          <select v-model="form.equipmentName">
            <option disabled value="">เลือกรายการ</option>
            <option v-for="equipments in config.equipments" :key="equipments.equipmentName" :value="equipments.equipmentName">
              {{ equipments.equipmentName }}
            </option>
          </select>
        </div>
        <div class="form-row">
          <label>รุ่น/แบรนด์</label>
          <select v-model="form.modelName" :disabled="!form.equipmentName">
            <option disabled value="">เลือกรายการ</option>
            <option v-for="equipment in getModels(form.equipmentName)" :key="equipment" :value="equipment">
              {{ equipment }}
            </option>
          </select>
        </div>
        <div class="form-row">
          <label>S/N</label>
          <input type="text" v-model="form.serialNumber"/>
        </div>
        <div class="form-row">
          <label>POS Terminal</label>
          <div class="checkbox-group">
            <label><input type="checkbox" v-model="form.posTerminal" value="adapter" /> Adapter</label>
            <label><input type="checkbox" v-model="form.posTerminal" value="ac_power_cable" /> AC power cable</label>
            <label><input type="checkbox" v-model="form.posTerminal" value="box" /> กล่อง</label>
          </div>
        </div>
        <div class="form-row">
          <label>รายละเอียดของปัญหา</label>
          <input type="text" v-model="form.detailEquipment"/>
        </div>
        <div class="form-row">
          <label>บริษัทรับซ่อม</label>
          <select v-model="form.repairCompany">
            <option disabled value="">เลือกรายการ</option>
            <option v-for="company in config.repairCompanies" :key="company" :value="company">
              {{ company }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>ประกันเครื่อง</label>
          <select v-model="form.warrantyStatuse">
            <option disabled value="">เลือกรายการ</option>
            <option v-for="warranty in config.warrantyStatuses" :key="warranty.value" :value="warranty.value">
              {{ warranty.status }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>วัตถุประสงค์ในการส่งซ่อม</label>
          <select v-model="form.repairReason">
            <option disabled value="">เลือกรายการ</option>
            <option v-for="reason in config.repairReasons" :key="reason" :value="reason">
              {{ reason }}
            </option>
          </select>
        </div>
        <div class="form-row">
          <label>รายละเอียดเพิ่มเติม/หมายเหตุ</label>
          <input type="text" v-model="form.additionalDetail" />
        </div>

        <div class="form-actions">
          <button type="submit">บันทึก</button>
        </div>
      </form>
      </div>
    </main>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { directus } from "@/services/directus";
import { createItem, readItems , updateItems } from "@directus/sdk";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { useRoute } from 'vue-router';
const route = useRoute();

const data = ref([])
const config = ref({
  companies: [],
  equipments: [],
});

const form = ref({
  quotationNumber: '',
  companyName: '',
  warrantyStatuse: '',
  branchName: '',
  phoneNumber: '',
  receivedDate: '',
  repairDate: '',
  shippingDate: '',
  refundDate: '',
  additionalDetail: '',
  equipmentName: '',
  repairReason: '',
  serialNumber: '',
  posTerminal: [],
  repairCompany: '',
  detailEquipment: '',
});

function simplifyInput(input) {
  const result = {
    companies: [],
    equipments: [],
    repairCompanies: [],
    warrantyStatuses: [],
    repairReasons: []
  };

  input.forEach(item => {
    if (item.company) {
      item.company.forEach(company => {
        const branches = company.branch.map(branch => branch.branch_id.branch_name);
        result.companies.push({
          companyName: company.company_name,
          branches
        });
      });
    }

    if (item.equipments) {
      item.equipments.forEach(equipment => {
        const models = equipment.model.map(model => model.model_id.model_name);
        result.equipments.push({
          equipmentName: equipment.equipment_name,
          models
        });
      });
    }

    if (item.repair_company) {
      item.repair_company.forEach(repairCompany => {
        result.repairCompanies.push(repairCompany.repair_company_name);
      });
    }

    if (item.warranty_status) {
      item.warranty_status.forEach(status => {
        result.warrantyStatuses.push({
          status: status.warranty_status,
          value: status.value
        });
      });
    }

    if (item.repair_reason) {
      item.repair_reason.forEach(reason => {
        result.repairReasons.push(reason.repair_reason);
      });
    }
  });

  return result;
}

const fetchData = async () => {
  try {
    const itemId = route.params.id;

    const response = await directus.request(
      readItems("device_transfer_details", {
        filter: {
          id: {
              _eq: itemId,
          },
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

const formatDate = (date) => {
  if (!date) return '';
  const formattedDate = new Date(date);
  return formattedDate.toISOString().slice(0, 10);
};

const prefillForm = (item) => {
  form.value.documentNumber = item.document_number || "";
  form.value.quotationNumber = item.quotation_number || "";
  form.value.companyName = item.company_name || "";
  form.value.branchName = item.branch_name || "";
  form.value.phoneNumber = item.phone_number || "";
  form.value.receivedDate = formatDate(item.repair_received_date);
  form.value.repairDate = formatDate(item.repair_date);
  form.value.shippingDate = formatDate(item.shipping_date);
  form.value.refundDate = formatDate(item.refund_date);
  form.value.equipmentName = item.equipment_name || "";
  form.value.modelName = item.model || "";
  form.value.serialNumber = item.serial_number || "";
  form.value.posTerminal = item.pos_terminal || [];
  form.value.detailEquipment = item.detail || "";
  form.value.repairCompany = item.repair_company || "";
  form.value.repairReason = item.repair_reason || "";
  form.value.warrantyStatuse = item.warranty_status || "";
  form.value.additionalDetail = item.additional_details || "";
};

const fetchConfig = async () => {
  try {
    const response = await directus.request(
      readItems("config", {
        fields: [
          "template",
          "company.company_name",
          "company.branch.branch_id.branch_name",
          "equipments.equipment_name",
          "equipments.model.model_id.model_name",
          "repair_company.repair_company_name",
          "warranty_status.warranty_status",
          "warranty_status.value",
          "repair_reason.repair_reason"
        ],
      })
    );

    Object.assign(config.value, simplifyInput(response));

  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

const submitForm = async () => {
  try {
    const result = await directus.request(
      createItem('device_transfer_details', {
        quotation_number: form.value.quotationNumber,
        phone_number: form.value.phoneNumber,
        repair_received_date: form.value.receivedDate,
        repair_date: form.value.repairDate,
        shipping_date: form.value.shippingDate,
        refund_date: form.value.refundDate,
        company_name: form.value.companyName,
        branch_name: form.value.branchName,
        equipment_name: form.value.equipmentName,
        model: form.value.modelName,
        sum: 1,
        serial_number: form.value.serialNumber,
        pos_terminal: form.value.posTerminal,
        detail: form.value.detailEquipment,
        repair_company: form.value.repairCompany,
        repair_reason: form.value.repairReason,
        warranty_status: form.value.warrantyStatuse,
        additional_details: form.value.additionalDetail,
      })
    );
    console.log('Article created successfully:', result);
  } catch (error) {
    console.error('Error creating article:', error);
  }
};

const getBranches = (companyName) =>
  config.value.companies.find((c) => c.companyName === companyName)?.branches ||
  [];

const getModels = (equipmentName) =>
  config.value.equipments.find((c) => c.equipmentName === equipmentName)?.models ||
  [];

fetchConfig();
fetchData();
</script>

<style scoped>
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
  /* background-color: #F2F2F2; */
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
  grid-column: span 2;
  text-align: right;
  margin-top: 20px;
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
