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
        <div class="documents-section">
            <h2>รายการอุปกรณ์ติดตั้งไปยังบริษัท/ร้าน</h2>
            <div v-for="(item, index) in formData.stock" :key="index">
                <form>
                    <div class="form-row">
                        <label>รหัสสินค้าของ Office Design</label>
                        <input type="text" v-model="item.id" disabled/>
                    </div>
                    <div class="form-row">
                        <label>รหัสสินค้าของ Office Design</label>
                        <input type="text" v-model="item.product_code_office_design" disabled/>
                    </div>
                    <div class="form-row">
                        <label>ชื่อสินค้าของ Office Design</label>
                        <input type="text" v-model="item.product_name_office_design" disabled/>
                    </div>
                    <div class="form-row">
                        <label>อุปกรณ์</label>
                        <input type="text" v-model="item.group_product" disabled/>
                    </div>
                    <div class="form-row">
                        <label>รุ่น/แบรนด์</label>
                        <input type="text" v-model="item.model" disabled/>
                    </div>
                    <div class="form-row">
                        <label>Serial Number</label> 
                        <input type="text" v-model="item.serial_number" disabled/>
                    </div>
                    <div class="form-row">
                        <label>คุณภาพสินค้า</label>
                        <select v-model="item.status" :disabled="formData.status === 'ผ่าน'">
                            <option disabled>ระบุ</option>
                            <option>ผ่าน</option>
                            <option>ชำรุด</option>
                            <option>ไม่ได้ใช้</option>
                        </select>
                    </div>
                </form>
                <form>
                    <div v-if="item.status === 'ชำรุด'" style="display: contents;">
                        <div class="form-row">
                            <label>ชื่อสินค้าของ Office Design</label>
                            <select v-model="item.productName" @change="updateProduct(index)">
                                <option value="">Select a category</option>
                                <option v-for="productName in filteredProducts" :key="productName.product_name" :value="productName.product_name">
                                {{ productName.product_name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-row">
                            <label>รหัสสินค้าของ Office Design</label>
                            <input v-model="item.productCode" type="text" disabled class="disable-form"/>
                        </div>
                        <div class="form-row">
                            <label>อุปกรณ์</label>
                            <input v-model="item.productModel" type="text" disabled class="disable-form"/>
                        </div>
                        <div class="form-row">
                            <label>รุ่น/แบรนด์</label>
                            <input v-model="item.productBrand" type="text" disabled class="disable-form"/>
                        </div>
                        <div class="form-row">
                            <label>Serial Number</label>
                            <input v-model="item.serialNumber" @change="cheakSerialNumberInStock(item.serialNumber, item)" type="text" :disabled="!item.productCode" :class="!item.productCode ? 'disable-form' : ''"/>
                        </div>
                        <br>
                        <div class="form-row">
                            <label>ประเภทชำรุด</label>
                            <select v-model="item.brokenCategory" :disabled="!item.serialNumber" :class="!item.serialNumber ? 'disable-form' : ''">
                                <option>ระบุ</option>
                                <option>software</option>
                                <option>hardware</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <label>รายละเอียด</label>
                            <input v-model="item.brokenDescription" type="text" style="width: 320px;" :disabled="!item.serialNumber" :class="!item.serialNumber ? 'disable-form' : ''"/>
                        </div>
                        <div style="display: flex; align-items: flex-end;">
                            <button type="button" @click="switchEquipment(item)">สับเปลี่ยน</button>
                        </div>
                    </div>
                </form>
                <div v-if="item.status !== 'ชำรุด'" style="display: contents;">
                    <div style="text-align: right;margin-top: 8px;">
                        <button type="button">บันทึก</button>
                    </div>
                </div>
            </div>
        </div>
        <DocumentCheckBox />
        <div class="documents-section">
            <h2>เอกสารประกอบการติดตั้ง</h2>
            <div class="document-item">
                <div class="document-header">
                    <span>1. ใบรายงานติดตั้ง (กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร)</span>
                    <div class="activity">
                        <button class="btn btn-upload" @click="fileInputInstallPDF.click()">อัปโหลด</button>
                        <input type="file" ref="fileInputInstallPDF" @change="handleFileChange('ใบรายงานติดตั้ง', $event)" hidden multiple/>
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
                    <input type="file" ref="fileInputCheckListPDF" @change="handleFileChange('ใบ CheckList', $event)" hidden multiple />
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
                        <input type="file" ref="fileInputProductInstallImages" @change="handleFileChange('install_image', $event)" hidden multiple/>
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
import { ref , computed} from 'vue';
import { directus } from "@/services/directus";
import { readItems, uploadFiles , updateItem , deleteFile} from "@directus/sdk";
import { useRoute } from "vue-router";
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
    const config = await directus.request(
      readItems("config", {
        fields: [
          "product_code"
        ],
      })
    );
    productConfig.value = config[0].product_code
    
    if (delivery_sheet.length > 0) {
        const data = delivery_sheet[0];
        formData.value = {
            install_status: data.install_status || "",
            company_name: data.packing_sheet[0].company_name || "",
            branch_name: data.packing_sheet[0].branch_name || "",
            install_date: formatDate(data.install_date) || "",
            stock: data.packing_sheet[0].stock || [],
            packing_sheet_id: data.packing_sheet[0].id || "",
        };
        console.log(formData.value);
        
        uploadedFilesInstallPDF.value = data.install_report_pdf && Array.isArray(data.install_report_pdf)
            ? data.install_report_pdf
                .filter(file => file.directus_files_id && file.directus_files_id.id)
                .map(file => ({
                    id: file.directus_files_id.id,
                    name: file.directus_files_id.filename_download
                }))
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

        if (uploadedFilesInstallPDF.value.length > 0 && uploadedFilesCheckListPDF.value.length > 0 && uploadedFilesProductInstallImages.value.length > 0) {
            await directus.request(
                updateItem('delivery_sheet', route.params.id, {
                    install_status: 'ติดตั้งเสร็จสิ้น'
                })
            );
        } else {
            await directus.request(
                updateItem('delivery_sheet', route.params.id, {
                    install_status: 'รอการติดตั้ง'
                })
            );
        }
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
        if (!uploadedFilesInstallPDF.value) {
            uploadedFilesInstallPDF.value = [];
        }
        uploadedFilesInstallPDF.value.push(selectedFiles[index]);
    } else if (filename === 'ใบ CheckList') {
        if (!uploadedFilesCheckListPDF.value) {
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

    if (type === 'install' || type === 'checklist' || type === 'install_image') {
        const formattedResponse = Array.isArray(fileResponse) ? fileResponse : Object.keys(fileResponse).length === 0 ? [{}] : [fileResponse];
        const ids = processFiles(formattedResponse);
        const currentData = await directus.request(
            readItems('delivery_sheet', {
            fields: [fieldKey],
            filter: {
                id: { _eq: route.params.id },
            },
            })
        );
        const existingFiles = currentData[0][fieldKey] || [];
        let updatedFiles;
        if(Array.isArray(existingFiles)){
            updatedFiles = [...existingFiles, ...ids]
        }else if(existingFiles !== null && typeof existingFiles === 'object'){
            updatedFiles = [existingFiles, ...ids]
        } else {
            updatedFiles = ids;
        }
        await directus.request(
                updateItem('delivery_sheet', route.params.id, {
                [fieldKey]: updatedFiles
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

const form = ref({
  customerName: '',
  companyName: '',
  branchName: '',
  branchCode: '',
  quotationNumber: '',
  customerOrderNumber: '',
  preparedDate: '',
  deliveryDate: '',
  items: [
    { productCode: '', productName: '', selectedCategory: '', selectedModel: '', serialNumber: '' }
  ]
});
const productConfig = ref({ product: [] });

const filteredProducts = computed(() => {
  const index = 0;
  const text = formData.value.stock[index].product_name_office_design;
  const textBeforeHash = text.split('#')[0];

  return productConfig.value.filter(product => product.product_name.includes(textBeforeHash));
});

const updateProduct = (index) => {
  const formItem = formData.value.stock[index];
  const selectedProduct = productConfig.value.find(
    (product) => product.product_name === formItem.productName
  );

  if (selectedProduct) {
    formItem.productCode = selectedProduct.product_code || '';
    formItem.productModel = selectedProduct.equipment.model || '';
    formItem.productBrand = selectedProduct.equipment.brand || '';
  }else{
    formItem.productCode = '';
    formItem.productModel = '';
    formItem.productBrand = '';
  }
};

async function cheakSerialNumberInStock(serialNumber, formItem) {
  try {
    if (serialNumber) {
      const isDuplicateInForm = form.value.items.some(
        (item) => item !== formItem && item.serialNumber === serialNumber
      );

      if (isDuplicateInForm) {
        warningPopup.value.showWarningDuplicate();
        formItem.serialNumber = "";
        return;
      }

      const checks = await directus.request(
        readItems("stock", {
          filter: {
            serial_number: {
              _eq: serialNumber,
            },
            model: {
              _eq: formItem.productBrand,
            },
            group_product: {
              _eq: formItem.productModel,
            },
            product_name_office_design: {
              _eq: formItem.productName,
            },
            product_code_office_design: {
              _eq: formItem.productCode,
            },
          },
        })
      );

      const checksStatus = checks[0]

      if (checks.length != 0) {
        if (checksStatus.status === 'ชำรุด') {
          warningPopup.value.showWarningBroken();
          formItem.serialNumber = "";
        } else if (checksStatus.stock_id !== null) {
          warningPopup.value.showWarningAlreadyUse();
          formItem.serialNumber = "";
        }  else if (checksStatus.device_status === 'เครื่องสำรอง') {
          warningPopup.value.showWarningBackupDevice();
          formItem.serialNumber = "";
        }
        
        if (Array.isArray(checks) && checks.length == 0) {
          warningPopup.value.showWarning();
          formItem.serialNumber = "";
        }  
      }else{
        warningPopup.value.showWarning();
        formItem.serialNumber = "";
      }
      
      
    }
    
  } catch (error) {
    console.error("Error generating preparation number:", error);
  }
  
}

async function switchEquipment(item) {
  try {
    const packingID = formData.value.packing_sheet_id   ;
    console.log(packingID);
    
    const [packing_sheet] = await directus.request(
      readItems("packing_sheet", {
        fields: ["stock"],
        filter: {
          id: {
            _eq: packingID
          }
        }
      })
    );

    const newStockItem = await directus.request(
      readItems("stock", {
        fields: ["id"],
        filter: {
          serial_number: { _eq: item.serialNumber }
        }
      })
    );
    

    if (newStockItem.length === 0) {
      throw new Error("Stock item not found with the given serial number.");
    }

    let selectValue = item.id;
    
    let newValue = newStockItem[0].id;
    
    let updatedArr = packing_sheet.stock.map(num => num === selectValue ? newValue : num);
    
    await directus.request(
      updateItem('stock', item.id, { 
        status: 'ชำรุด',
        broken_description: item.brokenDescription,
        broken_category: item.brokenCategory,
      })
    );

    await directus.request(
      updateItem('packing_sheet', packingID, { stock: updatedArr })
    );

    await directus.request(
      updateItem('stock', newStockItem[0].id, { status: 'ผ่าน' })
    );

    window.location.reload();
  } catch (error) {
    console.error("Error updating equipment:", error);
  }
}
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
    /* max-width: 1440px; */
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