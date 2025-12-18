<template>
  <div
    v-if="total > 0"
    class="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex justify-center"
  >
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ParkingPagination",
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleSizeChange(newSize: number) {
      this.$emit("size-change", newSize);
    },
    handlePageChange(newPage: number) {
      this.$emit("page-change", newPage);
    },
  },
});
</script>
