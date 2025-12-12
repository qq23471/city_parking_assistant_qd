<template>
  <div class="flex flex-col h-screen bg-slate-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-slate-200">
      <div class="px-4 md:px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            aria-label="切换菜单"
          >
            <span class="text-2xl">☰</span>
          </button>
          <h1 class="text-lg md:text-xl font-bold text-slate-900">
            智慧城市停车管理后台
          </h1>
        </div>
        <div class="flex items-center gap-2 md:gap-4">
          <span class="text-xs md:text-sm text-slate-600 hidden sm:inline">
            管理员：{{ adminName }}
          </span>
          <button
            @click="handleLogout"
            class="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            退出登录
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden relative">
      <!-- 移动端遮罩层 -->
      <div
        v-if="isSidebarOpen"
        @click="closeSidebar"
        class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
      ></div>

      <!-- 侧边栏 -->
      <aside
        :class="[
          'bg-white shadow-sm border-r border-slate-200 h-full overflow-y-auto transition-all duration-300 z-50',
          'fixed lg:static',
          isSidebarOpen ? 'left-0' : '-left-64 lg:left-0',
          // 响应式宽度：移动端80px，平板224px，桌面256px
          'w-20 md:w-56 lg:w-64',
        ]"
      >
        <nav class="p-2 md:p-4 space-y-2">
          <router-link
            to="/admin/dashboard"
            @click.native="closeSidebarOnMobile"
            class="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-3 rounded-lg transition group"
            :class="
              $route.path === '/admin/dashboard/overview'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            "
          >
            <span class="text-lg md:text-xl flex-shrink-0">📊</span>
            <span class="hidden md:inline truncate">数据概览</span>
            <span class="md:hidden text-xs" title="数据概览">概览</span>
          </router-link>
          <router-link
            to="/admin/dashboard/parking-lots"
            @click.native="closeSidebarOnMobile"
            class="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-3 rounded-lg transition group"
            :class="
              $route.path === '/admin/dashboard/parking-lots'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            "
          >
            <span class="text-lg md:text-xl flex-shrink-0">🅿️</span>
            <span class="hidden md:inline truncate">停车场管理</span>
            <span class="md:hidden text-xs" title="停车场管理">停车场</span>
          </router-link>
          <router-link
            to="/admin/dashboard/parking-status"
            @click.native="closeSidebarOnMobile"
            class="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-3 rounded-lg transition group"
            :class="
              $route.path === '/admin/dashboard/parking-status'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            "
          >
            <span class="text-lg md:text-xl flex-shrink-0">📍</span>
            <span class="hidden md:inline truncate">车位实时状态</span>
            <span class="md:hidden text-xs" title="车位实时状态">车位状态</span>
          </router-link>
          <router-link
            to="/admin/dashboard/shared-parking"
            @click.native="closeSidebarOnMobile"
            class="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-3 rounded-lg transition group"
            :class="
              $route.path === '/admin/dashboard/shared-parking'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            "
          >
            <span class="text-lg md:text-xl flex-shrink-0">🏠</span>
            <span class="hidden md:inline truncate">共享车位审核</span>
            <span class="md:hidden text-xs" title="共享车位审核">共享审核</span>
          </router-link>
          <router-link
            to="/admin/dashboard/reports"
            @click.native="closeSidebarOnMobile"
            class="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-3 rounded-lg transition group"
            :class="
              $route.path === '/admin/dashboard/reports'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            "
          >
            <span class="text-lg md:text-xl flex-shrink-0">📈</span>
            <span class="hidden md:inline truncate">用户举报</span>
            <span class="md:hidden text-xs" title="用户举报">举报</span>
          </router-link>
          <router-link
            to="/admin/dashboard/statistics"
            @click.native="closeSidebarOnMobile"
            class="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-3 rounded-lg transition group"
            :class="
              $route.path === '/admin/dashboard/statistics'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            "
          >
            <span class="text-lg md:text-xl flex-shrink-0">📊</span>
            <span class="hidden md:inline truncate">数据报表</span>
            <span class="md:hidden text-xs" title="数据报表">报表</span>
          </router-link>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 p-4 md:p-6 overflow-y-auto w-full lg:w-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AdminDashboard",
  data() {
    return {
      adminName: "管理员",
      isSidebarOpen: false, // 移动端侧边栏状态
    };
  },
  mounted() {
    // 从localStorage获取管理员信息
    const adminSession = localStorage.getItem("city_parking_admin_session");
    if (adminSession) {
      try {
        const parsed = JSON.parse(adminSession);
        this.adminName = parsed.account || "管理员";
      } catch (e) {
        // ignore
      }
    }
    // 监听窗口大小变化，在大屏幕上自动打开侧边栏
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleLogout() {
      if (confirm("确定要退出登录吗？")) {
        localStorage.removeItem("city_parking_admin_session");
        this.$router.push("/admin");
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    closeSidebarOnMobile() {
      // 在移动端点击菜单项后自动关闭侧边栏
      if (window.innerWidth < 1024) {
        this.isSidebarOpen = false;
      }
    },
    handleResize() {
      // 在大屏幕上自动打开侧边栏
      if (window.innerWidth >= 1024) {
        this.isSidebarOpen = true;
      } else {
        this.isSidebarOpen = false;
      }
    },
  },
});
</script>
