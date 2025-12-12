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
            <p class="text-sm text-slate-600">待审核共享车位</p>
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
          to="/admin/dashboard/shared-parking"
          class="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition"
        >
          <span class="text-2xl">✅</span>
          <div>
            <p class="font-medium text-slate-900">审核共享车位</p>
            <p class="text-xs text-slate-600">处理待审核申请</p>
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

    <!-- 最近活动 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">最近活动</h3>
      <div class="space-y-3">
        <div
          v-for="(activity, index) in recentActivities"
          :key="index"
          class="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
        >
          <span class="text-xl">{{ activity.icon }}</span>
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-900">
              {{ activity.title }}
            </p>
            <p class="text-xs text-slate-600">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "DashboardOverview",
  data() {
    return {
      stats: {
        totalParkingLots: 24,
        totalSpots: 1860,
        occupancyRate: 68,
        pendingShared: 5,
      },
      recentActivities: [
        {
          icon: "🅿️",
          title: "新增停车场：市中心商业区停车场",
          time: "2小时前",
        },
        {
          icon: "✅",
          title: "审核通过：用户张三的共享车位申请",
          time: "5小时前",
        },
        {
          icon: "⚠️",
          title: "处理举报：用户李四举报虚假车位信息",
          time: "1天前",
        },
        {
          icon: "📊",
          title: "数据更新：车位占用率统计已更新",
          time: "1天前",
        },
      ],
    };
  },
});
</script>
