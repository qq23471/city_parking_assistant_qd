<template>
  <div class="space-y-6">
    <!-- 搜索栏 -->
    <div class="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 min-w-0">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索停车场名称或地址..."
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div class="flex gap-4 flex-shrink-0">
          <select
            v-model="filterType"
            class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-40"
          >
            <option value="">全部类型</option>
            <option value="public">公共停车场</option>
            <option value="shared">共享车位</option>
          </select>
          <select
            v-model="sortBy"
            class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-40"
          >
            <option value="distance">距离最近</option>
            <option value="price">价格最低</option>
            <option value="available">空闲最多</option>
          </select>
          <button
            @click="toggleMapView"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            {{ showMap ? "列表视图" : "地图视图" }}
          </button>
        </div>
      </div>
    </div>

    <!-- 地图视图 -->
    <div
      v-if="showMap"
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div class="h-96 bg-slate-100 flex items-center justify-center relative">
        <!-- 模拟地图区域 -->
        <div class="text-center text-slate-400">
          <p class="text-lg mb-2">🗺️</p>
          <p class="text-sm">地图视图（可集成地图API）</p>
          <p class="text-xs mt-2">绿色标记：空闲车位 | 红色标记：已占用</p>
        </div>
        <!-- 模拟车位标记 -->
        <div
          v-for="lot in filteredParkingLots"
          :key="lot.id"
          class="absolute"
          :style="{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }"
        >
          <div
            class="w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-150"
            :class="
              lot.availableSpots > 0
                ? 'bg-green-500 ring-2 ring-green-200'
                : 'bg-red-500 ring-2 ring-red-200'
            "
            :title="lot.name"
            @click="viewDetail(lot)"
          ></div>
        </div>
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-else class="space-y-4">
      <!-- 统计信息 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
          <p class="text-sm text-slate-600">附近停车场</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">
            {{ filteredParkingLots.length }}
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
          <p class="text-sm text-slate-600">总空闲车位</p>
          <p class="text-2xl font-bold text-emerald-600 mt-1">
            {{ totalAvailableSpots }}
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
          <p class="text-sm text-slate-600">平均价格</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">
            ¥{{ averagePrice }}/小时
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
          <p class="text-sm text-slate-600">最近距离</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">
            {{ nearestDistance }}km
          </p>
        </div>
      </div>

      <!-- 停车场列表 -->
      <div class="space-y-4">
        <div
          v-for="lot in filteredParkingLots"
          :key="lot.id"
          class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition cursor-pointer"
          @click="viewDetail(lot)"
        >
          <div class="flex flex-col md:flex-row gap-4">
            <!-- 左侧信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-slate-900 mb-1">
                    {{ lot.name }}
                  </h3>
                  <p
                    class="text-sm text-slate-600 mb-3 flex items-center gap-1"
                  >
                    <span>📍</span>
                    <span class="truncate">{{ lot.address }}</span>
                  </p>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <span class="text-slate-600">
                      <span class="font-medium text-slate-900">{{
                        lot.availableSpots
                      }}</span>
                      / {{ lot.totalSpots }} 空闲
                    </span>
                    <span class="text-slate-600">
                      距离：
                      <span class="font-medium text-slate-900"
                        >{{ lot.distance }}km</span
                      >
                    </span>
                    <span class="text-slate-600">
                      价格：
                      <span class="font-medium text-emerald-600"
                        >¥{{ lot.price }}/小时</span
                      >
                    </span>
                  </div>
                </div>
                <div class="flex-shrink-0">
                  <span
                    class="px-3 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-green-100 text-green-700': lot.availableSpots > 10,
                      'bg-yellow-100 text-yellow-700':
                        lot.availableSpots > 0 && lot.availableSpots <= 10,
                      'bg-red-100 text-red-700': lot.availableSpots === 0,
                    }"
                  >
                    {{
                      lot.availableSpots > 10
                        ? "充足"
                        : lot.availableSpots > 0
                        ? "紧张"
                        : "已满"
                    }}
                  </span>
                </div>
              </div>
            </div>
            <!-- 右侧操作 -->
            <div class="flex flex-col gap-2 flex-shrink-0">
              <button
                @click.stop="viewDetail(lot)"
                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm whitespace-nowrap"
              >
                查看详情
              </button>
              <button
                v-if="lot.type === 'shared'"
                @click.stop="reserveParking(lot)"
                class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm whitespace-nowrap"
              >
                立即预约
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div
          v-if="filteredParkingLots.length === 0"
          class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center"
        >
          <p class="text-4xl mb-4">🔍</p>
          <p class="text-lg font-medium text-slate-900 mb-2">
            未找到匹配的停车场
          </p>
          <p class="text-sm text-slate-600">请尝试调整搜索条件</p>
        </div>
      </div>
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
}

export default Vue.extend({
  name: "HomeView",
  data() {
    return {
      searchQuery: "",
      filterType: "",
      sortBy: "distance",
      showMap: false,
      parkingLots: [
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
        },
      ] as ParkingLot[],
    };
  },
  computed: {
    filteredParkingLots(): ParkingLot[] {
      let filtered = this.parkingLots;

      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (lot) =>
            lot.name.toLowerCase().includes(query) ||
            lot.address.toLowerCase().includes(query)
        );
      }

      // 类型过滤
      if (this.filterType) {
        filtered = filtered.filter((lot) => lot.type === this.filterType);
      }

      // 排序
      const sorted = [...filtered];
      if (this.sortBy === "distance") {
        sorted.sort((a, b) => a.distance - b.distance);
      } else if (this.sortBy === "price") {
        sorted.sort((a, b) => a.price - b.price);
      } else if (this.sortBy === "available") {
        sorted.sort((a, b) => b.availableSpots - a.availableSpots);
      }

      return sorted;
    },
    totalAvailableSpots(): number {
      return this.filteredParkingLots.reduce(
        (sum, lot) => sum + lot.availableSpots,
        0
      );
    },
    averagePrice(): number {
      if (this.filteredParkingLots.length === 0) return 0;
      const sum = this.filteredParkingLots.reduce(
        (sum, lot) => sum + lot.price,
        0
      );
      return Math.round((sum / this.filteredParkingLots.length) * 10) / 10;
    },
    nearestDistance(): number {
      if (this.filteredParkingLots.length === 0) return 0;
      const nearest = Math.min(
        ...this.filteredParkingLots.map((lot) => lot.distance)
      );
      return Math.round(nearest * 10) / 10;
    },
  },
  methods: {
    toggleMapView() {
      this.showMap = !this.showMap;
    },
    viewDetail(lot: ParkingLot) {
      this.$router.push({
        name: "ParkingDetail",
        params: { id: lot.id.toString() },
      });
    },
    reserveParking(lot: ParkingLot) {
      this.$router.push({
        name: "ParkingDetail",
        params: { id: lot.id.toString() },
        query: { action: "reserve" },
      });
    },
  },
});
</script>
