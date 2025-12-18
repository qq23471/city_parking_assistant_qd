<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">车位实时状态</h2>
      <p class="text-sm text-slate-600 mt-1">
        实时监控所有停车场的车位占用情况
      </p>
    </div>

    <!-- 实时状态卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="lot in parkingLots"
        :key="lot.id"
        class="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-900">{{ lot.name }}</h3>
          <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="{
              'bg-green-100 text-green-700': lot.status === 'active',
              'bg-yellow-100 text-yellow-700': lot.status === 'maintenance',
            }"
          >
            {{ lot.status === "active" ? "运营中" : "维护中" }}
          </span>
        </div>
        <p class="text-sm text-slate-600 mb-4">{{ lot.address }}</p>

        <!-- 车位状态可视化 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600">总车位数</span>
            <span class="font-semibold text-slate-900">{{
              lot.totalSpots
            }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600">空闲车位</span>
            <span class="font-semibold text-emerald-600">{{
              lot.availableSpots
            }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600">已占用</span>
            <span class="font-semibold text-red-600">{{
              lot.totalSpots - lot.availableSpots
            }}</span>
          </div>

          <!-- 进度条 -->
          <div class="mt-4">
            <div
              class="flex items-center justify-between text-xs text-slate-600 mb-1"
            >
              <span>占用率</span>
              <span>{{ lot.occupancyRate.toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div
                class="bg-emerald-600 h-2 rounded-full transition-all"
                :style="{
                  width: `${lot.occupancyRate}%`,
                }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 车位网格预览 -->
        <div class="mt-4 pt-4 border-t border-slate-200">
          <p class="text-xs text-slate-600 mb-2">车位分布预览</p>
          <div class="grid grid-cols-10 gap-1">
            <div
              v-for="(spot, index) in getSpotPreview(lot)"
              :key="index"
              class="w-full aspect-square rounded"
              :class="spot ? 'bg-red-500' : 'bg-emerald-500'"
              :title="spot ? '已占用' : '空闲'"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 刷新按钮 -->
    <div class="flex justify-end">
      <button
        @click="refreshStatus"
        :disabled="refreshing"
        class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
      >
        {{ refreshing ? "刷新中..." : "🔄 刷新状态" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getParkingStatus } from "@/api/Admin";
import { ParkingStatusVO } from "@/api/index";

export default Vue.extend({
  name: "ParkingStatusMonitor",
  data() {
    return {
      refreshing: false,
      refreshTimer: null as number | null,
      parkingLots: [] as ParkingStatusVO[],
    };
  },
  mounted() {
    this.loadParkingStatus();
    // 每30秒自动刷新一次
    this.startAutoRefresh();
  },
  beforeDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  },
  methods: {
    /**
     * 加载停车场实时状态
     */
    async loadParkingStatus() {
      try {
        const res = await getParkingStatus();
        if (res.data?.code === 200) {
          this.parkingLots = res.data.data || [];
        } else {
          this.$message.error(res.data?.message || "获取停车场状态失败");
        }
      } catch (error) {
        console.error("加载停车场状态失败:", error);
        this.$message.error("获取停车场状态失败，请稍后重试");
      }
    },
    /**
     * 获取车位预览
     */
    getSpotPreview(lot: ParkingStatusVO): boolean[] {
      // 生成100个车位的预览（最多显示100个）
      const previewCount = Math.min(100, lot.totalSpots);
      const occupiedCount = lot.totalSpots - lot.availableSpots;
      const occupiedInPreview = Math.round(
        (occupiedCount / lot.totalSpots) * previewCount
      );
      const spots: boolean[] = [];
      for (let i = 0; i < previewCount; i++) {
        spots.push(i < occupiedInPreview);
      }
      // 随机打乱
      return spots.sort(() => Math.random() - 0.5);
    },
    /**
     * 刷新状态
     */
    async refreshStatus() {
      this.refreshing = true;
      try {
        await this.loadParkingStatus();
      } finally {
        this.refreshing = false;
      }
    },
    /**
     * 开始自动刷新
     */
    startAutoRefresh() {
      // 每30秒自动刷新一次
      this.refreshTimer = setInterval(() => {
        this.refreshStatus();
      }, 30000);
    },
  },
});
</script>
