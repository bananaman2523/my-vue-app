import { createRouter, createWebHistory } from "vue-router";
import ActivitiesGrid from "@/components/Activities.vue";
import ActivityDetails from "@/components/ActivityDetails.vue";

const routes = [
  {
    path: "/",
    name: "Activities",
    component: ActivitiesGrid,
  },
  {
    path: "/activity/:id",
    name: "ActivityDetails",
    component: ActivityDetails,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
