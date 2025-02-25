<template>
  <div class="repair-form">
    <main>
      <div v-for="(form, index) in forms" :key="index" class="container">
        <form @submit.prevent="submitForm">
          <div style="display: contents;">
            <div class="form-row">
              <label>ชื่อสินค้า Office Design <label style="color: red;">*</label></label>
              <select v-model="form.productName" @change="updateProduct(index)">
                <option value="">Select a category</option>
                <option v-for="productName in data" :key="productName.product_name" :value="productName.product_name">
                  {{ productName.product_name }}
                </option>
              </select>
            </div>
            <div class="form-row">
              <label>รหัสสินค้า Office Design <label style="color: red;">*</label></label>
              <input type="text" v-model="form.productCode" disabled class="disable-form"/>
            </div>
            <div style="display: flex; justify-content: end;">
              <button type="button" @click="removeForm(index)" class="delete-button">X</button>
            </div>
            <div class="form-row">
              <label>อุปกรณ์ <label style="color: red;">*</label></label>
              <input type="text" v-model="form.productModel" disabled class="disable-form"/>
            </div>
            <div class="form-row">
              <label>รุ่น/แบรนด์ <label style="color: red;">*</label></label>
              <input type="text" v-model="form.productBrand" disabled class="disable-form"/>
            </div>
            <div class="form-row">
              <label>จำนวนสินค้า <label style="color: red;">*</label></label>
              <div>
                <input type="number" v-model.number="form.quantity" min="1" />
                <button @click="generateSerialNumbers(index)" style="margin-left: 12px;height: 36px;width: 56px;">เพิ่ม</button>  
              </div>
            </div>
            <div class="form-row" v-for="(sn, snIndex) in form.serialNumbers" :key="snIndex">
              <label>S/N {{ snIndex + 1 }} <label style="color: red;">*</label></label>
              <input type="text" v-model="form.serialNumbers[snIndex]" @change="cheakSerialNumberInStock(form.serialNumbers[snIndex], form)"/>
            </div>
          </div>
        </form>
      </div>
      <button @click="addForm" class="add-button">+ Add New</button>
      <WarningPopup ref="warningPopup"/>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { directus } from "@/services/directus";
import { readItems } from "@directus/sdk";
import WarningPopup from "@/components/popup/WarningPopup.vue";
import { useRoute } from 'vue-router';
const route = useRoute();
const warningPopup = ref(null);

const emit = defineEmits(['update:products']);
const data = ref({ product: [] });

const forms = ref([
  { productCode: '', productName: '', productBrand: '', productModel: '', quantity: 1, serialNumbers: [] }
]);

const addForm = () => {
  forms.value.push({ productCode: '', productName: '', productBrand: '', productModel: '', quantity: 1 , serialNumbers: [] });
};

const removeForm = (index) => {
  forms.value.splice(index, 1);
};

const generateSerialNumbers = (index) => {
  const form = forms.value[index];
  const newQuantity = Math.max(form.quantity || 1, 1);
  
  if (newQuantity < form.serialNumbers.length) {
    form.serialNumbers = form.serialNumbers.slice(0, newQuantity);
  } else {
    form.serialNumbers = [
      ...form.serialNumbers,
      ...Array(newQuantity - form.serialNumbers.length).fill('')
    ];
  }
};

watch(forms, (newForms) => {
  emit('update:products', newForms);
}, { deep: true });

const fetchData = async () => {
  try {
    const response = await directus.request(
      readItems("config", {
        fields: [
          "product_code"
        ],
      })
    );
    data.value = response[0].product_code
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const updateProduct = (index) => {
  const form = forms.value[index];
  const selectedProduct = data.value.find(product => product.product_name === form.productName);
  if (selectedProduct) {
    form.productCode = selectedProduct.product_code || '';
    form.productModel = selectedProduct.equipment.model || ''
    form.productBrand = selectedProduct.equipment.brand || ''
  }
};
fetchData();

function findDuplicatePosition(arr, num) {
  let lastIndex = -1;
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === num) {
      lastIndex = i;
    }
  }

  return lastIndex;
}
async function cheakSerialNumberInStock(serialNumber, formItem) {
  try {
    if (serialNumber) {

      const checks = (await directus.request(
        readItems("stock", {
          fields:["*.*"]
        })
      )) || [];

      const isDuplicateInStock = checks.some(check => check.serial_number === serialNumber);
      if (isDuplicateInStock && route.name !== 'documentPreparation') {
        warningPopup.value.showWarningSerailNumberDuplicated();
        formItem.serialNumbers[formItem.serialNumbers.indexOf(serialNumber)] = "";
        return;
      }
      
      const isDuplicateInCurrentForm = formItem.serialNumbers.filter(sn => sn === serialNumber).length > 1;
      if (isDuplicateInCurrentForm) {
        warningPopup.value.showWarningDuplicate();
        const position = findDuplicatePosition(formItem.serialNumbers, serialNumber);
        formItem.serialNumbers[position] = "";
        return;
      }

      if(route.name === 'documentPreparation'){
        const stock = (await directus.request(
          readItems("stock", {
            filter: {
              serial_number: {
                _eq: serialNumber,
              },
            },
          })
        )) || [];
        
        if (stock.length === 0 ) {
          warningPopup.value.showWarning();
          const position = findDuplicatePosition(formItem.serialNumbers, serialNumber);
          formItem.serialNumbers[position] = "";
          return;   
        }else if (stock[0].status === 'ชำรุด') {
          warningPopup.value.showWarningBroken();
          const position = findDuplicatePosition(formItem.serialNumbers, serialNumber);
          formItem.serialNumbers[position] = "";
          return;
        }
      }

    }
    
  } catch (error) {
    console.error("Error generating preparation number:", error);
  } 
}
</script>

<style scoped>
.disable-form{
  background-color: #D9D9D9;
}

.add-button {
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

.delete-button {
  background-color: #e74c3c;
  color: white;
  width: 30px;
  height: 30px;
  /* padding: 6px 12px; */
  font-size: 14px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  /* margin-top: 10px; */
}

.delete-button:hover {
  background-color: #c0392b;
}

.container {
  padding: 20px;
  border: 2px solid #F1F0E8;
  border-radius: 16px;
  margin-bottom: 6px;
}
.repair-form {
  display: flex;
  justify-content: center;
  max-width: 100%;
  color: #333;
  margin: 0 auto;
  padding: 20px;
}

main {
  flex: 1;
  overflow: hidden;
  min-height: 100%;
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

.form-row.add{
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
  /* padding: 14px 28px; */
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
  margin-top: 20px;
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
