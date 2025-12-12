import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ForgotPasswordView from "@/views/ForgotPasswordView.vue";
import AdminLoginView from "@/views/AdminLoginView.vue";
import AdminDashboard from "@/views/admin/AdminDashboard.vue";
import DashboardOverview from "@/views/admin/DashboardOverview.vue";
import ParkingLotsManagement from "@/views/admin/ParkingLotsManagement.vue";
import ParkingStatusMonitor from "@/views/admin/ParkingStatusMonitor.vue";
import SharedParkingReview from "@/views/admin/SharedParkingReview.vue";
import UserReportsManagement from "@/views/admin/UserReportsManagement.vue";
import StatisticsReport from "@/views/admin/StatisticsReport.vue";
import UserDashboard from "@/views/user/UserDashboard.vue";
import HomeView from "@/views/user/HomeView.vue";
import PublishParkingView from "@/views/user/PublishParkingView.vue";
import ParkingDetailView from "@/views/user/ParkingDetailView.vue";
import UserCenterView from "@/views/user/UserCenterView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/forgot",
    name: "ForgotPassword",
    component: ForgotPasswordView,
  },
  {
    path: "/admin",
    name: "AdminLogin",
    component: AdminLoginView,
  },
  {
    path: "/admin/dashboard",
    component: AdminDashboard,
    redirect: "/admin/dashboard/overview",
    children: [
      {
        path: "overview",
        name: "DashboardOverview",
        component: DashboardOverview,
      },
      {
        path: "parking-lots",
        name: "ParkingLotsManagement",
        component: ParkingLotsManagement,
      },
      {
        path: "parking-status",
        name: "ParkingStatusMonitor",
        component: ParkingStatusMonitor,
      },
      {
        path: "shared-parking",
        name: "SharedParkingReview",
        component: SharedParkingReview,
      },
      {
        path: "reports",
        name: "UserReportsManagement",
        component: UserReportsManagement,
      },
      {
        path: "statistics",
        name: "StatisticsReport",
        component: StatisticsReport,
      },
    ],
  },
  {
    path: "/home",
    component: UserDashboard,
    redirect: "/home/index",
    children: [
      {
        path: "index",
        name: "Home",
        component: HomeView,
      },
      {
        path: "publish",
        name: "PublishParking",
        component: PublishParkingView,
      },
      {
        path: "center",
        name: "UserCenter",
        component: UserCenterView,
      },
    ],
  },
  {
    path: "/parking/:id",
    name: "ParkingDetail",
    component: ParkingDetailView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
