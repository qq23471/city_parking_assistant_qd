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
              <span
                >{{
                  Math.round(
                    ((lot.totalSpots - lot.availableSpots) / lot.totalSpots) *
                      100
                  )
                }}%</span
              >
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div
                class="bg-emerald-600 h-2 rounded-full transition-all"
                :style="{
                  width: `${
                    ((lot.totalSpots - lot.availableSpots) / lot.totalSpots) *
                    100
                  }%`,
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

interface ParkingLot {
  id: number;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  status: string;
}

export default Vue.extend({
  name: "ParkingStatusMonitor",
  data() {
    return {
      refreshing: false,
      refreshTimer: null as number | null,
      parkingLots: [
        {
          id: 1,
          name: "市中心商业区停车场",
          address: "市中心商业街123号",
          totalSpots: 200,
          availableSpots: 45,
          status: "active",
        },
        {
          id: 2,
          name: "火车站停车场",
          address: "火车站广场",
          totalSpots: 150,
          availableSpots: 12,
          status: "active",
        },
        {
          id: 3,
          name: "医院停车场",
          address: "市第一医院",
          totalSpots: 100,
          availableSpots: 8,
          status: "active",
        },
        {
          id: 4,
          name: "购物中心停车场",
          address: "万达广场",
          totalSpots: 300,
          availableSpots: 89,
          status: "active",
        },
        {
          id: 5,
          name: "学校停车场",
          address: "市第一中学",
          totalSpots: 80,
          availableSpots: 25,
          status: "active",
        },
        {
          id: 6,
          name: "公园停车场",
          address: "中央公园",
          totalSpots: 120,
          availableSpots: 67,
          status: "active",
        },
      ] as ParkingLot[],
    };
  },
  mounted() {
    // 模拟定时刷新
    this.startAutoRefresh();
  },
  beforeDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  },
  methods: {
    getSpotPreview(lot: ParkingLot): boolean[] {
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
    refreshStatus() {
      this.refreshing = true;
      // 模拟API调用，随机更新车位数量
      setTimeout(() => {
        this.parkingLots = this.parkingLots.map((lot) => ({
          ...lot,
          availableSpots: Math.max(
            0,
            Math.min(
              lot.totalSpots,
              lot.availableSpots + Math.floor(Math.random() * 10) - 5
            )
          ),
        }));
        this.refreshing = false;
      }, 1000);
    },
    startAutoRefresh() {
      // 每30秒自动刷新一次
      this.refreshTimer = setInterval(() => {
        this.refreshStatus();
      }, 30000);
    },
  },
});
</script>
