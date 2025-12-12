<template>
  <div class="space-y-6">
    <!-- 返回按钮 -->
    <button
      @click="$router.back()"
      class="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
    >
      <span>←</span>
      <span>返回</span>
    </button>

    <!-- 停车场详情 -->
    <div v-if="parkingLot" class="space-y-6">
      <!-- 基本信息卡片 -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 class="text-2xl font-bold text-slate-900 mb-2">
                  {{ parkingLot.name }}
                </h2>
                <p class="text-slate-600 flex items-center gap-1">
                  <span>📍</span>
                  <span>{{ parkingLot.address }}</span>
                </p>
              </div>
              <span
                class="px-4 py-2 text-sm font-medium rounded-full flex-shrink-0"
                :class="{
                  'bg-green-100 text-green-700': parkingLot.availableSpots > 10,
                  'bg-yellow-100 text-yellow-700':
                    parkingLot.availableSpots > 0 &&
                    parkingLot.availableSpots <= 10,
                  'bg-red-100 text-red-700': parkingLot.availableSpots === 0,
                }"
              >
                {{
                  parkingLot.availableSpots > 10
                    ? "车位充足"
                    : parkingLot.availableSpots > 0
                    ? "车位紧张"
                    : "车位已满"
                }}
              </span>
            </div>

            <!-- 关键信息 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-slate-50 rounded-lg p-4">
                <p class="text-sm text-slate-600 mb-1">空闲车位</p>
                <p class="text-2xl font-bold text-emerald-600">
                  {{ parkingLot.availableSpots }}
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  / {{ parkingLot.totalSpots }} 总车位
                </p>
              </div>
              <div class="bg-slate-50 rounded-lg p-4">
                <p class="text-sm text-slate-600 mb-1">距离</p>
                <p class="text-2xl font-bold text-slate-900">
                  {{ parkingLot.distance }}km
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  预计{{ estimatedTime }}分钟
                </p>
              </div>
              <div class="bg-slate-50 rounded-lg p-4">
                <p class="text-sm text-slate-600 mb-1">价格</p>
                <p class="text-2xl font-bold text-slate-900">
                  ¥{{ parkingLot.price }}
                </p>
                <p class="text-xs text-slate-500 mt-1">每小时</p>
              </div>
              <div class="bg-slate-50 rounded-lg p-4">
                <p class="text-sm text-slate-600 mb-1">类型</p>
                <p class="text-lg font-semibold text-slate-900">
                  {{ parkingLot.type === "public" ? "公共停车场" : "共享车位" }}
                </p>
              </div>
            </div>

            <!-- 地图预览 -->
            <div
              class="bg-slate-100 rounded-lg h-64 flex items-center justify-center mb-6"
            >
              <div class="text-center text-slate-400">
                <p class="text-2xl mb-2">🗺️</p>
                <p class="text-sm">地图预览（可集成地图API）</p>
                <button
                  class="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
                  @click="openNavigation"
                >
                  开始导航
                </button>
              </div>
            </div>

            <!-- 详细信息 -->
            <div v-if="parkingLot.type === 'shared'" class="space-y-4">
              <h3 class="text-lg font-semibold text-slate-900">详细信息</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-slate-600 mb-1">车位类型</p>
                  <p class="text-slate-900">
                    {{ parkingLot.spotType || "室内车位" }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-slate-600 mb-1">车位大小</p>
                  <p class="text-slate-900">
                    {{ parkingLot.size || "中型车" }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-slate-600 mb-1">可用时间</p>
                  <p class="text-slate-900">
                    {{ parkingLot.startTime || "08:00" }} -
                    {{ parkingLot.endTime || "20:00" }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-slate-600 mb-1">联系方式</p>
                  <p class="text-slate-900">
                    {{ parkingLot.contact || "138****8888" }}
                  </p>
                </div>
              </div>
              <div v-if="parkingLot.description">
                <p class="text-sm text-slate-600 mb-1">备注说明</p>
                <p class="text-slate-900">{{ parkingLot.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 预约表单（共享车位） -->
      <div
        v-if="parkingLot.type === 'shared' && parkingLot.availableSpots > 0"
        class="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
      >
        <h3 class="text-lg font-semibold text-slate-900 mb-4">预约车位</h3>
        <form @submit.prevent="handleReserve" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                预约日期 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="reserveForm.date"
                type="date"
                :min="minDate"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                预约时间 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="reserveForm.time"
                type="time"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              预计停车时长（小时）
            </label>
            <input
              v-model.number="reserveForm.duration"
              type="number"
              min="1"
              max="24"
              value="2"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-emerald-800 font-medium">预计费用</p>
                <p class="text-2xl font-bold text-emerald-600 mt-1">
                  ¥{{ estimatedCost }}
                </p>
              </div>
              <button
                type="submit"
                :disabled="reserveLoading"
                class="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ reserveLoading ? "预约中..." : "确认预约" }}
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-4">
        <button
          @click="openNavigation"
          class="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
        >
          🗺️ 开始导航
        </button>
        <button
          v-if="parkingLot.type === 'shared' && parkingLot.availableSpots > 0"
          @click="scrollToReserve"
          class="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
        >
          📅 立即预约
        </button>
        <button
          @click="reportIssue"
          class="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
        >
          举报问题
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div
      v-else
      class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center"
    >
      <p class="text-slate-600">加载中...</p>
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
  distance: number;
  price: number;
  type: "public" | "shared";
  status: string;
  spotType?: string;
  size?: string;
  startTime?: string;
  endTime?: string;
  contact?: string;
  description?: string;
}

export default Vue.extend({
  name: "ParkingDetailView",
  data() {
    return {
      parkingLot: null as ParkingLot | null,
      reserveLoading: false,
      reserveForm: {
        date: "",
        time: "",
        duration: 2,
      },
      // 模拟数据
      mockParkingLots: [
        {
          id: 1,
          name: "市中心商业区停车场",
          address: "市中心商业街123号",
          totalSpots: 200,
          availableSpots: 45,
          distance: 0.5,
          price: 8,
          type: "public",
          status: "active",
        },
        {
          id: 2,
          name: "火车站停车场",
          address: "火车站广场",
          totalSpots: 150,
          availableSpots: 12,
          distance: 1.2,
          price: 6,
          type: "public",
          status: "active",
        },
        {
          id: 3,
          name: "医院停车场",
          address: "市第一医院",
          totalSpots: 100,
          availableSpots: 8,
          distance: 2.1,
          price: 5,
          type: "public",
          status: "active",
        },
        {
          id: 4,
          name: "购物中心停车场",
          address: "万达广场",
          totalSpots: 300,
          availableSpots: 89,
          distance: 1.8,
          price: 10,
          type: "public",
          status: "active",
        },
        {
          id: 5,
          name: "张先生私家车位",
          address: "阳光小区A栋地下车库",
          totalSpots: 1,
          availableSpots: 1,
          distance: 0.8,
          price: 4,
          type: "shared",
          status: "active",
          spotType: "室内车位",
          size: "中型车",
          startTime: "08:00",
          endTime: "20:00",
          contact: "138****8888",
          description: "车位位置便利，靠近小区入口，24小时监控。",
        },
        {
          id: 6,
          name: "李女士共享车位",
          address: "绿城花园3号楼",
          totalSpots: 1,
          availableSpots: 1,
          distance: 1.5,
          price: 5,
          type: "shared",
          status: "active",
          spotType: "室外车位",
          size: "小型车",
          startTime: "09:00",
          endTime: "18:00",
          contact: "139****9999",
          description: "室外停车位，适合临时停车。",
        },
      ] as ParkingLot[],
    };
  },
  computed: {
    minDate(): string {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },
    estimatedTime(): number {
      if (!this.parkingLot) return 0;
      // 假设平均速度30km/h
      return Math.round((this.parkingLot.distance / 30) * 60);
    },
    estimatedCost(): number {
      if (!this.parkingLot) return 0;
      return this.parkingLot.price * (this.reserveForm.duration || 2);
    },
  },
  mounted() {
    this.loadParkingLot();
    // 设置默认日期为今天
    this.reserveForm.date = this.minDate;
  },
  methods: {
    loadParkingLot() {
      const id = parseInt(this.$route.params.id);
      this.parkingLot =
        this.mockParkingLots.find((lot) => lot.id === id) || null;

      if (!this.parkingLot) {
        alert("未找到该停车场信息");
        this.$router.push("/home/index");
      }
    },
    handleReserve() {
      if (this.reserveLoading) return;

      this.reserveLoading = true;

      // TODO: 接入预约接口
      setTimeout(() => {
        this.reserveLoading = false;
        alert(
          `预约成功！\n日期：${this.reserveForm.date}\n时间：${this.reserveForm.time}\n费用：¥${this.estimatedCost}`
        );
        this.$router.push("/home/center");
      }, 1000);
    },
    openNavigation() {
      if (!this.parkingLot) return;
      // TODO: 集成导航API（如高德地图、百度地图）
      alert(`开始导航到：${this.parkingLot.address}`);
    },
    scrollToReserve() {
      const reserveForm = document.querySelector(
        ".bg-white.rounded-xl.shadow-sm"
      );
      if (reserveForm) {
        reserveForm.scrollIntoView({ behavior: "smooth" });
      }
    },
    reportIssue() {
      const reason = prompt("请描述您遇到的问题：");
      if (reason) {
        // TODO: 接入举报接口
        alert("举报已提交，我们会尽快处理！");
      }
    },
  },
});
</script>
