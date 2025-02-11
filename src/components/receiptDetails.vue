<template>
  <div class="repair-form">
    <SidebarMenu />
    <main>
      <h1>เพิ่มสินค้าเข้า Stock</h1>
      <div class="container">
        <form>
          <div class="form-row">
            <label>วันที่รับ <label style="color: red;">*</label></label>
            <input type="date" v-model="formData.receive_date" required :disabled="disabledField" class="disable-form"/>
          </div>
          <div class="form-row">
            <label>ชื่อ supplier <label style="color: red;">*</label></label>
            <input type="text" v-model="formData.supplierName" required :disabled="disabledField" class="disable-form"/>
          </div>
          <div class="form-row">
            <label>เลข PO <label style="color: red;">*</label></label>
            <input type="text" v-model="formData.poNumber" :disabled="disabledField" class="disable-form"/>
          </div>
          <div class="form-row">
            <label>เลขที่ใบส่งสินค้า</label>
            <input type="text" v-model="formData.deliveryNoteNumber" :disabled="disabledField" class="disable-form"/>
          </div>
          <div class="form-row">
            <label>วันเลขที่ใบส่งสินค้า</label>
            <input type="date" v-model="formData.deliveryNoteDate" :disabled="disabledField" class="disable-form"/>
          </div>
          <div class="form-row">
            <label>สถานะสินค้า</label>
            <select v-model="formData.statusProduct">
              <option value="สินค้าขาย">สินค้าขาย</option>
              <option value="เครื่องสำรอง">เครื่องสำรอง</option>
            </select>
          </div>
          <div class="form-row">
            <label>เลขที่ใบกำกับภาษี <label style="color: red;">*</label></label>
            <input type="text" v-model="formData.taxInvoiceNumber" required :disabled="disabledField" class="disable-form"/>
          </div>
          <div class="form-row">
            <label>Invoice date <label style="color: red;">*</label></label>
            <input type="date" v-model="formData.invoiceDate" required :disabled="disabledField" class="disable-form"/>
          </div>
          <br>
          <div class="form-row">
            <label>เลขที่ใบเสร็จ</label>
            <input type="text" v-model="formData.receiptNumber" :disabled="disabledField" class="disable-form"/>
          </div>
          <div class="form-row">
            <label>วันที่ใบเสร็จ</label>
            <input type="date" v-model="formData.receiptDate" :disabled="disabledField" class="disable-form"/>
          </div>
          <br>
          <div class="form-row">
            <label>เลขที่ใบวางบิล</label>
            <input type="text" v-model="formData.billingNoteNumber" :disabled="disabledField" class="disable-form"/>
          </div>
          <div class="form-row">
            <label>วันที่ due ชำระ</label>
            <input type="date" v-model="formData.dueDate" :disabled="disabledField" class="disable-form"/>
          </div>
          <br>
          <div class="form-row">
            <label>Item code <label style="color: red;">*</label></label>
            <input type="text" v-model="formData.itemCode" required :disabled="disabledField" class="disable-form"/>
          </div>
          <div class="form-row">
            <label>ชื่อสินค้า (Supplier) <label style="color: red;">*</label></label>
            <input type="text" v-model="formData.supplierProductName" required :disabled="disabledField" class="disable-form"/>
          </div>
          <br>
          <div class="form-row">
            <label>สถานะอุปกรณ์</label>
            <input type="text" v-model="formData.status" required :disabled="disabledField" class="disable-form"/>
          </div>
          <div class="form-row" v-if="formData.status === 'ชำรุด'">
            <label>ประเภทชำรุด</label>
            <input type="text" v-model="formData.broken_category" required :disabled="disabledField" class="disable-form"/>
          </div>
          <br>
          <div class="form-row" v-if="formData.status === 'ชำรุด'">
            <label>รายละเอียดชำรุด</label>
            <input type="text" v-model="formData.broken_description" required :disabled="disabledField" class="disable-form"/>
          </div>
        </form>
      </div>
      <h1>อุปกรณ์</h1>
      <div class="container">
        <form>
          <div style="display: contents;">
            <div class="form-row">
              <label>รหัสสินค้า Office Design <label style="color: red;">*</label></label>
              <input type="text" v-model="formData.productCodeOfficeDesign" required :disabled="disabledField" class="disable-form"/>
            </div>
            <div class="form-row">
              <label>ชื่อสินค้า Office Design <label style="color: red;">*</label></label>
              <input type="text" v-model="formData.productNameOfficeDesign" required :disabled="disabledField" class="disable-form"/>
            </div>
            <br>
            <div class="form-row">
              <label>หมวดหมู่สินค้า <label style="color: red;">*</label></label>
              <select v-model="formData.group_product" required :disabled="disabledField" class="disable-form">
                <option :value="formData.group_product">{{formData.group_product}}</option> 
              </select>
            </div>
            <div class="form-row">
              <label>model <label style="color: red;">*</label></label>
              <select v-model="formData.model" required :disabled="disabledField" class="disable-form">
                <option :value="formData.model">{{formData.model}}</option> 
              </select>
            </div>
            <div class="form-row">
              <label>S/N <label style="color: red;">*</label></label>
              <input type="text" v-model="formData.serial_number" required :disabled="disabledField" class="disable-form"/>
            </div>
            <div class="form">
              <button type="button" class="update-button" @click="updateForm">บันทึก</button>
              <button type="button" class="delete-button" @click="deleteForm">ลบ</button>
            </div>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { directus } from "@/services/directus";
