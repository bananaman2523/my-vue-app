import { createRouter, createWebHistory } from "vue-router";
import ActivitiesGrid from "@/components/Activities.vue";
import ActivityDetails from "@/components/ActivityDetails.vue";
import AboutUs from "@/components/AboutUs.vue";
import receiptDoc from "@/components/receiptDoc.vue";
import addReceiptPage from "@/components/addReceipt.vue";

const routes = [
  {
    path: "/activity",
    name: "Activities",
    component: ActivitiesGrid,
  },
  {
    path: "/activity/:id",
    name: "ActivityDetails",
    component: ActivityDetails,
    props: true,
  },
  {
    path: "/about-us",
    name: "AboutUs",
    component: AboutUs,
  },
  {
    path: "/receipt",
    name: "receiptDoc",
    component: receiptDoc,
  },
  {
    path: "/addReceipt",
    name: "addReceipt",
    component: addReceiptPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
