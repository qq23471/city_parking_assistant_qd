<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
  >
    <!-- 图片骨架 -->
    <div class="h-40 sm:h-48 md:h-52 bg-gray-200 animate-pulse"></div>

    <!-- 内容骨架 -->
    <div class="p-3 sm:p-4">
      <!-- 标题 -->
      <div class="h-6 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
      <!-- 地址 -->
      <div class="h-4 bg-gray-200 rounded animate-pulse mb-4 w-full"></div>

      <!-- 详细信息 -->
      <div class="flex flex-wrap gap-4 mb-4">
        <div class="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
        <div class="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
        <div class="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
      </div>

      <!-- 按钮 -->
      <div class="flex gap-3">
        <div class="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
        <div class="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ParkingCardSkeleton",
});
</script>
