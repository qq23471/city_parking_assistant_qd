<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3"
  >
    <div
      class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-4 sm:p-5 border-l-4 border-blue-600"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">附近停车场</p>
          <p class="text-2xl font-bold text-gray-900">
            {{ statistics.totalParkingLots }}
          </p>
        </div>
        <div class="text-3xl">🅿️</div>
      </div>
    </div>

    <div
      class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-4 sm:p-5 border-l-4 border-green-500"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">总空闲车位</p>
          <p class="text-2xl font-bold text-gray-900">
            {{ statistics.totalAvailableSpots }}
          </p>
        </div>
        <div class="text-3xl">🚗</div>
      </div>
    </div>

    <div
      class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-4 sm:p-5 border-l-4 border-yellow-500"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">平均价格</p>
          <p class="text-2xl font-bold text-gray-900">
            ¥{{ statistics.avgPrice }}
          </p>
        </div>
        <div class="text-3xl">💰</div>
      </div>
    </div>

    <div
      class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-4 sm:p-5 border-l-4 border-purple-500"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">最近距离</p>
          <p class="text-2xl font-bold text-gray-900">
            {{ statistics.minDistance }}km
          </p>
        </div>
        <div class="text-3xl">📍</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface Statistics {
  totalParkingLots: number;
  totalAvailableSpots: number;
  avgPrice: number;
  minDistance: number;
}

export default Vue.extend({
  name: "StatsCards",
  props: {
    statistics: {
      type: Object as () => Statistics,
      required: true,
    },
  },
});
</script>
