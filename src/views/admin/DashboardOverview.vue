<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">数据概览</h2>
      <p class="text-sm text-slate-600 mt-1">实时监控停车系统运行状态</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">总停车场数</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">
              {{ stats.totalParkingLots }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
          >
            <span class="text-2xl">🅿️</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">总车位数</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">
              {{ stats.totalSpots }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center"
          >
            <span class="text-2xl">📍</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">占用率</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">
              {{ stats.occupancyRate }}%
            </p>
          </div>
          <div
            class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
          >
            <span class="text-2xl">📊</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">共享车位数</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">
              {{ stats.pendingShared }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
          >
            <span class="text-2xl">🏠</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">快速操作</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/admin/dashboard/parking-lots"
          class="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition"
        >
          <span class="text-2xl">➕</span>
          <div>
            <p class="font-medium text-slate-900">添加停车场</p>
            <p class="text-xs text-slate-600">新增停车场信息</p>
          </div>
        </router-link>
        <router-link
          to="/admin/dashboard/parking-status"
          class="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition"
        >
          <span class="text-2xl">✅</span>
          <div>
            <p class="font-medium text-slate-900">查看实时车位状态</p>
            <p class="text-xs text-slate-600">查看所有停车场车位状态</p>
          </div>
        </router-link>
        <router-link
          to="/admin/dashboard/reports"
          class="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition"
        >
          <span class="text-2xl">⚠️</span>
          <div>
            <p class="font-medium text-slate-900">处理举报</p>
            <p class="text-xs text-slate-600">查看用户举报</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 图表和系统状态 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 停车场类型分布 (饼图) -->
      <div
        class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-slate-200"
      >
        <h3 class="text-lg font-semibold text-slate-900 mb-4">
          停车场类型分布
        </h3>
        <div ref="typePieChart" class="h-64 w-full"></div>
      </div>

      <!-- 系统状态信息 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">系统健康状态</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600">后端接口服务</span>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700"
              >运行中</span
            >
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600">数据库连接</span>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700"
              >正常</span
            >
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600">实时推送服务</span>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700"
              >在线</span
            >
          </div>
          <div class="pt-4 border-t border-slate-100">
            <p class="text-xs text-slate-500 mb-2">系统负载 (CPU/内存)</p>
            <div class="w-full bg-slate-100 rounded-full h-2 mb-3">
              <div
                class="bg-blue-500 h-2 rounded-full"
                style="width: 24%"
              ></div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div
                class="bg-purple-500 h-2 rounded-full"
                style="width: 42%"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动与公告 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最近活动 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">最近活动</h3>
        <div class="space-y-3">
          <div
            v-for="(activity, index) in recentActivities"
            :key="index"
            class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition"
          >
            <span class="text-xl">{{ getActivityIcon(activity.type) }}</span>
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-900">
                {{ formatActivityTitle(activity) }}
              </p>
              <p class="text-xs text-slate-600">{{ activity.time }}</p>
            </div>
            <button
              class="text-xs text-blue-600 hover:underline"
              @click="viewActivity(activity)"
            >
              查看
            </button>
          </div>
          <div
            v-if="recentActivities.length === 0"
            class="py-10 text-center text-slate-400 text-sm"
          >
            暂无最近活动
          </div>
        </div>
      </div>

      <!-- 待办任务 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-900">待办任务</h3>
        </div>
        <div class="space-y-4">
          <!-- 紧急举报处理 -->
          <div
            class="flex items-start gap-3 p-3 rounded-lg border-l-4 border-red-400 bg-red-50"
          >
            <span class="text-xl">🛡️</span>
            <div>
              <p class="text-sm font-semibold text-red-800">紧急举报处理</p>
              <p class="text-xs text-red-700 mt-1">
                当前有 {{ stats.pendingReports }} 条举报待处理
              </p>
              <router-link
                to="/admin/dashboard/reports"
                class="text-xs text-red-800 font-bold mt-2 inline-block hover:underline"
                >去处理 →</router-link
              >
            </div>
          </div>

          <!-- 实时车位状态巡检 -->
          <div
            class="flex items-start gap-3 p-3 rounded-lg border-l-4 border-blue-400 bg-blue-50"
          >
            <span class="text-xl">📡</span>
            <div>
              <p class="text-sm font-semibold text-blue-800">
                查看车位实时状态
              </p>
              <p class="text-xs text-blue-700 mt-1">
                建议定期检查重点停车场的实时占用情况
              </p>
              <router-link
                to="/admin/dashboard/parking-status"
                class="text-xs text-blue-800 font-bold mt-2 inline-block hover:underline"
                >前往监控 →</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as echarts from "echarts";
import {
  getDashboardStats,
  getAdminParkingLots,
  getRecentActivities,
} from "@/api/Admin";
import { ActivityVO, DashboardStatsVO } from "@/api/index";

export default Vue.extend({
  name: "DashboardOverview",
  data() {
    return {
      loading: false,
      stats: {
        totalParkingLots: 0,
        totalSpots: 0,
        occupancyRate: 0,
        pendingShared: 0,
        pendingReports: 0,
      } as DashboardStatsVO,
      recentActivities: [] as ActivityVO[],
      charts: {
        typePie: null as echarts.ECharts | null,
      },
    };
  },
  mounted() {
    this.initCharts();
    this.loadData();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    this.charts.typePie?.dispose();
  },
  methods: {
    /**
     * 加载数据
     */
    async loadData() {
      this.loading = true;
      try {
        await Promise.all([
          this.loadStats(),
          this.loadActivities(),
          this.loadParkingTypeDistribution(),
        ]);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 获取图标
     */
    getActivityIcon(type: string): string {
      const icons: Record<string, string> = {
        report: "⚠️",
        parking: "🅿️",
        shared: "🏠",
        audit: "✅",
        system: "🚀",
      };
      return icons[type] || "📝";
    },

    /**
     * 格式化活动标题
     * 将活动标题中的英文举报类型代码转换为中文
     */
    formatActivityTitle(activity: ActivityVO): string {
      let title = activity.title;

      // 如果是举报类型的活动，需要将标题中的英文类型代码转换为中文
      if (activity.type === "report") {
        // 定义举报类型代码到中文的映射
        const reportTypeMap: Record<string, string> = {
          false_info: "虚假信息",
          price_fraud: "价格欺诈",
          service_issue: "服务问题",
          safety_issue: "安全隐患",
          other: "其他问题",
        };

        // 遍历所有举报类型，将标题中的英文代码替换为中文
        Object.keys(reportTypeMap).forEach((code) => {
          const regex = new RegExp(code, "g");
          title = title.replace(regex, reportTypeMap[code]);
        });
      }

      return title;
    },

    /**
     * 加载活动记录
     */
    async loadActivities() {
      try {
        const res = await getRecentActivities();
        if (res.data?.code === 200) {
          this.recentActivities = res.data.data || [];
        }
      } catch (error) {
        console.error("加载活动失败:", error);
      }
    },

    /**
     * 初始化图表
     */
    initCharts() {
      this.charts.typePie = echarts.init(
        this.$refs.typePieChart as HTMLElement
      );
    },

    /**
     * 处理窗口缩放
     */
    handleResize() {
      this.charts.typePie?.resize();
    },

    /**
     * 加载停车场类型分布数据
     */
    async loadParkingTypeDistribution() {
      try {
        const res = await getAdminParkingLots({ pageNum: 1, pageSize: 1000 });
        if (res.data?.code === 200) {
          const lots = res.data.data.data;
          const publicCount = lots.filter((l) => l.type === 0).length;
          const businessCount = lots.filter((l) => l.type === 1).length;

          this.charts.typePie?.setOption({
            tooltip: { trigger: "item" },
            legend: { bottom: "0", left: "center" },
            series: [
              {
                name: "停车场类型",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: "#fff",
                  borderWidth: 2,
                },
                label: { show: false, position: "center" },
                emphasis: {
                  label: { show: true, fontSize: "20", fontWeight: "bold" },
                },
                labelLine: { show: false },
                data: [
                  {
                    value: publicCount,
                    name: "公共停车场",
                    itemStyle: { color: "#10b981" },
                  },
                  {
                    value: businessCount,
                    name: "共享停车场",
                    itemStyle: { color: "#3b82f6" },
                  },
                ],
              },
            ],
          });
        }
      } catch (error) {
        console.error("加载停车场分布失败:", error);
      }
    },

    /**
     * 加载统计数据
     */
    async loadStats() {
      try {
        const res = await getDashboardStats();
        if (res.data?.code === 200) {
          this.stats = res.data.data || {
            totalParkingLots: 0,
            totalSpots: 0,
            occupancyRate: 0,
            pendingShared: 0,
            pendingReports: 0,
          };
        } else {
          this.$message.error(res.data?.message || "获取统计数据失败");
        }
      } catch (error) {
        console.error("加载统计数据失败:", error);
        this.$message.error("获取统计数据失败，请稍后重试");
      }
    },

    /**
     * 查看活动详情
     * 根据活动类型跳转到相应的管理页面
     */
    viewActivity(activity: ActivityVO) {
      try {
        // 根据活动类型跳转到相应的页面
        if (activity.type === "report") {
          {
            this.$router.push("/admin/dashboard/reports");
          }
        } else {
          this.$router.push("/admin/dashboard/parking-lots");
        }
      } catch (error) {
        console.error("跳转失败:", error);
        this.$message.error("跳转失败，请稍后重试");
      }
    },
  },
});
</script>
