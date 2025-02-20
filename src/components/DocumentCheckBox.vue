<template>
    <main>
        <h2 class="documents-section">ขั้นตอนการติดตั้งอุปกรณ์ไปยังบริษัท / ร้าน</h2>
        <div class="container_checkbox">
            <form @submit.prevent="submitForm">
                <div style="display: contents;">
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="firstSection.installChecked" class="custom-checkbox" /> เจ้าหน้าที่เดินทางไปติดตั้ง
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="firstSection.sendChecked" class="custom-checkbox" /> ส่งเครื่องไป
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="firstSection.onlineChecked" class="custom-checkbox" /> ติดตั้งระบบ online
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="firstSection.otherChecked" class="custom-checkbox" /> อื่นๆ
                        </label>
                        <label>
                            <input v-if="firstSection.otherChecked" type="text" v-model="firstSection.otherText" placeholder="โปรดระบุ" class="input-other" />
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
                            <input type="checkbox" v-model="secondSection.posChecked" class="custom-checkbox" /> ชุด POS และ อุปกรณ์
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="secondSection.monitor1Checked" class="custom-checkbox" /> VIVIPOS (Monitor 1)
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="secondSection.monitor2Checked" class="custom-checkbox" /> VIVIPOS (Monitor 2)
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="secondSection.receiptPrinterChecked" class="custom-checkbox" /> Receipt Printer
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="secondSection.labelPrinterChecked" class="custom-checkbox" /> Label Printer
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="secondSection.kitchenPrinterChecked" class="custom-checkbox" /> Kitchen Printer
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="secondSection.otherChecked" class="custom-checkbox" /> อุปกรณ์อื่นๆ โปรดระบุ
                        </label>
                        <label>
                            <input v-if="secondSection.otherChecked" type="text" v-model="secondSection.otherText" placeholder="โปรดระบุ" class="input-other" />
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
                            <input type="checkbox" v-model="thirdSection.kioskChecked" class="custom-checkbox" /> KIOSK
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="thirdSection.queueChecked" class="custom-checkbox" /> ระบบ Queue
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="thirdSection.crmChecked" class="custom-checkbox" /> ระบบ CRM
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="thirdSection.eMenuChecked" class="custom-checkbox" /> ระบบ E - Menu
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="thirdSection.warehouseChecked" class="custom-checkbox" /> ระบบ Warehouse
                        </label>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" v-model="thirdSection.otherChecked" class="custom-checkbox" /> ระบบอื่นๆ โปรดระบุ
                        </label>
                        <label>
                            <input v-if="thirdSection.otherChecked" type="text" v-model="thirdSection.otherText" placeholder="โปรดระบุ" class="input-other" />
                        </label>
                    </div>
                </div>
            </form>
        </div>
        <label style="margin-left: 16px;">รายละเอียดเพิ่มเติม / หมายเหตุ</label>
        <textarea v-model="note" class="note-textarea"></textarea>

    </main>
    <WarningPopup ref="warningPopup" />
    <ApprovePopup ref="approvePopup" />
    <ErrorPopup ref="errorPopup" />
</template>

<script setup>
import { ref } from 'vue';
import { directus } from "@/services/directus";
import { readItems, uploadFiles , updateItem , readFile} from "@directus/sdk";
import { useRoute , useRouter} from "vue-router";
import ApprovePopup from "@/components/popup/ApprovePopup.vue";
import ErrorPopup from "@/components/popup/ErrorPopup.vue";
import WarningPopup from "@/components/popup/WarningPopup.vue";
const warningPopup = ref(null);
const approvePopup = ref(null);
const errorPopup = ref(null);
const getUser = JSON.parse(localStorage.getItem('user'))
const user = `${getUser.first_name} ${getUser.last_name}`
const formData = ref({})
const route = useRoute();
const note = ref()
const firstSection = ref({
    installChecked: false,
    sendChecked: false,
    onlineChecked: false,
    otherChecked: false,
    otherText: "",
});

const secondSection = ref({
    posChecked: false,
    monitor1Checked: false,
    monitor2Checked: false,
    receiptPrinterChecked: false,
    labelPrinterChecked: false,
    kitchenPrinterChecked: false,
    otherChecked: false,
    otherText: "",
});

const thirdSection = ref({
    kioskChecked: false,
    queueChecked: false,
    crmChecked: false,
    eMenuChecked: false,
    warehouseChecked: false,
    otherChecked: false,
    otherText: "",
});

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
      };
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

fetchData();
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