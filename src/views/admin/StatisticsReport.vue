<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">数据报表</h2>
      <p class="text-sm text-slate-600 mt-1">
        车位使用率、热门时段等数据统计分析
      </p>
    </div>

    <!-- 时间范围选择 -->
    <div class="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
      <div class="flex gap-4 items-center">
        <label class="text-sm font-medium text-slate-700">时间范围：</label>
        <select
          v-model="timeRange"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="today">今天</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="year">本年</option>
        </select>
        <button
          @click="refreshData"
          class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          刷新数据
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <p class="text-sm text-slate-600">总停车次数</p>
        <p class="text-3xl font-bold text-slate-900 mt-2">
          {{ stats.totalParkings }}
        </p>
        <p class="text-xs text-emerald-600 mt-1">↑ 12% 较上期</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <p class="text-sm text-slate-600">平均占用率</p>
        <p class="text-3xl font-bold text-slate-900 mt-2">
          {{ stats.avgOccupancy }}%
        </p>
        <p class="text-xs text-emerald-600 mt-1">↑ 5% 较上期</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <p class="text-sm text-slate-600">总收入</p>
        <p class="text-3xl font-bold text-slate-900 mt-2">
          ¥{{ stats.totalRevenue }}
        </p>
        <p class="text-xs text-emerald-600 mt-1">↑ 18% 较上期</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <p class="text-sm text-slate-600">共享车位数</p>
        <p class="text-3xl font-bold text-slate-900 mt-2">
          {{ stats.sharedCount }}
        </p>
        <p class="text-xs text-emerald-600 mt-1">↑ 8% 较上期</p>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 每日停车流量 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">每日停车流量</h3>
        <div class="h-64 flex items-end justify-between gap-2">
          <div
            v-for="(value, index) in dailyFlow"
            :key="index"
            class="flex-1 flex flex-col items-center"
          >
            <div
              class="w-full bg-emerald-500 rounded-t transition-all hover:bg-emerald-600"
              :style="{ height: `${(value / maxFlow) * 100}%` }"
              :title="`${value}次`"
            ></div>
            <span class="text-xs text-slate-600 mt-2">{{ index + 1 }}日</span>
          </div>
        </div>
      </div>

      <!-- 热门时段统计 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">热门时段统计</h3>
        <div class="space-y-3">
          <div
            v-for="(period, index) in peakHours"
            :key="index"
            class="flex items-center gap-3"
          >
            <span class="text-sm text-slate-600 w-20">{{ period.time }}</span>
            <div class="flex-1 bg-slate-200 rounded-full h-4">
              <div
                class="bg-emerald-500 h-4 rounded-full transition-all"
                :style="{ width: `${(period.count / maxPeak) * 100}%` }"
              ></div>
            </div>
            <span class="text-sm font-medium text-slate-900 w-12 text-right">{{
              period.count
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 车位使用率趋势 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">车位使用率趋势</h3>
      <div class="h-64 flex items-end justify-between gap-2">
        <div
          v-for="(rate, index) in occupancyTrend"
          :key="index"
          class="flex-1 flex flex-col items-center"
        >
          <div
            class="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
            :style="{ height: `${rate}%` }"
            :title="`${rate}%`"
          ></div>
          <span class="text-xs text-slate-600 mt-2">{{ index + 1 }}周</span>
        </div>
      </div>
    </div>

    <!-- 停车场排行 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">停车场使用排行</h3>
      <div class="space-y-3">
        <div
          v-for="(lot, index) in topParkingLots"
          :key="index"
          class="flex items-center gap-4 p-3 rounded-lg bg-slate-50"
        >
          <span
            class="w-8 h-8 flex items-center justify-center rounded-full font-bold text-white"
            :class="{
              'bg-yellow-500': index === 0,
              'bg-slate-400': index === 1,
              'bg-orange-500': index === 2,
              'bg-slate-300': index > 2,
            }"
          >
            {{ index + 1 }}
          </span>
          <div class="flex-1">
            <p class="font-medium text-slate-900">{{ lot.name }}</p>
            <p class="text-xs text-slate-600">{{ lot.address }}</p>
          </div>
          <div class="text-right">
            <p class="font-semibold text-slate-900">{{ lot.usage }}次</p>
            <p class="text-xs text-slate-600">使用次数</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface ParkingLot {
  name: string;
  address: string;
  usage: number;
}

export default Vue.extend({
  name: "StatisticsReport",
  data() {
    return {
      timeRange: "month",
      stats: {
        totalParkings: 12450,
        avgOccupancy: 68,
        totalRevenue: 186750,
        sharedCount: 156,
      },
      dailyFlow: [
        120, 145, 98, 167, 189, 203, 178, 156, 134, 145, 167, 189, 203, 178,
      ],
      peakHours: [
        { time: "08:00-10:00", count: 450 },
        { time: "10:00-12:00", count: 320 },
        { time: "12:00-14:00", count: 380 },
        { time: "14:00-16:00", count: 290 },
        { time: "16:00-18:00", count: 520 },
        { time: "18:00-20:00", count: 480 },
        { time: "20:00-22:00", count: 210 },
      ],
      occupancyTrend: [65, 68, 72, 70, 75, 73, 68, 70],
      topParkingLots: [
        {
          name: "市中心商业区停车场",
          address: "市中心商业街123号",
          usage: 2340,
        },
        { name: "购物中心停车场", address: "万达广场", usage: 1890 },
        { name: "火车站停车场", address: "火车站广场", usage: 1670 },
        { name: "医院停车场", address: "市第一医院", usage: 1450 },
        { name: "学校停车场", address: "市第一中学", usage: 980 },
      ] as ParkingLot[],
    };
  },
  computed: {
    maxFlow(): number {
      return Math.max(...this.dailyFlow);
    },
    maxPeak(): number {
      return Math.max(...this.peakHours.map((p) => p.count));
    },
  },
  methods: {
    refreshData() {
      // 模拟数据刷新
      this.stats.totalParkings += Math.floor(Math.random() * 100);
      this.stats.avgOccupancy = 65 + Math.floor(Math.random() * 15);
      this.stats.totalRevenue += Math.floor(Math.random() * 1000);
      alert("数据已刷新");
    },
  },
});
</script>
