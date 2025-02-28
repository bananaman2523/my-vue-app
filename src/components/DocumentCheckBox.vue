<template>
    <main>
        <h2 class="documents-section">ขั้นตอนการติดตั้งอุปกรณ์ไปยังบริษัท / ร้าน</h2>
        <div class="container_checkbox">
            <form @submit.prevent="submitForm">
                <div style="display: contents;">
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.firstSection.installChecked" class="custom-checkbox" /> เจ้าหน้าที่เดินทางไปติดตั้ง
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.firstSection.sendChecked" class="custom-checkbox" /> ส่งเครื่องไป
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.firstSection.onlineChecked" class="custom-checkbox" /> ติดตั้งระบบ online
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.firstSection.otherChecked" class="custom-checkbox" /> อื่นๆ
                        </label>
                        <label>
                            <input v-if="formData.firstSection.otherChecked" type="text" v-model="formData.description_first_section" @change="updateDeliveryNote('description_first_section',formData.description_first_section)" placeholder="โปรดระบุ" class="input-other" />
                        </label>
                    </div>
                </div>
            </form>
        </div>
        <div class="container_checkbox">
            <form @submit.prevent="submitForm">
                <div style="display: contents;">
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.secondSection.posChecked" class="custom-checkbox" /> ชุด POS และ อุปกรณ์
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.secondSection.monitor1Checked" class="custom-checkbox" /> VIVIPOS (Monitor 1)
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.secondSection.monitor2Checked" class="custom-checkbox" /> VIVIPOS (Monitor 2)
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.secondSection.receiptPrinterChecked" class="custom-checkbox" /> Receipt Printer
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.secondSection.labelPrinterChecked" class="custom-checkbox" /> Label Printer
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.secondSection.kitchenPrinterChecked" class="custom-checkbox" /> Kitchen Printer
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.thirdSection.kioskChecked" class="custom-checkbox" /> KIOSK
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.secondSection.otherChecked" class="custom-checkbox" /> อุปกรณ์อื่นๆ โปรดระบุ
                        </label>
                        <label>
                            <input v-if="formData.secondSection.otherChecked" type="text" v-model="formData.description_second_section" @change="updateDeliveryNote('description_second_section',formData.description_second_section)" placeholder="โปรดระบุ" class="input-other" />
                        </label>
                    </div>
                </div>
            </form>
        </div>
        <div class="container_checkbox">
            <form @submit.prevent="submitForm">
                <div style="display: contents;">
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.thirdSection.queueChecked" class="custom-checkbox" /> ระบบ Queue
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.thirdSection.crmChecked" class="custom-checkbox" /> ระบบ CRM
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.thirdSection.eMenuChecked" class="custom-checkbox" /> ระบบ E - Menu
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.thirdSection.warehouseChecked" class="custom-checkbox" /> ระบบ Warehouse
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="formData.thirdSection.otherChecked" class="custom-checkbox" /> ระบบอื่นๆ โปรดระบุ
                        </label>
                        <label>
                            <input v-if="formData.thirdSection.otherChecked" type="text" v-model="formData.description_third_section" @change="updateDeliveryNote('description_third_section',formData.description_third_section)" placeholder="โปรดระบุ" class="input-other" />
                        </label>
                    </div>
                </div>
            </form>
        </div>
        <label style="margin-left: 16px;">รายละเอียดเพิ่มเติม / หมายเหตุ</label>
        <textarea v-model="formData.description" @change="updateDeliveryNote('description',formData.description)" class="note-textarea"></textarea>
        <br>
        <button @click="downloadInstallDoc">Export</button>

    </main>
    <WarningPopup ref="warningPopup" />
    <ApprovePopup ref="approvePopup" />
    <ErrorPopup ref="errorPopup" />
</template>

<script setup>
import { ref , watch } from 'vue';
import { directus } from "@/services/directus";
import { readItems, uploadFiles , updateItem , readFile} from "@directus/sdk";
import { useRoute , useRouter} from "vue-router";
import axios from 'axios';
import ApprovePopup from "@/components/popup/ApprovePopup.vue";
import ErrorPopup from "@/components/popup/ErrorPopup.vue";
import WarningPopup from "@/components/popup/WarningPopup.vue";
const warningPopup = ref(null);
const approvePopup = ref(null);
const errorPopup = ref(null);
const getUser = JSON.parse(localStorage.getItem('user'))
const user = `${getUser.first_name} ${getUser.last_name}`
const formData = ref({
  firstSection: {
    installChecked: false,
    sendChecked: false,
    onlineChecked: false,
    otherChecked: false,
    otherText: "",
  },
  secondSection: {
    posChecked: false,
    monitor1Checked: false,
    monitor2Checked: false,
    receiptPrinterChecked: false,
    labelPrinterChecked: false,
    kitchenPrinterChecked: false,
    otherChecked: false,
    otherText: "",
  },
  thirdSection: {
    kioskChecked: false,
    queueChecked: false,
    crmChecked: false,
    eMenuChecked: false,
    warehouseChecked: false,
    otherChecked: false,
    otherText: "",
  },
});

