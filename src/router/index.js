import { createRouter, createWebHistory } from "vue-router";
import updateReceiptPage from "@/components/updateReceipt.vue";
import listPage from "@/components/List.vue";
import detailPage from "@/components/Detail.vue";
import receiptProductPage from "@/components/receiptProduct.vue";
import ListStockPage from "@/components/ListStock.vue";
import listPreparationPage from "@/components/ListPreparation.vue";
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
import ServiceFeeListPage from "@/components/ServiceFeeList.vue";
import ServiceFeeListDetailPage from "@/components/ServiceFeeListDetail.vue";
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
    path: "/ReceiptProduct",
    name: "receiptProduct",
    component: receiptProductPage,
  },
  {
    path: "/ReceiptDetail/:id",
    name: "receiptDetail",
    component: receiptDetailsPage,
  },
  {
    path: "/ListStock",
    name: "listStock",
    component: ListStockPage,
  },
  {
    path: "/DocumentPreparation",
    name: "documentPreparation",
    component: DocumentPreparationPage,
  },
  {
    path: "/Login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/ProductOrder",
    name: "productOrder",
    component: productOrderPage,
  },
  {
    path: "/StickerOrder",
    name: "stickerOrder",
    component: stickerOrderPage,
  },
  {
    path: "/ListPreparation",
    name: "listPreparation",
    component: listPreparationPage,
  },
  {
    path: "/DocumentPreparationDetail/:id",
    name: "documentPreparationDetail",
    component: DocumentPreparationDetailPage
  },
  {
    path: "/ListStockDefective",
    name: "listStockDefective",
    component: ListStockDefectivePage
  },
  {
    path: "/BackupStock",
    name: "backupStock",
    component: BackupStockPage
  },
  {
    path: "/DocumentShipping",
    name: "documentShipping",
    component: DocumentShippingPage
  },
  {
    path: "/DocumentShippingDetail/:id",
    name: "documentShippingDetail",
    component: DocumentShippingDetailPage,
  },
  {
    path: "/ServiceFeeList/",
    name: "serviceFeeList",
    component: ServiceFeeListPage,
  },
  {
    path: "/ServiceFeeListDetail/:id",
    name: "serviceFeeListDetail",
    component: ServiceFeeListDetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
