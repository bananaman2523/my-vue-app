import { createRouter, createWebHistory } from "vue-router";
import addReceiptPage from "@/components/addReceipt.vue";
import updateReceiptPage from "@/components/updateReceipt.vue";
import listPage from "@/components/List.vue";
import detailPage from "@/components/Detail.vue";
import addProductRequestPage from "@/components/addProductRequest.vue";

const routes = [
  {
    path: "/addReceipt",
    name: "addReceipt",
    component: addReceiptPage,
  },
  {
    path: "/addProductRequest",
    name: "addProductRequest",
    component: addProductRequestPage,
  },
  {
    path: "/updateReceipt/:id",
    name: "updateReceipt",
    component: updateReceiptPage,
  },
  {
    path: "/list",
    name: "list",
    component: listPage,
  },
  {
    path: "/detail/:id",
    name: "detail",
    component: detailPage,
  },
  {
    path: "/",
    component: listPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
