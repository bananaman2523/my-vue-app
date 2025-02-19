<template>
    <div></div>
</template>

<script setup>
import Swal from "sweetalert2";
import { defineEmits } from "vue";

const emit = defineEmits(["confirmed", "cancelled"]);

const showError = () => {
    Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        icon: "error",
        confirmButtonText: "OK",
    });

};

const showErrorUpload = (nameFile) => {
    Swal.fire({
        title: `อัปโหลดเอกสาร ${nameFile} ไม่สำเร็จ!`,
        icon: "error",
        confirmButtonText: "OK",
    });
};

defineExpose({ showError , showErrorUpload});
</script>