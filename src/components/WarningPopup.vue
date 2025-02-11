<template>
    <div></div>
</template>

<script setup>
import Swal from "sweetalert2";
import { defineEmits } from "vue";

const emit = defineEmits(["confirmed", "cancelled"]);

const showWarning = () => {
    Swal.fire({
        title: "ไม่พบ Serial number อยู่ในสต๊อก!",
        icon: "warning",
        confirmButtonText: "OK",
    });

};

const showWarningDuplicate = () => {
    Swal.fire({
        title: "Serial number นี้มีอยู่ในสต๊อกแล้ว!",
        icon: "warning",
        confirmButtonText: "OK",
    });

};

const showWarningBroken = () => {
    Swal.fire({
        title: "Serial number นี้ชำรุด!",
        icon: "warning",
        confirmButtonText: "OK",
    });
};

const showWarningAlreadyUse = () => {
    Swal.fire({
        title: "Serial number นี้ถูกใช้ในใบจัดของอื่นแล้ว!",
        icon: "warning",
        confirmButtonText: "OK",
    });
};

defineExpose({ showWarning , showWarningDuplicate , showWarningBroken, showWarningAlreadyUse});
</script>