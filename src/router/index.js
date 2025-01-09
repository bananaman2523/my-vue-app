import { createRouter, createWebHistory } from "vue-router";
import addReceiptPage from "@/components/addReceipt.vue";
import updateReceiptPage from "@/components/updateReceipt.vue";
import listPage from "@/components/List.vue";

const routes = [
  {
    path: "/addReceipt",
    name: "addReceipt",
    component: addReceiptPage,
  },
  {
    path: "/updateReceipt",
    name: "updateReceipt",
    component: updateReceiptPage,
  },

  {
    path: "/list",
    name: "list",
    component: listPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
