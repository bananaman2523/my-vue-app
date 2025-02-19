<template>
    <div></div>
</template>

<script setup>
import Swal from "sweetalert2";
import { defineEmits } from "vue";

const emit = defineEmits(["confirmed", "cancelled"]);

const showSuccess = () => {
    Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ!",
        icon: "success",
        confirmButtonText: "OK",
    }).then(() => {
        window.scrollTo(0, 0);
        window.location.reload();
    });
};
const showSuccessUpdate = () => {
    Swal.fire({
        title: "อัปเดตข้อมูลสำเร็จ!",
        icon: "success",
        confirmButtonText: "OK",
    }).then(() => {
        window.scrollTo(0, 0);
        window.location.reload();
    });
};
const showSuccessDelete = () => {
    Swal.fire({
        title: "ลบข้อมูลสำเร็จ!",
        icon: "success",
        confirmButtonText: "OK",
    })
    // .then(() => {
    //     window.scrollTo(0, 0);
    //     window.location.reload();
    // });
};

const showSuccessUpload = (nameFile) => {
    Swal.fire({
        title: `อัปโหลดเอกสาร ${nameFile} สำเร็จ!`,
        icon: "success",
        confirmButtonText: "OK",
    });
};
defineExpose({ showSuccess , showSuccessUpdate , showSuccessDelete , showSuccessUpload});
</script>