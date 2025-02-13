<template>
    <div></div>
</template>

<script setup>
import Swal from "sweetalert2";
import { defineEmits } from "vue";

const emit = defineEmits(["confirmed", "cancelled"]);

const showWarningNoFullField = () => {
    Swal.fire({
        title: "กรุณาใส่ข้อมูลที่จำเป็นให้ครบ!",
        icon: "warning",
        confirmButtonText: "OK",
    });

};

const showWarning = () => {
    Swal.fire({
        title: "ไม่พบ Serial number อยู่ในสต๊อก!",
        icon: "warning",
        confirmButtonText: "OK",
    });

};

const showWarningDuplicate = () => {
    Swal.fire({
        title: "Serial number นี้มีอยู่ในใบจัดสินค้าแล้ว!",
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

const confirmUpdate = () => {
    return Swal.fire({
        title: "ยืนยันการอัปเดต",
        text: "คุณแน่ใจหรือไม่ว่าต้องการอัปเดตรายการนี้?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่, อัปเดตเลย!",
        cancelButtonText: "ยกเลิก",
    });
};

const confirmDelete = () => {
    return Swal.fire({
        title: "ยืนยันการลบข้อมูล",
        text: "คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
    });
};

const showWarningBackupDevice = () => {
    return Swal.fire({
        title: "Serial number นี้เป็นเครื่องสำรอง!",
        icon: "warning",
        confirmButtonText: "OK",
    });
};

const showWarningSerailNumberDuplicated = () => {
    return Swal.fire({
        title: "Serial number นี้ซ้ำ!",
        icon: "warning",
        confirmButtonText: "OK",
    });
};

defineExpose({ showWarningNoFullField , showWarning , showWarningDuplicate , showWarningBroken, showWarningAlreadyUse , confirmDelete , confirmUpdate , showWarningBackupDevice , showWarningSerailNumberDuplicated});
</script>