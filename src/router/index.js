import { createRouter, createWebHistory } from "vue-router";
import addReceiptPage from "@/components/addReceipt.vue";
import updateReceiptPage from "@/components/updateReceipt.vue";
import listPage from "@/components/List.vue";
import detailPage from "@/components/Detail.vue";
import addProductRequestPage from "@/components/addProductRequest.vue";
import receiptProductPage from "@/components/receiptProduct.vue";
import ListStockPage from "@/components/ListStock.vue";
import DocumentPreparationPage from "@/components/DocumentPreparation.vue";
import LoginPage from "@/components/Login.vue";

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
  },
  {
    path: "/receiptProduct",
    name: "receiptProduct",
    component: receiptProductPage,
  },
  {
    path: "/listStock",
    name: "listStock",
    component: ListStockPage,
  },
  {
    path: "/DocumentPreparation",
    name: "DocumentPreparation",
    component: DocumentPreparationPage,
  },
  {
    path: "/login",
    component: LoginPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
