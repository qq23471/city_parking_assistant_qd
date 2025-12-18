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
import UserReportsManagement from "@/views/admin/UserReportsManagement.vue";
import StatisticsReport from "@/views/admin/StatisticsReport.vue";
import UserDashboard from "@/views/user/UserDashboard.vue";
import HomeView from "@/views/user/HomeView.vue";
import PublishParkingView from "@/views/user/PublishParkingView.vue";
import UserCenterView from "@/views/user/UserCenterView.vue";
import AddParkingHistoryView from "@/views/user/AddParkingHistoryView.vue";

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
      {
        path: "add-history",
        name: "AddParkingHistory",
        component: AddParkingHistoryView,
      },
    ],
  },
];
const router = new VueRouter({
  routes,
});

// 路由守卫：检查用户认证状态
router.beforeEach((to, from, next) => {
  const userToken = localStorage.getItem("city_parking_token");

  // 公共页面（无需认证）
  const publicPages = ["/", "/register", "/forgot", "/admin"];
  const isPublicPage = publicPages.includes(to.path);
  console.log(to.path);
  // 如果访问公共页面且已登录，重定向到对应主页
  if (isPublicPage) {
    if (to.path === "/" && userToken) {
      // 已登录用户访问登录页，重定向到用户主页
      next("/home/index");
      return;
    }
    if (to.path === "/admin" && userToken) {
      // 已登录管理员访问管理员登录页，重定向到管理员后台
      next("/admin/dashboard");
      return;
    }
    // 公共页面，直接放行
    next();
    return;
  }
  if (userToken) {
    next();
    return;
  }

  next("/");
});

export default router;
