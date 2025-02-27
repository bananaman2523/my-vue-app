import { createRouter, createWebHistory } from "vue-router";
import updateReceiptPage from "@/components/updateReceipt.vue";
import listPage from "@/components/List.vue";
import detailPage from "@/components/Detail.vue";
import receiptProductPage from "@/components/receiptProduct.vue";
import ListStockPage from "@/components/ListStock.vue";
import listPreparationPage from "@/components/listPreparation.vue";
import DocumentPreparationPage from "@/components/DocumentPreparation.vue";
import LoginPage from "@/components/Login.vue";
import productOrderPage from "@/components/productOrder.vue";
import stickerOrderPage from "@/components/stickerOrder.vue";
import receiptDetailsPage from "@/components/receiptDetails.vue";
import DocumentPreparationDetailPage from "@/components/DocumentPreparationDetail.vue";
import ListStockDefectivePage from "@/components/ListStockDefective.vue";
import BackupStockPage from "@/components/BackupStock.vue";
import DocumentShippingPage from "@/components/DocumentShipping.vue";
import DocumentShippingDetailPage from "@/components/DocumentShippingDetail.vue";
const routes = [
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
    path: "/receiptDetail/:id",
    name: "receiptDetail",
    component: receiptDetailsPage,
  },
  {
    path: "/listStock",
    name: "listStock",
    component: ListStockPage,
  },
  {
    path: "/documentPreparation",
    name: "documentPreparation",
    component: DocumentPreparationPage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/productOrder",
    name: "productOrder",
    component: productOrderPage,
  },
  {
    path: "/stickerOrder",
    name: "stickerOrder",
    component: stickerOrderPage,
  },
  {
    path: "/listPreparation",
    name: "listPreparation",
    component: listPreparationPage,
  },
  {
    path: "/documentPreparationDetail/:id",
    name: "documentPreparationDetail",
    component: DocumentPreparationDetailPage
  },
  {
    path: "/listStockDefective",
    name: "listStockDefective",
    component: ListStockDefectivePage
  },
  {
    path: "/backupStock",
    name: "backupStock",
    component: BackupStockPage
  },
  {
    path: "/documentShipping",
    name: "documentShipping",
    component: DocumentShippingPage
  },
  {
    path: "/documentShippingDetail/:id",
    name: "documentShippingDetail",
    component: DocumentShippingDetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
