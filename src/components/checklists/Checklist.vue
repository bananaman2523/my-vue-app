<template>
    <div class="p-4">
        <table class="w-full border-collapse border border-gray-300">
            <thead>
                <tr class="bg-gray-200">
                    <th class="border border-gray-300 p-2 w-1/5">หมวดหมู่</th>
                    <th class="border border-gray-300 p-2 w-2/5">รายละเอียด</th>
                    <th class="border border-gray-300 p-2 w-1/6">สถานะ</th>
                    <th class="border border-gray-300 p-2 w-1/6">หมายเหตุ</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(group, index) in groupedChecklist" :key="index">
                    <tr v-for="(item, i) in group.items" :key="i">
                      <td v-if="i === 0" :rowspan="group.items.length"
                          class="border border-gray-300 p-2 font-semibold text-center align-top">
                          {{ group.category }}
                      </td>
                      <td class="border border-gray-300 p-2">{{ item.description }}</td>
                      <td class="border border-gray-300 p-2 text-center">
                          <select v-model="item.status"
                                  class="p-2 rounded w-full font-bold text-center"
                                  :class="statusClass(item.status)"
                                  :disabled="item.disabled">
                              <option value="รอตรวจสอบ" disabled>รอตรวจสอบ</option>
                              <option value="ผ่าน">ผ่าน</option>
                              <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                          </select>
                      </td>
                      <td class="border border-gray-300 p-2 italic text-gray-600 text-center">
                          <textarea v-model="item.note"
                                    class="w-full p-1 border rounded text-gray-700"
                                    :disabled="item.disabled"></textarea>
                      </td>
                  </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { directus } from "@/services/directus";
import { readItems, updateItem } from "@directus/sdk";
import { useRoute } from "vue-router";

const route = useRoute();
const formData = ref({ checklist: [] });

const fetchData = async () => {
  try {
    const delivery_sheet = await directus.request(
      readItems("stock", {
        fields: ["checklist","status","group_product"],
        filter: {
          id: {
            _eq: route.params.id
          }
        }
      })
    );
    
    if (delivery_sheet.length > 0) {
      const data = delivery_sheet[0];
      formData.value = {
        checklist: data.checklist || [],
        status: data.status || "",
        group_product: data.group_product || "",
      };
    }

    const filteredData = {
      ...formData.value,
      checklist: (formData.value.checklist || []).filter(item => !item.disabled)
    };


    if (formData.value.checklist.length > 0) {
      const hasNotPassed = filteredData.checklist.some(item => item.status === "ไม่ผ่าน");
      const allPassed = filteredData.checklist.every(item => item.status === "ผ่าน");
      
      if (formData.value.status !== 'รอเช็คก่อนส่ง' && formData.value.status !== 'ผ่าน' && formData.value.status !== 'ชำรุด') {
        if (hasNotPassed) {
          const payload = { status: 'ชำรุด' };
          await directus.request(updateItem("stock", route.params.id, payload));
        } else if (allPassed) {
          const payload = { status: 'พร้อมใช้งาน' };
          await directus.request(updateItem("stock", route.params.id, payload));
        } else {
          const payload = { status: 'รอตรวจสอบอุปกรณ์' };
          await directus.request(updateItem("stock", route.params.id, payload));
        }
      }
    }
    
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

fetchData();

const groupedChecklist = computed(() => {
  const groups = {};
  (formData.value.checklist || []).forEach(item => {
    if (!groups[item.category]) {
      groups[item.category] = { category: item.category, items: [] };
    }
    groups[item.category].items.push(item);
  });  
  
  return Object.values(groups);
});

const statusClass = (status) => {
  return {
    'bg-gray-500': status === "รอตรวจสอบ",
    'bg-green-500': status === "ผ่าน",
    'bg-red-500': status === "ไม่ผ่าน"
  };
};

const updateChecklist = async (value) => {
  try {
    const result = value;
    
    const payload = { checklist: result };
    await directus.request(updateItem("stock", route.params.id, payload));
  } catch (error) {
    console.error(`Error updating in stock:`, error);
  }
};

watch(
  () => formData.value.checklist,
  (newChecklist) => {
    updateChecklist(newChecklist);
  },
  { deep: true }
);
</script>


<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
}

.bg-red-100 {
    background-color: #fee2e2;
}

.bg-gray-500 {
    background-color: #6b7280;
}

.bg-green-500 {
    background-color: #16a34a;
}

.bg-red-500 {
    background-color: #dc2626;
}

.text-gray-600 {
    color: #4b5563;
}

.button-center {
    text-align: center;
}

select {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
}

</style>