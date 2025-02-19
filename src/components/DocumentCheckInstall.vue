<template>
    <main>
        <div class="container">
            <form @submit.prevent="submitForm">
                <div class="form-row">
                    <label>สถานะการติดตั้ง</label>
                    <input v-model="formData.status" type="text" disabled class="disable-form" />
                </div>
            </form>
        </div>
        <div class="documents-section">
            <h2>เอกสารประกอบการติดตั้ง</h2>
            <div class="document-item">
                <div class="document-header">
                    <span>1. ใบจัดส่งสินค้า (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                        <button class="btn btn-upload" @click="fileInputShippingPDF.click()">อัปโหลด</button>
                        <input type="file" ref="fileInputShippingPDF" accept="application/pdf" @change="uploadFile('ใบจัดส่งสินค้า', $event)" hidden />
                        <button class="btn btn-print" @click="handlePrint('ใบจัดส่งสินค้า',doc)">
                            พิมพ์
                        </button>
                    </div>
                </div>
            </div>
            <div class="document-item">
                <div class="document-header">
                    <span>2. ใบรายงานติดตั้ง (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                        <button class="btn btn-upload" @click="fileInputInstallPDF.click()">อัปโหลด</button>
                        <input type="file" ref="fileInputInstallPDF" accept="application/pdf" @change="uploadFile('ใบรายงานติดตั้ง', $event)" hidden />
                        <button class="btn btn-print" @click="handlePrint('ใบรายงานติดตั้ง',doc)">
                            พิมพ์
                        </button>
                    </div>
                </div>
            </div>
            <div class="document-item">
                <div class="document-header">
                    <span>3. ใบ CheckList (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                        <button class="btn btn-upload" @click="fileInputCheckListPDF.click()">อัปโหลด</button>
                        <input type="file" ref="fileInputCheckListPDF" accept="application/pdf" @change="uploadFile('ใบ CheckList', $event)" hidden multiple />
                        <button class="btn btn-print" @click="handlePrint(doc)">
                            พิมพ์
                        </button>
                    </div>
                </div>
            </div>
            <div class="document-item">
                <div class="document-header">
                    <span>4. รูปภาพการจัดส่งสินค้า (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                        <button class="btn btn-upload">
                            อัปโหลด
                        </button>
                        <button class="btn btn-print" @click="handlePrint(doc)">
                            พิมพ์
                        </button>
                    </div>
                </div>
            </div>
            <div class="document-item">
                <div class="document-header">
                    <span>5. รูปภาพการติดตั้งสินค้า (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                        <button class="btn btn-upload">
                            อัปโหลด
                        </button>
                        <button class="btn btn-print" @click="handlePrint(doc)">
                            พิมพ์
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-actions">
            <label style="padding-right: 8px;">ผู้ติดตั้ง</label>
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
const router = useRouter();
const fileInputShippingPDF = ref(null);
const fileInputInstallPDF = ref(null);
const fileInputCheckListPDF = ref(null);

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
        status: data.status || "",
        shipping_pdf: data.shipping_pdf.id || ""
      };
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

fetchData();

const handlePrint = async (filename, doc) => {
    try {
        const response = await directus.request(readFile(formData.value.shipping_pdf));
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
            alert("ไม่สามารถพิมพ์เอกสารได้");
        }
    } catch (error) {
        console.error("Error fetching or printing file:", error);
        alert("ไม่สามารถพิมพ์เอกสารได้");
    }
};

const processFiles = (files) => {
    return files.map(file => ({
        directus_files_id: {
            id: file.id
        }
    }));
};

const uploadFile = async (filename, event) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    try {
        const formData = new FormData();
        for (let index = 0; index < selectedFiles.length; index++) {
            if (selectedFiles[index].type !== "application/pdf") {
                alert("กรุณาเลือกไฟล์ PDF เท่านั้น");
                return;
            }
            const selectedFile = selectedFiles[index];
            // const newFileName = `${filename}_${new Date().toISOString().slice(0, 10)}_${index + 1}.pdf`;
            // const renamedFile = new File([selectedFile], newFileName, { type: selectedFile.type });
            formData.append("file", selectedFile);
        }
        const fileResponse = await directus.request(uploadFiles(formData));
        if (typeof fileResponse === 'object' && fileResponse !== null && fileResponse.length > 1) {
            const ids = processFiles(fileResponse);
            await directus.request(
                updateItem('delivery_sheet', route.params.id, {
                    checklist_pdf: ids
                })
            );
        }else{
            const fileId = fileResponse.id;
            const fieldMapping = {
                'ใบรายงานติดตั้ง': 'install_report_pdf',
                'ใบจัดส่งสินค้า': 'shipping_pdf',
                'ใบ CheckList': 'checklist_pdf',
            };
            const fieldToUpdate = fieldMapping[filename] || 'default_field';
            await directus.request(
                updateItem('delivery_sheet', route.params.id, {
                    [fieldToUpdate]: fileId
                })
            );
        }
        fetchData()

        approvePopup.value.showSuccessUpload(filename)
        fileInputShippingPDF.value.value = "";
        fileInputInstallPDF.value.value = "";
        fileInputCheckListPDF.value.value = "";
    } catch (error) {
        console.error("Error uploading file:", error);
        errorPopup.value.showErrorUpload(filename)
    }
};
</script>

<style scoped>
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