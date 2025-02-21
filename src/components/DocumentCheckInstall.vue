<template>
    <main>
        <div class="container">
            <form @submit.prevent="submitForm">
                <div class="form-row">
                    <label>สถานะการติดตั้ง</label>
                    <input v-model="formData.install_status" type="text" disabled class="disable-form" />
                </div>
            </form>
        </div>
        <div class="container">
            <form @submit.prevent="submitForm">
                <div class="form-row">
                    <label>บริษัท</label>
                    <input v-model="formData.company_name" type="text" disabled class="disable-form" />
                </div>
                <div class="form-row">
                    <label>สาขา</label>
                    <input v-model="formData.branch_name" type="text" disabled class="disable-form" />
                </div>
                <div class="form-row">
                    <label>วันที่ติดตั้ง</label>
                    <input type="date" v-model="formData.install_date" @change="updateDeliverySheet('install_date',formData.install_date)" />
                </div>
            </form>
        </div>
        <DocumentCheckBox />
        <div class="documents-section">
            <h2>เอกสารประกอบการติดตั้ง</h2>
            <div class="document-item">
                <div class="document-header">
                    <span>1. ใบรายงานติดตั้ง (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                        <button class="btn btn-upload" @click="fileInputInstallPDF.click()">อัปโหลด</button>
                        <input type="file" ref="fileInputInstallPDF" accept="application/pdf" @change="handleFileChange('ใบรายงานติดตั้ง', $event)" hidden/>
                        <button class="btn btn-save" @click="saveFilesToDirectus('install')">บันทึก</button>
                    </div>
                </div>
                <div v-if="uploadedFilesInstallPDF.length > 0">
                    <h4>ไฟล์ที่อัปโหลด</h4>
                    <ul>
                        <li v-for="(file, index) in uploadedFilesInstallPDF" :key="index">
                            <a :href="getFileUrl(file)" target="_blank" class="file-link">
                                {{ file.name }}
                            </a>
                            <button class="delete-file" @click="deleteFileForm(index , 'install' , file)">X</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="document-item">
                <div class="document-header">
                    <span>2. ใบ Checklist (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                    <button class="btn btn-upload" @click="fileInputCheckListPDF.click()">อัปโหลด</button>
                    <input type="file" ref="fileInputCheckListPDF" accept="application/pdf" @change="handleFileChange('ใบ CheckList', $event)" hidden multiple />
                    <button class="btn btn-save" @click="saveFilesToDirectus('checklist')">บันทึก</button>
                    </div>
                </div>
                <div v-if="uploadedFilesCheckListPDF.length > 0">
                    <h4>ไฟล์ที่อัปโหลด</h4>
                    <ul>
                    <li v-for="(file, index) in uploadedFilesCheckListPDF" :key="index">
                        <a :href="getFileUrl(file)" target="_blank" class="file-link">
                            {{ file.name }}
                        </a>
                        <button class="delete-file" @click="deleteFileForm(index , 'checklist' , file)">X</button>
                    </li>
                    </ul>
                </div>
            </div>
            <div class="document-item">
                <div class="document-header">
                    <span>3. รูปภาพการติดตั้งสินค้า (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                        <button class="btn btn-upload" @click="fileInputProductInstallImages.click()">อัปโหลด</button>
                        <input type="file" ref="fileInputProductInstallImages" accept="image/png, image/gif, image/jpeg" @change="handleFileChange('install_image', $event)" hidden multiple/>
                        <button class="btn btn-save" @click="saveFilesToDirectus('install_image')">บันทึก</button>
                    </div>
                </div>
                <div v-if="uploadedFilesProductInstallImages.length > 0">
                    <h4>ไฟล์ที่อัปโหลด</h4>
                    <ul>
                        <li v-for="(file, index) in uploadedFilesProductInstallImages" :key="index">
                            <a :href="getFileUrl(file)" target="_blank" class="file-link">
                                {{ file.name }}
                            </a>
                            <button class="delete-file" @click="deleteFileForm(index , 'install_image' , file)">X</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="form-actions">
            <label style="padding-right: 8px;">พนักงานติดตั้ง</label>
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
import { readItems, uploadFiles , updateItem , deleteFile} from "@directus/sdk";
import { useRoute } from "vue-router";
import { parse } from 'date-fns';
import DocumentCheckBox from './DocumentCheckBox.vue';
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
const fileInputInstallPDF = ref(null);
const fileInputCheckListPDF = ref(null);
const fileInputProductInstallImages = ref(null);
const uploadedFilesInstallPDF = ref([]);
const uploadedFilesCheckListPDF = ref([]);
const uploadedFilesProductInstallImages = ref([]);

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
            install_date: formatDate(data.install_date) || "",
        };

        uploadedFilesInstallPDF.value = data.install_report_pdf && data.install_report_pdf.id
            ? [{ id: data.install_report_pdf.id, name: data.install_report_pdf.filename_download }]
            : [];
        
        uploadedFilesCheckListPDF.value = data.checklist_pdf && Array.isArray(data.checklist_pdf)
            ? data.checklist_pdf
                .filter(file => file.directus_files_id && file.directus_files_id.id)
                .map(file => ({
                    id: file.directus_files_id.id,
                    name: file.directus_files_id.filename_download
                }))
            : [];
        
        uploadedFilesProductInstallImages.value = Array.isArray(data.product_install_images)
            ? data.product_install_images
                .filter(file => file && file.directus_files_id)
                .map(file => ({
                id: file.directus_files_id.id,
                name: file.directus_files_id.filename_download
                }))
            : [];
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

fetchData();

const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

const updateDeliverySheet = async (field, value) => {
    try {
        const payload = { [field]: value };
        await directus.request(updateItem("delivery_sheet", route.params.id, payload));
    } catch (error) {
        console.error(`Error updating ${field} in delivery_sheet:`, error);
    }
};

const getFileUrl = (file) => {
    if (file instanceof File) {
        return URL.createObjectURL(file);
    }
    return `http://localhost:8055/assets/${file.id}`; 
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
    
    if (filename === 'ใบรายงานติดตั้ง') {
        uploadedFilesInstallPDF.value.push(selectedFiles[0]);
    } else if (filename === 'ใบ CheckList') {
        if (!uploadedFilesProductInstallImages.value) {
            uploadedFilesCheckListPDF.value = [];
        }
        uploadedFilesCheckListPDF.value.push(selectedFiles[index]);
    } else if (filename === 'install_image') {
        if (!uploadedFilesProductInstallImages.value) {
            uploadedFilesProductInstallImages.value = [];
        }
        uploadedFilesProductInstallImages.value.push(selectedFiles[index]);
    }
  }
};

const deleteFileForm = async (index, type , file) => {
    let fileToDelete = file;
    if (!fileToDelete || !fileToDelete.id) {
        console.error("File ID is missing.");
        if (type === 'install') {
            uploadedFilesInstallPDF.value.splice(index, 1);
        } else if (type === 'checklist') {
            uploadedFilesCheckListPDF.value.splice(index, 1);
        } else if (type === 'install_image') {
            uploadedFilesProductInstallImages.value.splice(index, 1);
        }
        return;
    }

    try {
        const confirmDeleteResult = await warningPopup.value.confirmDelete();
        if (!confirmDeleteResult.isConfirmed) return;
        await directus.request(deleteFile(fileToDelete.id));
        if (type === 'install') {
            uploadedFilesInstallPDF.value.splice(index, 1);
        } else if (type === 'checklist') {
            uploadedFilesCheckListPDF.value.splice(index, 1);
        } else if (type === 'install_image') {
            uploadedFilesProductInstallImages.value.splice(index, 1);
        }
        approvePopup.value.showSuccessUpload("ลบไฟล์สำเร็จ!");
    } catch (error) {
        console.error("Error deleting file:", error);
        errorPopup.value.showErrorUpload("เกิดข้อผิดพลาดในการลบไฟล์");
    }
};

const saveFilesToDirectus = async (type) => {
    let uploadedFiles;
    let fieldKey;

    if (type === 'install') {
        uploadedFiles = uploadedFilesInstallPDF.value;
        fieldKey = 'install_report_pdf';
    } else if (type === 'checklist') {
        uploadedFiles = uploadedFilesCheckListPDF.value;
        fieldKey = 'checklist_pdf';
    } else if (type === 'install_image') {
        uploadedFiles = uploadedFilesProductInstallImages.value;
        fieldKey = 'product_install_images';
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
        type === 'install'
        ? 'ใบรายงานติดตั้ง'
        : type === 'checklist'
        ? 'ใบ CheckList'
        : type === 'delivery_image'
        ? 'รูปภาพการจัดส่งสินค้า'
        : 'ไม่ระบุประเภทไฟล์'
    );

    if (type === 'install') {
        uploadedFilesInstallPDF.value = [];
    } else if (type === 'checklist') {
        uploadedFilesCheckListPDF.value = [];
    } else if (type === 'install_image') {
        uploadedFilesProductInstallImages.value = [];
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    errorPopup.value.showErrorUpload(
        type === 'install'
        ? 'ใบรายงานติดตั้ง'
        : type === 'checklist'
        ? 'ใบ CheckList'
        : type === 'delivery_image'
        ? 'รูปภาพการจัดส่งสินค้า'
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