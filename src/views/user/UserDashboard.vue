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
            智慧城市停车助手
          </h1>
        </div>
        <div class="flex items-center gap-2 md:gap-4">
          <!-- 用户头像 -->
          <el-avatar
            :src="userAvatar"
            :size="36"
            class="cursor-pointer"
            @click.native="goToUserCenter"
          >
            <i class="el-icon-user-solid"></i>
          </el-avatar>
          <span class="text-xs md:text-sm text-slate-600 hidden sm:inline">
            {{ userName || "用户" }}
          </span>
          <el-button
            type="text"
            size="small"
            @click="handleLogout"
            class="text-slate-700 hover:text-slate-900"
          >
            退出登录
          </el-button>
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
          'w-20 md:w-56 lg:w-64',
        ]"
      >
        <nav class="p-2 md:p-4 space-y-2">
          <router-link
            to="/home/index"
            @click.native="closeSidebarOnMobile"
            class="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-3 rounded-lg transition group"
            :class="
              $route.path === '/home/index' || $route.path === '/home'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            "
          >
            <span class="text-lg md:text-xl flex-shrink-0">🏠</span>
            <span class="hidden md:inline truncate">首页</span>
            <span class="md:hidden text-xs" title="首页">首页</span>
          </router-link>
          <router-link
            to="/home/publish"
            @click.native="closeSidebarOnMobile"
            class="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-3 rounded-lg transition group"
            :class="
              $route.path === '/home/publish'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            "
          >
            <span class="text-lg md:text-xl flex-shrink-0">➕</span>
            <span class="hidden md:inline truncate">发布共享车位</span>
            <span class="md:hidden text-xs" title="发布共享车位">发布</span>
          </router-link>
          <router-link
            to="/home/center"
            @click.native="closeSidebarOnMobile"
            class="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-3 rounded-lg transition group"
            :class="
              $route.path === '/home/center'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            "
          >
            <span class="text-lg md:text-xl flex-shrink-0">👤</span>
            <span class="hidden md:inline truncate">个人中心</span>
            <span class="md:hidden text-xs" title="个人中心">我的</span>
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
import { getUserInfo } from "@/api/uset";
import Vue from "vue";

export default Vue.extend({
  name: "UserDashboard",
  data() {
    return {
      userName: "",
      userAvatar: "", // 用户头像 URL
      isSidebarOpen: false, // 移动端侧边栏状态
    };
  },
  async mounted() {
    // 加载用户信息
    await this.loadUserInfo();
    // 监听窗口大小变化，在大屏幕上自动打开侧边栏
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    // 监听用户信息更新事件
    this.$root.$on("user-info-updated", this.loadUserInfo);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    // 移除事件监听
    this.$root.$off("user-info-updated", this.loadUserInfo);
  },
  methods: {
    /**
     * 加载用户信息（用于更新导航栏）
     */
    async loadUserInfo() {
      try {
        const res = await getUserInfo();
        if (res.data?.code === 200) {
          this.userName = res.data.data?.username || "";
          this.userAvatar =
            "http://localhost:8080" + res.data.data?.avatarUrl || "";
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
        // 不显示错误提示，避免在静默刷新时打扰用户
      }
    },
    handleLogout() {
      this.$confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 清除所有用户 token
          localStorage.removeItem("city_parking_token");
          // 提示退出成功
          this.$message.success("已退出登录");
          // 跳转到登录页
          this.$router.push("/");
        })
        .catch(() => {
          // 用户取消，不做任何操作
        });
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
    goToUserCenter() {
      // 如果当前已经在个人中心页面，则不跳转
      if (this.$route.path === "/home/center") {
        return;
      }
      this.$router.push("/home/center");
    },
  },
});
</script>
