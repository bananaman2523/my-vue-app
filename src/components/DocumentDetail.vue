<template>
    <div class="documents-section">
        <h2>เอกสารประกอบการส่งซ่อม</h2>
        <div class="document-item">
            <div class="document-header">

                <span>1. เอกสารรับ-ส่ง เครื่องจากลูกค้า</span>
                <button class="btn btn-print" @click="handlePrint(doc)">
                    พิมพ์
                </button>
            </div>
            <div class="description-actions-wrapper">
                <p class="description" v-if="dataDeviceTransfer.device_transfer_file_2 == null">
                    {{ dataDeviceTransfer.document_number != null ? 'รอตรวจสอบการลงนามของเอกสาร' :
                        'กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร' }}
                    <span class="warning-text">
                        {{ dataDeviceTransfer.document_number == null ? '(ยังไม่มีรายละเอียด)' :
                            (dataDeviceTransfer.device_transfer_file_1 == null ? '(รอดำเนินการลงนามรอบแรก)' :
                                '(รอดำเนินการลงนามรอบสุดท้าย)') }}
                    </span>
                </p>
                <div class="document-actions" v-if="dataDeviceTransfer.device_transfer_file_2 == null">
                    <button class="btn btn-download">
                        อัปโหลด
                    </button>
                    <button v-if="dataDeviceTransfer.document_number == null" class="btn btn-add-info">
                        เพิ่มข้อมูล
                    </button>
                </div>
            </div>
        </div>

        <div class="document-item">

            <div class="document-header">

                <span>2. เอกสารเปลี่ยน/ซ่อม/ส่งคืนเครื่อง</span>
                <button class="btn btn-print" @click="handlePrint(doc)">
                    พิมพ์
                </button>
            </div>
            <div class="description-actions-wrapper">
                <p class="description" v-if="dataDeviceTransfer.device_transfer_file_2 == null">
                    {{ dataDeviceTransfer.document_number != null ? 'รอตรวจสอบการลงนามของเอกสาร' :
                        'กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร' }}
                    <span class="warning-text">
                        {{ dataDeviceTransfer.document_number == null ? '(ยังไม่มีรายละเอียด)' :
                            (dataDeviceTransfer.device_transfer_file_1 == null ? '(รอดำเนินการลงนามรอบแรก)' :
                                '(รอดำเนินการลงนามรอบสุดท้าย)') }}
                    </span>
                </p>
                <div class="document-actions" v-if="dataDeviceTransfer.device_transfer_file_2 == null">
                    <button class="btn btn-download">
                        อัปโหลด
                    </button>
                    <button v-if="dataDeviceTransfer.document_number == null" class="btn btn-add-info">
                        เพิ่มข้อมูล
                    </button>
                </div>
            </div>
        </div>

        <div class="document-item">

            <div class="document-header">

                <span>3. เอกสารสำหรับจัดส่งสินค้าคืนลูกค้า</span>
                <button class="btn btn-print" @click="handlePrint(doc)">
                    พิมพ์
                </button>
            </div>
            <div class="description-actions-wrapper">
                <p class="description" v-if="dataDeviceTransfer.device_transfer_file_2 == null">
                    {{ dataDeviceTransfer.document_number != null ? 'รอตรวจสอบการลงนามของเอกสาร' :
                        'กรุณากรอกรายละเอียดเพื่อจัดทำเอกสาร' }}
                    <span class="warning-text">
                        {{ dataDeviceTransfer.document_number == null ? '(ยังไม่มีรายละเอียด)' :
                            (dataDeviceTransfer.device_transfer_file_1 == null ? '(รอดำเนินการลงนามรอบแรก)' :
                                '(รอดำเนินการลงนามรอบสุดท้าย)') }}
                    </span>
                </p>
                <div class="document-actions" v-if="dataDeviceTransfer.device_transfer_file_2 == null">
                    <button class="btn btn-download">
                        อัปโหลด
                    </button>
                    <button v-if="dataDeviceTransfer.document_number == null" class="btn btn-add-info">
                        เพิ่มข้อมูล
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from "vue";
import { directus } from "@/services/directus";
import { readFile, readItems } from "@directus/sdk";
import { useRoute } from "vue-router";

const route = useRoute();
const itemId = route.params.id;
const dataDeviceTransfer = ref([]);
const dataProductRequest = ref([]);
const dataExchange = ref([]);

const fetchData = async () => {
    try {
        const response = await directus.request(
            readItems("device_transfer_details", {
                filter: {
                    id: { _eq: itemId },
                },
                fields: ["document_number", "device_transfer_file_draft", "device_transfer_file_1", "device_transfer_file_2", "useDoc"],
            })
        );

        if (response.length) {
            dataDeviceTransfer.value = response[0];
        }
    } catch (error) {
        console.error("Error fetching activities:", error);
    }
};

const fetchDataProductRequest = async () => {
    try {
        const response = await directus.request(
            readItems("product_request_details", {
                filter: {
                    id: { _eq: itemId },
                },
                fields: ["document_number", "have_data"],
            })
        );

        if (response.length) {
            dataProductRequest.value = response[0];
            console.log(dataProductRequest.value);
        }
    } catch (error) {
        console.error("Error fetching activities:", error);
    }
};

fetchData();
fetchDataProductRequest();

const handlePrint = async (doc) => {
    try {
        const response = await directus.request(readFile(dataDeviceTransfer.value.device_transfer_file_1));

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
</script>

<style scoped>
.documents-section {
    font-family: "Prompt", sans-serif;
    padding: 20px;
    border-radius: 8px;
    margin: 20px;
}

h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: capitalize;
}

.document-item {
    background-color: #fff;
    padding: 20px;
    /* border: 1px solid #e0e0e0; */
    border-top: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.description-actions-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    /* Adjust gap for smaller screens */
}

.document-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 10px;
    color: #333;
}

.status {
    font-size: 0.9rem;
    padding: 5px 10px;
    border-radius: 20px;
    text-align: center;
    font-weight: 600;
    text-transform: capitalize;
}

.status.has-error {
    background-color: #ffe5e5;
    color: #d9534f;
    border: 1px solid #d9534f;
}

.status.has-details {
    background-color: #e6f9e6;
    color: #5cb85c;
    border: 1px solid #5cb85c;
}

.status.pending {
    background-color: #fff4e5;
    color: #f0ad4e;
    border: 1px solid #f0ad4e;
}

.description {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.5;
    text-align: justify;
    margin: 0;
    flex: 1;
}

.warning-text {
    color: #d9534f;
    font-weight: bold;
    font-size: 0.9rem;
}

.document-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-end;
    flex-shrink: 0;
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
}

.btn:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.btn i {
    font-size: 1.1rem;
}

.btn-print {
    background-color: #003566;
    color: #fff;
}

.btn-print:hover {
    background-color: #003d80;
}

.btn-sign {
    background-color: #28a745;
    color: #fff;
}

.btn-sign:hover {
    background-color: #1e7e34;
}

.btn-download {
    background-color: #6c757d;
    color: #fff;
}

.btn-download:hover {
    background-color: #565e64;
}

.btn-add-info {
    background-color: #007bff;
    color: #fff;
}

.btn-add-info:hover {
    background-color: #0056b3;
}

.document-item {
    animation: fadeIn 0.5s ease both;
}

@media (max-width: 768px) {
    .document-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }

    .btn {
        width: 100%;
        text-align: center;
    }
}
</style>
