const printer_pre = [
    {
        category: "ตรวจเช็กสภาพภายนอกของเครื่อง",
        description: "ตรวจสอบสภาพของเครื่องไม่มีรอยแตกหักหรือชำรุด",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจเช็กสภาพภายนอกของเครื่อง",
        description: "ตรวจสอบการเชื่อมต่อของสายไฟและพอร์ต",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจเช็กสภาพภายนอกของเครื่อง",
        description: "เปิดเครื่องและตรวจสอบการทำงาน",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบว่ามีเสียงสัญญาณเตือนผิดปกติจากเครื่องพิมพ์/ไฟแสดงสถานะ",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบว่าหัวพิมพ์ไม่จางหรือมีปัญหา",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบการฟีดกระดาษ",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบการตัดกระดาษ (หากเสียบสาย Lan กรุณาถอดสาย Lan ก่อน)",
        status: "รอตรวจสอบ",
        note: ""
    }
];

const printer_fianl = [
    {
        category: "ตรวจเช็กสภาพภายนอกของเครื่อง",
        description: "ตรวจสอบสภาพของเครื่องไม่มีรอยแตกหักหรือชำรุด",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจเช็กสภาพภายนอกของเครื่อง",
        description: "ตรวจสอบการเชื่อมต่อของสายไฟและพอร์ต",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจเช็กสภาพภายนอกของเครื่อง",
        description: "เปิดเครื่องและตรวจสอบการทำงาน",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบว่ามีเสียงสัญญาณเตือนผิดปกติจากเครื่องพิมพ์/ไฟแสดงสถานะ",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบว่าหัวพิมพ์ไม่จางหรือมีปัญหา",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบการฟีดกระดาษ",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบการตัดกระดาษ (หากเสียบสาย Lan กรุณาถอดสาย Lan ก่อน)",
        status: "รอตรวจสอบ",
        note: ""
    }
];

const kiosk_pre = [
    {
        category: "ตรวจสอบภายนอก",
        description: "ตรวจสอบสภาพทั่วไปของตัวเครื่องว่ามีความเสียหายหรือไม่",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจสอบภายนอก",
        description: "เช็กจอภาพว่ามีรอยขีดข่วนหรือจอเสียหรือไม่",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจสอบการทำงานของจอสัมผัส",
        description: "ทดสอบการตอบสนองของหน้าจอสัมผัส",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจสอบการทำงานของจอสัมผัส",
        description: "ตรวจสอบว่าภาพพื้นหลังและไอคอนบนหน้าจอแสดงผลได้ถูกต้อง ไม่มีภาพแตก หรือสีผิดเพี้ยน",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจสอบการทำงานของจอสัมผัส",
        description: "ตรวจสอบความถูกต้องของข้อมูลกับการสัมผัสของหน้าจอ",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
        description: "ตรวจสอบว่าเครื่อง Kiosk เชื่อมต่อกับอินเทอร์เน็ตได้อย่างถูกต้อง",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบว่ามีการพิมพ์ออกมาถูกต้องและชัดเจนหรือไม่",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบหมึกหรือกระดาษว่ามีเพียงพอหรือไม่",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบว่ากระบวนการตัดใบเสร็จเสร็จสมบูรณ์หรือไม่",
        status: "รอตรวจสอบ",
        note: ""
    },
];

const kiosk_final = [
    {
        category: "ตรวจสอบภายนอก",
        description: "ตรวจสอบสภาพทั่วไปของตัวเครื่องว่ามีความเสียหายหรือไม่",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจสอบภายนอก",
        description: "เช็กจอภาพว่ามีรอยขีดข่วนหรือจอเสียหรือไม่",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจสอบการทำงานของจอสัมผัส",
        description: "ทดสอบการตอบสนองของหน้าจอสัมผัส",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจสอบการทำงานของจอสัมผัส",
        description: "ตรวจสอบว่าภาพพื้นหลังและไอคอนบนหน้าจอแสดงผลได้ถูกต้อง ไม่มีภาพแตก หรือสีผิดเพี้ยน",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจสอบการทำงานของจอสัมผัส",
        description: "ตรวจสอบความถูกต้องของข้อมูลกับการสัมผัสของหน้าจอ",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
        description: "ตรวจสอบว่าเครื่อง Kiosk เชื่อมต่อกับอินเทอร์เน็ตได้อย่างถูกต้อง",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบว่ามีการพิมพ์ออกมาถูกต้องและชัดเจนหรือไม่",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบหมึกหรือกระดาษว่ามีเพียงพอหรือไม่",
        status: "รอตรวจสอบ",
        note: ""
    },
    {
        category: "ทดสอบการพิมพ์",
        description: "ตรวจสอบว่ากระบวนการตัดใบเสร็จเสร็จสมบูรณ์หรือไม่",
        status: "รอตรวจสอบ",
        note: ""
    },
];

