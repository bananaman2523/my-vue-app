<template>
  <div class="repair-form">
    <main>
      <div v-for="(form, index) in forms" :key="index" class="container">
        <form @submit.prevent="submitForm">
          <div style="display: contents;">
            <div class="form-row">
              <label>รหัสสินค้า Office Design <label style="color: red;">*</label></label>
              <input type="text" v-model="form.productCode" required/>
            </div>
            <div class="form-row">
              <label>ชื่อสินค้า Office Design <label style="color: red;">*</label></label>
              <input type="text" v-model="form.productName" required/>
            </div>
            <div style="display: flex;justify-content: end;">
              <button type="button" @click="removeForm(index)" class="delete-button">X</button>
            </div>
            <div class="form-row">
              <label>หมวดหมู่สินค้า <label style="color: red;">*</label></label>
              <select v-model="form.selectedCategory">
                <option value="">Select a category</option>
                <option v-for="product in data.product" :key="product.productGroup" :value="product.productGroup">
                  {{ product.productGroup }}
                </option>
              </select>
            </div>            
            <div class="form-row">
              <label>model <label style="color: red;">*</label></label>
              <select v-model="form.selectedModel" :disabled="!form.selectedCategory">
                <option value="">Select a model</option>
                <option v-for="model in models(form.selectedCategory)" :key="model" :value="model">
                  {{ model }}
                </option>
              </select>
            </div>
            <div class="form-row">
              <label>S/N <label style="color: red;">*</label></label>
              <input type="text" v-model="form.serialNumber" />
            </div>
          </div>
          
        </form>
      </div>
      <button @click="addForm" class="add-button">+ Add New</button>
    </main>
  </div>
</template>

<script setup>
import { ref, computed , watch} from 'vue';
import { directus } from "@/services/directus";
import { createItem, readItems } from "@directus/sdk";

const emit = defineEmits(['update:products']);
const data = ref({
  product: [],
});

const forms = ref([
  { productCode: '', productName: '', selectedCategory: '', selectedModel: '', serialNumber: '' }
]);

const models = (category) => {
  const productGroup = category ? data.value.product.find(item => item.productGroup === category) : null;
  return category ? productGroup.productCodes : [];
};

const addForm = () => {
  forms.value.push({ productCode: '', productName: '', selectedCategory: '', selectedModel: '', serialNumber: '' });
};

const resetForm = () => {
  forms.value = [{ productCode: '', productName: '', selectedCategory: '', selectedModel: '', serialNumber: '' }];
};

const removeForm = (index) => {
  forms.value.splice(index, 1);
};

watch(forms, (newForms) => {
  emit('update:products', newForms);
}, { deep: true });

function simplifyInput(input) {
  const result = {
    product: [],
  };

  input.forEach(item => {
    if (item.product) {
      item.product.forEach(productItem => {
        const productCodes = productItem.product_list.map(product => product.product_list_id.product_code);
        result.product.push({
          productGroup: productItem.product_group,
          productCodes: productCodes
        });
      });
    }
  });

  return result;
}

const fetchData = async () => {
  try {
    const response = await directus.request(
      readItems("config", {
        fields: [
          "product.product_group",
          "product.product_list.product_list_id.product_code",
        ],
      })
    );
    Object.assign(data.value, simplifyInput(response));

  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

fetchData();
</script>

<style scoped>
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