import { readItems, deleteItem , updateItem } from "@directus/sdk";
import SidebarMenu from "@/components/SidebarMenu.vue";
import { useRoute , useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const disabledField = ref(false);

const formData = ref({
  receive_date: "",
  supplierName: "",
  deliveryNoteNumber: "",
  deliveryNoteDate: "",
  taxInvoiceNumber: "",
  invoiceDate: "",
  receiptNumber: "",
  receiptDate: "",
  billingNoteNumber: "",
  dueDate: "",
  itemCode: "",
  supplierProductName: "",
  poNumber: "",
  statusProduct: "",
  status: "",
  broken_category: "",
  broken_description: ""
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

const fetchData = async () => {
  try {
    const response = await directus.request(
      readItems("stock", {
        filter: {
          id: { _eq: route.params.id },
        },
        fields: ["*"],
      })
    );

    if (response.length > 0) {
      const data = response[0];
      
      formData.value = {
        receive_date: formatDate(data.receive_date),
        supplierName: data.name_supplier || "",
        deliveryNoteNumber: data.bill_lading_number || "",
        deliveryNoteDate: formatDate(data.bill_lading_number_date),
        taxInvoiceNumber: data.invoice_number || "",
        invoiceDate: formatDate(data.invoice_number_date),
        receiptNumber: data.receipt_number || "",
        receiptDate: formatDate(data.receipt_number_date),
        billingNoteNumber: data.invoice_number || "",
        dueDate: formatDate(data.due_date),
        itemCode: data.item_code || "",
        supplierProductName: data.product_name_supplier || "",
        productCodeOfficeDesign : data.product_code_office_design || "",
        productNameOfficeDesign: data.product_name_office_design || "",
        group_product: data.group_product || "",
        model: data.model || "",
        serial_number: data.serial_number || "",
        poNumber: data.po_number || "",
        statusProduct: data.device_status || "",
        status: data.status || "",
        broken_category: data.broken_category || "",
        broken_description: data.broken_description || "",
      };
      disabledField.value = true;
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
};

onMounted(() => {
  if (route.params.id) {
    fetchData();
  }
});

async function deleteForm() {
  const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;

  try {
    await directus.request(
      deleteItem("stock", route.params.id)
    );
    router.push({ name: 'listStock' });
    alert("Item deleted successfully!");
  } catch (error) {
    alert("Failed to delete item: " + error.message);
  }
}

async function updateForm() {
  const confirmDelete = window.confirm("Are you sure you want to update this item?");
  if (!confirmDelete) return;

  try {
    const update = await directus.request(
      updateItem('stock', route.params.id, {
        device_status: formData.value.statusProduct,
      })
    );
    alert("Item update successfully!");
  } catch (error) {
    alert("Failed to update item: " + error.message);
  }
}

</script>

<style scoped>
.disable-form{
  background-color: #D9D9D9;
}
.container {
  padding: 20px;
  overflow-x: auto;
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

.form {
  grid-column: span 3;
  text-align: right;
  margin: 20px;
}
.form .delete-button {
  margin-left: 16px;
  background-color: red;
}
.form .update-button {
  background-color: #f8c344;
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