const ups_pre = [
    {
        "category": "ตรวจสอบสภาพภายนอก",
        "description": "ตรวจสอบว่าไม่มีรอยแตกหรือความเสียหายที่ตัว UPS",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการเชื่อมต่อ",
        "description": "ตรวจสอบว่าปลั๊กไฟเชื่อมต่ออยู่ในสถานะที่ถูกต้อง",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการเชื่อมต่อ",
        "description": "ตรวจสอบสายไฟ AC และการเชื่อมต่อกับอุปกรณ์ที่ต้องการจ่ายไฟ",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบสถานะแบตเตอรี่",
        "description": "ทดสอบโดยการตัดไฟฟ้าชั่วคราวเพื่อดูว่า UPS สามารถจ่ายไฟให้กับได้หรือไม่",
        "status": "รอตรวจสอบ",
        "note": ""
    }
]

const ups_final = [
    {
        "category": "ตรวจสอบสภาพภายนอก",
        "description": "ตรวจสอบว่าไม่มีรอยแตกหรือความเสียหายที่ตัว UPS",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการเชื่อมต่อ",
        "description": "ตรวจสอบว่าปลั๊กไฟเชื่อมต่ออยู่ในสถานะที่ถูกต้อง",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการเชื่อมต่อ",
        "description": "ตรวจสอบสายไฟ AC และการเชื่อมต่อกับอุปกรณ์ที่ต้องการจ่ายไฟ",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบสถานะแบตเตอรี่",
        "description": "ทดสอบโดยการตัดไฟฟ้าชั่วคราวเพื่อดูว่า UPS สามารถจ่ายไฟให้กับได้หรือไม่",
        "status": "รอตรวจสอบ",
        "note": ""
    }
]

const scanner_pre = [
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบสภาพของเครื่องและหน้าจอไม่มีรอยแตกหักหรือชำรุด",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบการเชื่อมต่อของสาย USB",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการทำงานของเครื่องอ่านบาร์โค้ด",
        "description": "ทดสอบการสแกนบาร์โค้ดและตรวจสอบว่าข้อมูลถูกต้องหรือไม่",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการทำงานของเครื่องอ่านบาร์โค้ด",
        "description": "ตรวจสอบไฟแสดงสถานะของเครื่อง (ไฟเปิด/ปิด ไฟสถานะต่าง ๆ )",
        "status": "รอตรวจสอบ",
        "note": ""
    }
]

const scanner_final = [
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบสภาพของเครื่องและหน้าจอไม่มีรอยแตกหักหรือชำรุด",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบการเชื่อมต่อของสาย USB",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการทำงานของเครื่องอ่านบาร์โค้ด",
        "description": "ทดสอบการสแกนบาร์โค้ดและตรวจสอบว่าข้อมูลถูกต้องหรือไม่",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการทำงานของเครื่องอ่านบาร์โค้ด",
        "description": "ตรวจสอบไฟแสดงสถานะของเครื่อง (ไฟเปิด/ปิด ไฟสถานะต่าง ๆ )",
        "status": "รอตรวจสอบ",
        "note": ""
    }
]

const drawer_pre = [
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบสภาพของเครื่องไม่มีรอยแตกหักหรือชำรุด",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบการเชื่อมต่อของสาย RJ11",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการเปิด-ปิดลิ้นชัก",
        "description": "ทดสอบการเปิด-ปิดด้วยกุญแจ",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการเปิด-ปิดลิ้นชัก",
        "description": "ส่งคำสั่งเปิดจาก POS เปิดออกมาได้หรือไม่",
        "status": "รอตรวจสอบ",
        "note": ""
    }
]

