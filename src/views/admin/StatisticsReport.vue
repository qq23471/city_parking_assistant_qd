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
          :disabled="loading"
          class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {{ loading ? "加载中..." : "刷新数据" }}
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
        <p class="text-xs text-slate-500 mt-1">实时数据</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <p class="text-sm text-slate-600">平均占用率</p>
        <p class="text-3xl font-bold text-slate-900 mt-2">
          {{ stats.avgOccupancy }}%
        </p>
        <p class="text-xs text-slate-500 mt-1">实时数据</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <p class="text-sm text-slate-600">总收入</p>
        <p class="text-3xl font-bold text-slate-900 mt-2">
          ¥{{ stats.totalRevenue }}
        </p>
        <p class="text-xs text-slate-500 mt-1">实时数据</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <p class="text-sm text-slate-600">共享车位数</p>
        <p class="text-3xl font-bold text-slate-900 mt-2">
          {{ stats.sharedCount }}
        </p>
        <p class="text-xs text-slate-500 mt-1">实时数据</p>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 每日停车流量 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">每日停车流量</h3>
        <div ref="dailyFlowChart" class="h-80 w-full"></div>
      </div>

      <!-- 热门时段统计 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">热门时段统计</h3>
        <div ref="peakHoursChart" class="h-80 w-full"></div>
      </div>
    </div>

    <!-- 车位使用率趋势 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">车位使用率趋势</h3>
      <div ref="occupancyTrendChart" class="h-80 w-full"></div>
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
import * as echarts from "echarts";
import {
  getStatistics,
  getDailyFlow,
  getPeakHours,
  getOccupancyTrend,
  getParkingLotRank,
} from "@/api/Admin";
import {
  StatisticsVO,
  DailyFlowVO,
  PeakHourVO,
  OccupancyTrendVO,
  ParkingLotRankVO,
  StatisticsQueryDto,
} from "@/api/index";

