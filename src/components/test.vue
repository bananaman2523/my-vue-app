<template>
    <div class="repair-form">
      <main>
        <h1>อุปกรณ์</h1>
        <div>
          <table class="stock-table">
            <thead>
              <tr>
                <th>รหัสสินค้า</th>
                <th>ชื่อสินค้า</th>
                <th>รุ่น</th>
                <th>S/N</th>
                <th style="text-align: center;">คุณภาพสินค้า</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item,index) in formData.stock" :key="item.id">
                <tr>
                  <td>
                    <input type="text" v-model="selectedItem.product_code_office_design" disabled/>
                  </td>
                  <td>
                    <input type="text" v-model="selectedItem.product_name_office_design" disabled/>
                  </td>
                  <td>
                    <input v-model="item.model" @change="updateSelectedItem(index)" disabled />
                  </td>
                  <td>
                    <select v-model="item.selectedSerialNumber" @change="updateSelectedItem(index)">
                        <option value="">S/N</option>
                        <option v-for="serial in serialNumbers" :key="serial.id" :value="serial.serial_number">
                        {{ serial.serial_number }}
                        </option>
                    </select>
                  </td>
                  <td>
                    <button>สับเปลี่ยน</button>
                  </td>
                </tr>
                <tr>
                  <td colspan="5" style="text-align: left;">
                    <label>เหตุผล</label>
                    <input type="text" style="padding-right: 100vh;display: flex;"/>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute } from "vue-router";


  const selectedSerialNumber = ref([]);
  const selectedItem = ref({
    product_code_office_design: "",
    product_name_office_design: "",
    group_product: "",
    model: "",
  });
  const updateSelectedItem = (index) => {
  
  const found = serialNumbers.value.find((s) => s.serial_number === formData.value.stock[index].selectedSerialNumber);

  if (found) {
    // ถ้าพบ serial number ที่ตรงกัน จะอัพเดต selectedItem
    selectedItem.value = { 
      ...found, 
      model: found.model // นำ model จาก serial ที่ตรงมาใส่
    };
  } else {
    // ถ้าไม่พบค่า serial number ที่ตรง ให้รีเซ็ต selectedItem
    selectedItem.value = {
      product_code_office_design: "",
      product_name_office_design: "",
      group_product: "",
      model: "",
    };
  }
};


  const serialNumbers = ref(
    [
        {
            "id": 72,
            "serial_number": "SN12345",
            "product_code_office_design": "OFFICE001",
            "product_name_office_design": "Office Product A",
            "group_product": "POS Monitor 1",
            "model": "PP-9635"
        },
        {
            "id": 76,
            "serial_number": "SN12349",
            "product_code_office_design": "OFFICE005",
            "product_name_office_design": "Office Product E",
            "group_product": "POS Monitor 5",
            "model": "PP-9639"
        },
        {
            "id": 77,
            "serial_number": "SN12350",
            "product_code_office_design": "OFFICE006",
            "product_name_office_design": "Office Product F",
            "group_product": "POS Monitor 6",
            "model": "PP-9640"
        },
        {
            "id": 78,
            "serial_number": "SN12351",
            "product_code_office_design": "OFFICE007",
            "product_name_office_design": "Office Product G",
            "group_product": "POS Monitor 7",
            "model": "PP-9641"
        },
        {
            "id": 79,
            "serial_number": "SN12352",
            "product_code_office_design": "OFFICE008",
            "product_name_office_design": "Office Product H",
            "group_product": "POS Monitor 8",
            "model": "PP-9642"
        },
        {
            "id": 80,
            "serial_number": "SN12353",
            "product_code_office_design": "OFFICE009",
            "product_name_office_design": "Office Product I",
            "group_product": "POS Monitor 9",
            "model": "PP-9643"
        }
    ]
    )
  const route = useRoute();
  
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
  
  const formData = ref({
    "id": 47,
    "customer_name": "ชื่อลูกค้า",
    "branch_name": "เซ็นทรัลเวสต์วิลล์",
    "branch_code": "รหัสสาขา",
    "quotation_number_office_design": "เลขที่ใบเสนอราคา (Office Design)",
    "customer_order_number": "เลขที่ใบสั่งซื้อของลูกค้า",
    "plan_delivery_date": "2025-02-10",
    "product_preparation_date": "2025-02-09",
    "company_name": "KOI The",
    "prepared_by": "test test",
    "status": "ผ่าน",
    "stock": [
        {
            "id": 73,
            "receive_date": "2025-02-08T00:00:00",
            "name_supplier": "Supplier B",
            "bill_lading_number": "BL123457",
            "bill_lading_number_date": "2025-02-09T00:00:00",
            "invoice_number": "INV123457",
            "invoice_number_date": "2025-02-10T00:00:00",
            "receipt_number": "RCPT123457",
            "receipt_number_date": "2025-02-11T00:00:00",
            "due_date": "2025-02-12T00:00:00",
            "item_code": "ITEM002",
            "product_name_supplier": "Product B",
            "bill_number": "BN123457",
            "product_code_office_design": "OFFICE002",
            "product_name_office_design": "Office Product B",
            "serial_number": "SN12346",
            "group_product": "POS Monitor 2",
            "model": "PP-9636",
            "status": "รอตรวจเช็ก",
            "stock_id": 47
        },
        {
            "id": 74,
            "receive_date": "2025-02-08T00:00:00",
            "name_supplier": "Supplier C",
            "bill_lading_number": "BL123458",
            "bill_lading_number_date": "2025-02-09T00:00:00",
            "invoice_number": "INV123458",
            "invoice_number_date": "2025-02-10T00:00:00",
            "receipt_number": "RCPT123458",
            "receipt_number_date": "2025-02-11T00:00:00",
            "due_date": "2025-02-12T00:00:00",
            "item_code": "ITEM003",
            "product_name_supplier": "Product C",
            "bill_number": "BN123458",
            "product_code_office_design": "OFFICE003",
            "product_name_office_design": "Office Product C",
            "serial_number": "SN12347",
            "group_product": "POS Monitor 3",
            "model": "PP-9637",
            "status": "รอตรวจเช็ก",
            "stock_id": 47
        },
        {
            "id": 75,
            "receive_date": "2025-02-08T00:00:00",
            "name_supplier": "Supplier D",
            "bill_lading_number": "BL123459",
            "bill_lading_number_date": "2025-02-09T00:00:00",
            "invoice_number": "INV123459",
            "invoice_number_date": "2025-02-10T00:00:00",
            "receipt_number": "RCPT123459",
            "receipt_number_date": "2025-02-11T00:00:00",
            "due_date": "2025-02-12T00:00:00",
            "item_code": "ITEM004",
            "product_name_supplier": "Product D",
            "bill_number": "BN123459",
            "product_code_office_design": "OFFICE004",
            "product_name_office_design": "Office Product D",
            "serial_number": "SN12348",
            "group_product": "POS Monitor 4",
            "model": "PP-9638",
            "status": "รอตรวจเช็ก",
            "stock_id": 47
        }
    ]
});

  </script>
  
  <style scoped>
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
  
  .disable-form{
    background-color: #D9D9D9;
  }
  
  .disable-form-user{
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
  
  .disable-form{
    background-color: #D9D9D9;
  }
  .container {
    padding: 20px;
    overflow-x: auto;
  }
  .container-product{
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
  