const drawer_final = [
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบสภาพของเครื่องไม่มีรอยแตกหักหรือชำรุด",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบการเชื่อมต่อของสาย RJ11",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการเปิด-ปิดลิ้นชัก",
        "description": "ทดสอบการเปิด-ปิดด้วยกุญแจ",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการเปิด-ปิดลิ้นชัก",
        "description": "ส่งคำสั่งเปิดจาก POS เปิดออกมาได้หรือไม่",
        "status": "รอตรวจสอบ",
        "note": ""
    }
]

const pos_monitor_pre = [
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบสภาพของเครื่องไม่มีรอยแตกหักหรือชำรุด",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบการเชื่อมต่อของสายไฟและพอร์ตดังนี้ สาย Adapter, AC, VGA และ Lan",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "การเปิดเครื่อง",
        "description": "เปิดเครื่องและตรวจสอบว่ามีการทำงานปกติ ไม่ช้าหรือหน่วง",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "การเปิดเครื่อง",
        "description": "ตรวจสอบไฟแสดงสถานะของเครื่อง (ไฟเปิด/ปิด ไฟสถานะต่าง ๆ )",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบหน้าจอสัมผัส",
        "description": "ตรวจสอบความไวและความถูกต้องของข้อมูลตามการสัมผัสหน้าจอ",
        "status": "รอตรวจสอบ",
        "note": ""
    }
]

const pos_monitor_final = [
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบสภาพของเครื่องไม่มีรอยแตกหักหรือชำรุด",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจเช็กสภาพภายนอกของเครื่อง",
        "description": "ตรวจสอบการเชื่อมต่อของสายไฟและพอร์ตดังนี้ สาย Adapter, AC, VGA และ Lan",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "การเปิดเครื่อง",
        "description": "เปิดเครื่องและตรวจสอบว่ามีการทำงานปกติ ไม่ช้าหรือหน่วง",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "การเปิดเครื่อง",
        "description": "ตรวจสอบไฟแสดงสถานะของเครื่อง (ไฟเปิด/ปิด ไฟสถานะต่าง ๆ )",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบหน้าจอสัมผัส",
        "description": "ตรวจสอบความไวและความถูกต้องของข้อมูลตามการสัมผัสหน้าจอ",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
        "description": "ตรวจสอบการเชื่อมต่อกับเครือข่ายอินเทอร์เน็ต",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบ IP Address ของอุปกรณ์",
        "description": "ตรวจสอบว่ามีการชนกันของ IP Address หรือไม่",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการทำงานของซอฟต์แวร์",
        "description": "ติดตั้งระบบปฏิบัติการใหม่",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการทำงานของซอฟต์แวร์",
        "description": "ทดสอบการบันทึกข้อมูล การออกใบเสร็จ และการประมวลผลข้อมูล",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการทำงานของซอฟต์แวร์",
        "description": "สำรองข้อมูล Log และลบ Log ที่ไม่จำเป็น",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการทำงานของซอฟต์แวร์",
        "description": "อัปเดต Add-ons สำหรับ Viviconnect, ECR, Redeem, Member",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการทำงานของซอฟต์แวร์",
        "description": "การดึงไฟล์ License VIVIPOS มาเก็บไว้บน Cloud",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการทำงานของซอฟต์แวร์",
        "description": "ลบไฟล์ที่ไม่จำเป็นทิ้ง",
        "status": "รอตรวจสอบ",
        "note": ""
    },
    {
        "category": "ตรวจสอบการแสดงผล",
        "description": "ตรวจสอบว่าภาพพื้นหลังและไอคอนแสดงผลได้ถูกต้อง ไม่มีภาพแตก หรือสีผิดเพี้ยน",
        "status": "รอตรวจสอบ",
        "note": ""
    }
]

export default { printer_pre, printer_fianl, kiosk_pre, kiosk_final, ups_pre, ups_final, scanner_pre, scanner_final, drawer_pre, drawer_final, pos_monitor_pre, pos_monitor_final };