export default Vue.extend({
  name: "StatisticsReport",
  data() {
    return {
      loading: false,
      timeRange: "month",
      stats: {
        totalParkings: 0,
        avgOccupancy: 0,
        totalRevenue: 0,
        sharedCount: 0,
      } as StatisticsVO,
      dailyFlow: [] as DailyFlowVO[],
      peakHours: [] as PeakHourVO[],
      occupancyTrend: [] as OccupancyTrendVO[],
      topParkingLots: [] as ParkingLotRankVO[],
      charts: {
        dailyFlow: null as echarts.ECharts | null,
        peakHours: null as echarts.ECharts | null,
        occupancyTrend: null as echarts.ECharts | null,
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
    // 销毁图表实例
    Object.values(this.charts).forEach((chart) => {
      chart?.dispose();
    });
  },
  watch: {
    timeRange() {
      this.loadData();
    },
  },
  methods: {
    /**
     * 初始化图表
     */
    initCharts() {
      this.charts.dailyFlow = echarts.init(
        this.$refs.dailyFlowChart as HTMLElement
      );
      this.charts.peakHours = echarts.init(
        this.$refs.peakHoursChart as HTMLElement
      );
      this.charts.occupancyTrend = echarts.init(
        this.$refs.occupancyTrendChart as HTMLElement
      );
    },

    /**
     * 处理窗口缩放
     */
    handleResize() {
      Object.values(this.charts).forEach((chart) => {
        chart?.resize();
      });
    },

    /**
     * 加载所有统计数据
     */
    async loadData() {
      this.loading = true;
      try {
        const params: StatisticsQueryDto = {
          timeRange: this.timeRange,
        };
        await Promise.all([
          this.loadStatistics(params),
          this.loadDailyFlow(params),
          this.loadPeakHours(params),
          this.loadOccupancyTrend(params),
          this.loadParkingLotRank(params),
        ]);
        this.updateCharts();
      } catch (error) {
        console.error("加载统计数据失败:", error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 更新图表数据
     */
    updateCharts() {
      // 每日停车流量图表
      if (this.charts.dailyFlow) {
        this.charts.dailyFlow.setOption({
          tooltip: { trigger: "axis" },
          grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
          xAxis: {
            type: "category",
            data: this.dailyFlow.map((item) => item.date),
            axisLabel: {
              formatter: (value: string) => value.split("-").slice(1).join("/"),
            },
          },
          yAxis: { type: "value", name: "次数" },
          series: [
            {
              name: "停车次数",
              type: "bar",
              data: this.dailyFlow.map((item) => item.count),
              itemStyle: { color: "#10b981" },
              barWidth: "60%",
            },
          ],
        });
      }

      // 热门时段图表
      if (this.charts.peakHours) {
        this.charts.peakHours.setOption({
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
          xAxis: { type: "value", name: "次数" },
          yAxis: {
            type: "category",
            data: this.peakHours.map((item) => item.time).reverse(),
          },
          series: [
            {
              name: "停车次数",
              type: "bar",
              data: this.peakHours.map((item) => item.count).reverse(),
              itemStyle: { color: "#10b981" },
            },
          ],
        });
      }

      // 使用率趋势图表
      if (this.charts.occupancyTrend) {
        this.charts.occupancyTrend.setOption({
          tooltip: { trigger: "axis" },
          grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
          xAxis: {
            type: "category",
            data: this.occupancyTrend.map((item) => item.period),
          },
          yAxis: {
            type: "value",
            name: "使用率",
            axisLabel: { formatter: "{value}%" },
          },
          series: [
            {
              name: "使用率",
              type: "line",
              data: this.occupancyTrend.map((item) => item.rate),
              smooth: true,
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(59, 130, 246, 0.5)" },
                  { offset: 1, color: "rgba(59, 130, 246, 0)" },
                ]),
              },
              itemStyle: { color: "#3b82f6" },
            },
          ],
        });
      }
    },

    /**
     * 加载统计数据
     */
    async loadStatistics(params: StatisticsQueryDto) {
      try {
        const res = await getStatistics(params);
        if (res.data?.code === 200) {
          this.stats = res.data.data || {
            totalParkings: 0,
            avgOccupancy: 0,
            totalRevenue: 0,
            sharedCount: 0,
          };
        }
      } catch (error) {
        console.error("加载统计数据失败:", error);
      }
    },
    /**
     * 加载每日停车流量
     */
    async loadDailyFlow(params: StatisticsQueryDto) {
      try {
        const res = await getDailyFlow(params);
        if (res.data?.code === 200) {
          this.dailyFlow = res.data.data || [];
        }
      } catch (error) {
        console.error("加载每日流量失败:", error);
      }
    },
    /**
     * 加载热门时段统计
     */
    async loadPeakHours(params: StatisticsQueryDto) {
      try {
        const res = await getPeakHours(params);
        if (res.data?.code === 200) {
          this.peakHours = res.data.data || [];
        }
      } catch (error) {
        console.error("加载热门时段失败:", error);
      }
    },
    /**
     * 加载车位使用率趋势
     */
    async loadOccupancyTrend(params: StatisticsQueryDto) {
      try {
        const res = await getOccupancyTrend(params);
        if (res.data?.code === 200) {
          this.occupancyTrend = res.data.data || [];
        }
      } catch (error) {
        console.error("加载使用率趋势失败:", error);
      }
    },
    /**
     * 加载停车场使用排行
     */
    async loadParkingLotRank(params: StatisticsQueryDto) {
      try {
        const res = await getParkingLotRank(params);
        if (res.data?.code === 200) {
          this.topParkingLots = res.data.data || [];
        }
      } catch (error) {
        console.error("加载停车场排行失败:", error);
      }
    },
    /**
     * 刷新数据
     */
    async refreshData() {
      await this.loadData();
      this.$message.success("数据已刷新");
    },
  },
});
</script>
