<template>
  <div
    class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border border-gray-100 overflow-hidden"
    @click="handleCardClick"
  >
    <!-- 图片区域 -->
    <div class="relative h-40 sm:h-48 md:h-52 overflow-hidden">
      <img
        :src="parking.img || defaultImage"
        :alt="parking.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <!-- 类型标签 -->
      <div
        :class="[
          'absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white',
          parking.type === 0 ? 'bg-blue-600' : 'bg-green-500',
        ]"
      >
        {{ parking.type === 0 ? "公共" : "共享" }}
      </div>
      <!-- 状态标签 -->
      <div
        :class="[
          'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white',
          getStatusClass(),
        ]"
      >
        {{ getStatusText() }}
      </div>
    </div>

    <!-- 信息区域 -->
    <div class="p-3 sm:p-4">
      <h3
        class="font-bold text-base sm:text-lg text-gray-900 mb-1.5 line-clamp-1"
      >
        {{ parking.name }}
      </h3>
      <p class="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-1">
        📍 {{ parking.address }}
      </p>

      <!-- 详细信息 -->
      <div class="flex flex-wrap gap-2 sm:gap-3 mb-3">
        <div class="flex items-baseline gap-0.5 sm:gap-1">
          <span class="text-xs text-gray-500">空闲</span>
          <span class="text-base sm:text-lg font-bold text-green-500">
            {{ parking.availableSpaces }}
          </span>
          <span class="text-xs text-gray-500">/{{ parking.totalSpaces }}</span>
        </div>
        <div class="flex items-baseline gap-0.5 sm:gap-1">
          <span class="text-xs text-gray-500">价格</span>
          <span class="text-base sm:text-lg font-bold text-blue-600">
            ¥{{ parking.pricePerHour }}
          </span>
          <span class="text-xs text-gray-500">/h</span>
        </div>
        <div
          v-if="parking.distance"
          class="flex items-baseline gap-0.5 sm:gap-1"
        >
          <span class="text-xs text-gray-500">距离</span>
          <span class="text-sm sm:text-base font-semibold text-gray-700">
            {{ parking.distance }}
          </span>
          <span class="text-xs text-gray-500">km</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-2">
        <button
          :disabled="buttonLoading"
          :class="[
            'flex-1 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all',
            buttonLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
          ]"
          @click.stop="handleDetailClick"
        >
          <span v-if="buttonLoading">加载中...</span>
          <span v-else>查看详情</span>
        </button>
        <button
          v-if="parking.type === 1 && parking.availableSpaces > 0"
          :disabled="buttonLoading"
          :class="[
            'flex-1 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all',
            buttonLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
          ]"
          @click.stop="handleReserveClick"
        >
          <span v-if="buttonLoading">加载中...</span>
          <span v-else>立即预约</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ParkingLotVO } from "@/api/index";

export default Vue.extend({
  name: "ParkingCard",
  props: {
    parking: {
      type: Object as () => ParkingLotVO,
      required: true,
    },
    defaultImage: {
      type: String,
      default: require("@/assets/OIP.webp"),
    },
    buttonLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getStatusClass(): string {
      const rate =
        this.parking.totalSpaces > 0
          ? this.parking.availableSpaces / this.parking.totalSpaces
          : 0;
      if (rate >= 0.5) return "bg-green-500";
      if (rate > 0) return "bg-yellow-500";
      return "bg-red-500";
    },
    getStatusText(): string {
      const rate =
        this.parking.totalSpaces > 0
          ? this.parking.availableSpaces / this.parking.totalSpaces
          : 0;
      if (rate >= 0.5) return "充足";
      if (rate > 0) return "紧张";
      return "已满";
    },
    handleImageError(event: Event) {
      const img = event.target as HTMLImageElement;
      img.src = this.defaultImage;
    },
    handleCardClick() {
      this.$emit("card-click", this.parking);
    },
    handleDetailClick() {
      this.$emit("detail-click", this.parking);
    },
    handleReserveClick() {
      this.$emit("reserve-click", this.parking);
    },
  },
});
</script>
