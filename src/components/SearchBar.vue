<template>
  <div class="bg-white rounded-lg shadow-sm p-3 sm:p-4">
    <!-- 搜索框 -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="relative flex-1">
        <input
          :value="searchKeyword"
          type="text"
          placeholder="搜索停车场名称或地址..."
          class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          @input="handleInput"
          @keyup.enter="handleEnter"
        />
        <span
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"
        >
          🔍
        </span>
      </div>

      <!-- 筛选和视图切换 -->
      <div class="flex flex-wrap gap-3">
        <select
          :value="filterType"
          class="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white cursor-pointer transition-all text-sm sm:text-base"
          @change="handleFilterChange"
        >
          <option value="2">全部类型</option>
          <option value="0">公共停车场</option>
          <option value="1">共享车位</option>
        </select>

        <select
          :value="sortBy"
          class="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white cursor-pointer transition-all text-sm sm:text-base"
          @change="handleSortChange"
        >
          <option value="distance">距离最近</option>
          <option value="price">价格最低</option>
          <option value="available">空闲最多</option>
        </select>

        <button
          :class="[
            'px-4 py-3 rounded-lg font-medium transition-all text-sm sm:text-base',
            viewMode === 'map'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
          @click="handleViewToggle"
        >
          {{ viewMode === "list" ? "🗺️ 地图视图" : "📋 列表视图" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SearchBar",
  props: {
    searchKeyword: {
      type: String,
      default: "",
    },
    filterType: {
      type: String,
      default: "2",
    },
    sortBy: {
      type: String,
      default: "distance",
    },
    viewMode: {
      type: String,
      default: "list",
    },
  },
  methods: {
    handleInput(event: Event) {
      const target = event.target as HTMLInputElement;
      this.$emit("search", target.value);
    },
    /**
     * 处理回车键，立即触发搜索
     */
    handleEnter(event: KeyboardEvent) {
      const target = event.target as HTMLInputElement;
      this.$emit("search-enter", target.value);
    },
    handleFilterChange(event: Event) {
      const target = event.target as HTMLSelectElement;
      this.$emit("filter-change", target.value);
    },
    handleSortChange(event: Event) {
      const target = event.target as HTMLSelectElement;
      this.$emit("sort-change", target.value);
    },
    handleViewToggle() {
      this.$emit("view-toggle");
    },
  },
});
</script>