const route = useRoute();

const fetchData = async () => {
  try {
    const delivery_sheet = await directus.request(
      readItems("delivery_sheet", {
        fields: [
          "*.*.*",
        ],
        filter:{
          id:{
            _eq: route.params.id
          }
        }
      })
    );
    
    if (delivery_sheet.length > 0) {
      const data = delivery_sheet[0];
      
      formData.value = {
        install_status: data.install_status || "",
        company_name: data.packing_sheet[0].company_name || "",
        branch_name: data.packing_sheet[0].branch_name || "",
        firstSection: getSectionStatus(data.first_section_check, "firstSection"),
        secondSection: getSectionStatus(data.second_section_check, "secondSection"),
        thirdSection: getSectionStatus(data.third_section_check, "thirdSection"),
        description_first_section: data.description_first_section || "",
        description_second_section: data.description_second_section || "",
        description_third_section: data.description_third_section || "",
        description: data.description || "",
      };
      
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

const getSectionStatus = (sectionCheck, sectionName) => {
  const allFields = {
    firstSection: [
      "installChecked",
      "sendChecked",
      "onlineChecked",
      "otherChecked"
    ],
    secondSection: [
      "posChecked",
      "monitor1Checked",
      "monitor2Checked",
      "receiptPrinterChecked",
      "labelPrinterChecked",
      "kitchenPrinterChecked",
      "otherChecked"
    ],
    thirdSection: [
      "kioskChecked",
      "queueChecked",
      "crmChecked",
      "eMenuChecked",
      "warehouseChecked",
      "otherChecked"
    ]
  };

  const sectionStatus = allFields[sectionName].reduce((acc, field) => {
    acc[field] = false;
    return acc;
  }, {});

  if (sectionCheck) {
    sectionCheck.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(sectionStatus, field)) {
        sectionStatus[field] = true;
      }
    });
  }

  return sectionStatus;
};


const getCheckedFields = (value) => {
    return Object.keys(value).filter(key => value[key] === true);
};

const updateDeliverySheet = async (field, value) => {
    try {
        const result = getCheckedFields(value);
        
        const payload = { [field]: result };
        await directus.request(updateItem("delivery_sheet", route.params.id, payload));
    } catch (error) {
        console.error(`Error updating ${field} in delivery_sheet:`, error);
    }
};


const updateDeliveryNote = async (field, value) => {
    try {
        if (value !== undefined && value !== null) {
            const payload = { [field]: value };
            await directus.request(updateItem("delivery_sheet", route.params.id, payload));
        }
    } catch (error) {
        console.error(`Error updating ${field} in delivery_sheet:`, error);
    }
};


fetchData();
watch(() => formData.value.firstSection, (newVal) => updateDeliverySheet("first_section_check", newVal), { deep: true });
watch(() => formData.value.secondSection, (newVal) => updateDeliverySheet("second_section_check", newVal), { deep: true });
watch(() => formData.value.thirdSection, (newVal) => updateDeliverySheet("third_section_check", newVal), { deep: true });

const downloadInstallDoc = async () => {
  try {

    const delivery_sheet = await directus.request(
      readItems("delivery_sheet", {
        fields: [
          "document_delivery_number",
        ],
        filter:{
          id:{
            _eq: route.params.id
          }
        }
      })
    );
    
    const payload = formData.value
    payload['document_delivery_number'] = delivery_sheet[0].document_delivery_number
    
    const response = await axios.post('http://localhost:3001/generate-pdf/installDoc', payload, {
        responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'เอกสารรายการติดตั้ง.pdf';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error exporting report:', error);
  }
};
</script>

<style scoped>
.note-textarea {
  width: 80%;
  min-height: 50px;
  margin: 16px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.documents-section {
    font-family: "Prompt", sans-serif;
    border-radius: 8px;
    margin: 20px;
}
.input-other {
    padding: 8px;
    border: 1px solid #d0d0d0;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
}
.custom-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.container_checkbox {
  padding: 20px;
  border: 2px solid #F1F0E8;
  border-radius: 16px;
  margin: 16px;
}
.disable-form{
  background-color: #D9D9D9;
}

.form-delete {
    grid-column: span 3;
    text-align: right;
    margin: 20px;
}

.form-delete button {
    background-color: red;
}

.disable-form {
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
    max-width: 1440px;
    color: #333;
    margin: 0 auto;
    padding: 20px;
}

main {
    flex: 1;
    background-color: #ffffff;
    overflow: hidden;
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
    display: flex;
    align-items: center;
    gap: 8px;
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