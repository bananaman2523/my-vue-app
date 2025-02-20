<template>
    <main>
        <div class="container">
            <form @submit.prevent="submitForm">
                <div class="form-row">
                    <label>สถานะการจัดส่ง</label>
                    <input v-model="formData.delivery_status" type="text" disabled class="disable-form" />
                </div>
            </form>
        </div>
        <div class="documents-section">
            <h2>เอกสารประกอบการจัดส่ง</h2>
            <div class="document-item">
                <div class="document-header">
                    <span>1. ใบจัดส่งสินค้า (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                        <button class="btn btn-upload" @click="fileInputShippingPDF.click()">อัปโหลด</button>
                        <input type="file" ref="fileInputShippingPDF" accept="application/pdf" @change="handleFileChange('ใบจัดส่งสินค้า', $event)" hidden/>
                        <button class="btn btn-save" @click="saveFilesToDirectus('shipping')">บันทึก</button>
                        <button class="btn btn-print" @click="handlePrint('ใบจัดส่งสินค้า',doc)">
                            ดูไฟล์
                        </button>
                    </div>
                </div>
                <div v-if="uploadedFilesShippingPDF.length > 0">
                    <h4>ไฟล์ที่อัปโหลด</h4>
                    <ul>
                        <li v-for="(file, index) in uploadedFilesShippingPDF" :key="index">
                            <a :href="getFileUrl(file)" target="_blank" class="file-link">
                                {{ file.name }}
                            </a>
                            <button class="delete-file" @click="deleteFile(index , 'shipping')">X</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="document-item">
                <div class="document-header">
                    <span>2. รูปภาพการจัดส่งสินค้า (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                        <button class="btn btn-upload" @click="fileInputProductDeliveryImages.click()">อัปโหลด</button>
                        <input type="file" ref="fileInputProductDeliveryImages" accept="image/png, image/gif, image/jpeg" @change="handleFileChange('delivery_image', $event)" hidden multiple/>
                        <button class="btn btn-save" @click="saveFilesToDirectus('delivery_image')">บันทึก</button>
                        <button class="btn btn-print" @click="handlePrint(doc)">
                            ดูไฟล์
                        </button>
                    </div>
                </div>
                <div v-if="uploadedFilesProductDeliveryImages.length > 0">
                    <h4>ไฟล์ที่อัปโหลด</h4>
                    <ul>
                        <li v-for="(file, index) in uploadedFilesProductDeliveryImages" :key="index">
                            <a :href="getFileUrl(file)" target="_blank" class="file-link">
                                {{ file.name }}
                            </a>
                            <button class="delete-file" @click="deleteFile(index, 'delivery_image')">X</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="form-actions">
            <label style="padding-right: 8px;">พนักงานจัดส่ง</label>
            <input v-model="user" type="text" disabled class="disable-form-user" />
        </div>
    </main>
    <WarningPopup ref="warningPopup" />
    <ApprovePopup ref="approvePopup" />
    <ErrorPopup ref="errorPopup" />
</template>

<script setup>
import { ref } from 'vue';
import { directus } from "@/services/directus";
import { readItems, uploadFiles , updateItem , readFile} from "@directus/sdk";
import { useRoute } from "vue-router";
import ApprovePopup from "@/components/popup/ApprovePopup.vue";
import ErrorPopup from "@/components/popup/ErrorPopup.vue";
import WarningPopup from "@/components/popup/WarningPopup.vue";
const warningPopup = ref(null);
const approvePopup = ref(null);
const errorPopup = ref(null);
const getUser = JSON.parse(localStorage.getItem('user'))
const user = `${getUser.first_name} ${getUser.last_name}`
const formData = ref({});
const route = useRoute();
const fileInputShippingPDF = ref(null);
const fileInputProductDeliveryImages = ref(null);
const uploadedFilesShippingPDF = ref([]);
const uploadedFilesProductDeliveryImages = ref([]);

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
        delivery_status: data.delivery_status || "",
      };
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

fetchData();

const getFileUrl = (file) => {
    if (file instanceof File) {
        return URL.createObjectURL(file);
    }
    return `http://localhost:8055/assets/${file.id}`; 
};

const handlePrint = async (filename, doc) => {
    try {
        const fieldMapping = {
            'ใบรายงานติดตั้ง': 'install_report_pdf',
            'ใบจัดส่งสินค้า': 'shipping_pdf',
        };
        const fieldToUpdate = fieldMapping[filename] || 'default_field';
        
        const response = await directus.request(readFile(formData.value[fieldToUpdate]));
        if (response) {
            const fileUrl = `http://localhost:8055/assets/${response.filename_disk}`;

            const printWindow = window.open();
            const iframe = printWindow.document.createElement('iframe');
            iframe.src = fileUrl;
            iframe.width = "100%";
            iframe.height = "100%";
            printWindow.document.body.appendChild(iframe);

            iframe.onload = () => {
                printWindow.focus();
                printWindow.document.close();
            };
        } else {
            console.error("No file URL returned from Directus");
            errorPopup.value.showErrorOpenPDF('ไม่สามารถดูเอกสารได้')
        }
    } catch (error) {
        console.error("Error fetching or printing file:", error);
        errorPopup.value.showErrorOpenPDF('ไม่สามารถดูเอกสารได้')
    }
};

const processFiles = (files) => {
    return files.map(file => ({
        directus_files_id: {
            id: file.id
        }
    }));
};

const handleFileChange = (filename, event) => {
  const selectedFiles = event.target.files;
  if (!selectedFiles || selectedFiles.length === 0) return;

  for (let index = 0; index < selectedFiles.length; index++) {

    if (filename === 'ใบจัดส่งสินค้า') {
        uploadedFilesShippingPDF.value = [selectedFiles[0]];
    } else if (filename === 'delivery_image') {
        if (!uploadedFilesProductDeliveryImages.value) {
            uploadedFilesProductDeliveryImages.value = [];
        }
        uploadedFilesProductDeliveryImages.value.push(selectedFiles[index]);
    }
  }
};

const deleteFile = (index, type) => {
  if (type === 'shipping') {
    uploadedFilesShippingPDF.value.splice(index, 1);
  } else if (type === 'delivery_image') {
    uploadedFilesProductDeliveryImages.value.splice(index, 1);
  }
};

const saveFilesToDirectus = async (type) => {
  let uploadedFiles;
  let fieldKey;

  if (type === 'shipping') {
    uploadedFiles = uploadedFilesShippingPDF.value;
    fieldKey = 'shipping_pdf';
  } else if (type === 'delivery_image') {
    uploadedFiles = uploadedFilesProductDeliveryImages.value;
    fieldKey = 'product_delivery_images';
  }

  if (!uploadedFiles || uploadedFiles.length === 0) {
    errorPopup.value.showErrorUpload('กรุณาอัปโหลดไฟล์');
    return;
  }

  try {
    const formData = new FormData();
    uploadedFiles.forEach(file => {
      formData.append("file", file);
    });

    const fileResponse = await directus.request(uploadFiles(formData));

    if (Array.isArray(fileResponse) && fileResponse.length > 1) {
      const ids = processFiles(fileResponse);
      await directus.request(
        updateItem('delivery_sheet', route.params.id, {
          [fieldKey]: ids
        })
      );
    } else {
      await directus.request(
        updateItem('delivery_sheet', route.params.id, {
          [fieldKey]: fileResponse.id
        })
      );
    }

    fetchData();
    approvePopup.value.showSuccessUpload(
        type === 'shipping'
        ? 'ใบจัดส่งสินค้า'
        : type === 'install_image'
        ? 'รูปภาพการติดตั้งสินค้า'
        : 'ไม่ระบุประเภทไฟล์'
    );

    if (type === 'shipping') {
        uploadedFilesShippingPDF.value = [];
    } else if (type === 'delivery_image') {
        uploadedFilesProductDeliveryImages.value = [];
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    errorPopup.value.showErrorUpload(
        type === 'shipping'
        ? 'ใบจัดส่งสินค้า'
        : type === 'install_image'
        ? 'รูปภาพการติดตั้งสินค้า'
        : 'ไม่ระบุประเภทไฟล์'
    );
  }
};
</script>

<style scoped>
.delete-file {
    background-color: transparent;
    border: none;
    color: red;
    font-size: 16px;
    cursor: pointer;
}

.delete-file:hover {
    color: darkred;
}

.activity {
    display: flex;
    margin-left: auto;
}
.document-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.documents-section {
    font-family: "Prompt", sans-serif;
    border-radius: 8px;
    margin: 20px;
}
.document-item {
    background-color: #fff;
    padding: 20px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.btn {
    padding: 10px 15px;
    font-size: 0.9rem;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 8px;
}
.btn-print {
    background-color: #003566;
    color: #fff;
}
.btn-print:hover {
    background-color: #003d80;
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
    /* min-height: 100vh; */
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