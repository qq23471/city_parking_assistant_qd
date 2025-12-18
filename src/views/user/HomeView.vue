<template>
  <div class="min-h-screen bg-gray-50 py-2 sm:py-3">
    <div class="max-w-[98%] mx-auto px-2 sm:px-4 lg:px-6">
      <!-- 搜索栏 -->
      <SearchBar
        :search-keyword="searchKeyword"
        :filter-type="filterType"
        :sort-by="orderBy"
        :view-mode="viewMode"
        @search="handleSearch"
        @search-enter="handleSearchEnter"
        @filter-change="handleFilter"
        @sort-change="handleSort"
        @view-toggle="toggleViewMode"
        class="mb-4"
      />

      <!-- 概览卡片 -->
      <StatsCards :statistics="statistics" class="mb-4" />

      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'">
        <!-- 加载骨架屏 -->
        <div
          v-if="loading"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <ParkingCardSkeleton v-for="n in pageSize" :key="n" />
        </div>

        <!-- 空状态 -->
        <div
          v-else-if="parkingLots.length === 0"
          class="bg-white rounded-lg shadow-sm p-12 text-center"
        >
          <p class="text-gray-500 text-lg">暂无停车场数据</p>
        </div>

        <!-- 停车场列表 -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4"
        >
          <ParkingCard
            v-for="parking in parkingLots"
            :key="parking.id"
            :parking="parking"
            :default-image="defaultImage"
            :button-loading="buttonLoading"
            @card-click="openDetailModal(parking)"
            @detail-click="openDetailModal(parking)"
            @reserve-click="openDetailModal(parking, 2)"
          />
        </div>

        <!-- 分页组件 -->
        <ParkingPagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @page-change="handlePageChange"
        />
      </div>

      <!-- 地图视图 -->
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <MapContainer />
      </div>
    </div>

    <!-- 停车场详情弹窗 -->
    <ParkingDetailModal
      :visible="showDetailModal"
      :parking-lot="selectedParkingLot"
      :initial-step="initialModalStep"
      @close="closeDetailModal"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { fetchParkingLots } from "@/api/ParkingLot";
import { ParkingLotVO } from "@/api/index";
import ParkingDetailModal from "@/components/ParkingDetailModal.vue";
import MapContainer from "@/components/MapContainer.vue";
import SearchBar from "@/components/SearchBar.vue";
import StatsCards from "@/components/StatsCards.vue";
import ParkingCard from "@/components/ParkingCard.vue";
import ParkingPagination from "@/components/ParkingPagination.vue";
import ParkingCardSkeleton from "@/components/ParkingCardSkeleton.vue";

interface Statistics {
  totalParkingLots: number;
  totalAvailableSpots: number;
  avgPrice: number;
  minDistance: number;
}

interface ParkingLotForModal {
  id: number;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  distance?: number;
  price: number;
  type: "public" | "shared";
  status: string;
  image?: string;
}

export default Vue.extend({
  name: "HomeView",
  components: {
    ParkingDetailModal,
    MapContainer,
    SearchBar,
    StatsCards,
    ParkingCard,
    ParkingPagination,
    ParkingCardSkeleton,
  },
  data() {
    return {
      // 搜索和筛选
      searchKeyword: "",
      filterType: "2",
      orderBy: "distance",
      viewMode: "list" as "list" | "map",

      // 数据
      parkingLots: [] as ParkingLotVO[],
      loading: false,
      buttonLoading: false,

      // 分页
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // 弹窗
      showDetailModal: false,
      selectedParkingLot: null as ParkingLotForModal | null,
      initialModalStep: 1,

      // 默认图片
      defaultImage: require("@/assets/OIP.webp"),

      // 搜索防抖定时器
      searchTimer: null as ReturnType<typeof setTimeout> | null,
    };
  },
  computed: {
    /**
     * 计算统计信息（基于当前页数据，实际应该从API获取全部统计）
     */
    statistics(): Statistics {
      // 注意：这里使用当前页数据计算，实际项目中应该从API获取全部统计信息
      if (this.parkingLots.length === 0) {
        return {
          totalParkingLots: this.total || 0,
          totalAvailableSpots: 0,
          avgPrice: 0,
          minDistance: 0,
        };
      }

      // 使用total作为总停车场数
      const totalParkingLots = this.total || this.parkingLots.length;
      const totalAvailableSpots = this.parkingLots.reduce(
        (sum, p) => sum + (p.availableSpaces || 0),
        0
      );
      const totalPrice = this.parkingLots.reduce(
        (sum, p) => sum + (p.pricePerHour || 0),
        0
      );
      const avgPrice =
        totalPrice > 0
          ? (totalPrice / this.parkingLots.length).toFixed(1)
          : "0";

      const distances = this.parkingLots
        .map((p) => p.distance || 999)
        .filter((d) => d < 999);
      const minDistance =
        distances.length > 0 ? Math.min(...distances).toFixed(1) : "0";

      return {
        totalParkingLots,
        totalAvailableSpots,
        avgPrice: parseFloat(avgPrice),
        minDistance: parseFloat(minDistance),
      };
    },
  },
  mounted() {
    this.loadParkingLots();
  },
  beforeDestroy() {
    // 清理搜索定时器
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  },
  methods: {
    /**
     * 加载停车场列表
     */
    async loadParkingLots() {
      this.loading = true;
      try {
        const params: Record<string, unknown> = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        };
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword;
        }
        params.type = parseInt(this.filterType);
        if (this.orderBy) {
          params.orderBy = this.orderBy;
        }

        const response = await fetchParkingLots(params);
        if (response.data.code === 200) {
          this.parkingLots = response.data.data.data || [];
          this.total = response.data.data.total || 0;
        } else {
          this.showToast(
            "error",
            response.data.message || "获取停车场列表失败"
          );
        }
      } catch (error) {
        console.error("加载停车场列表失败:", error);
        this.showToast("error", "加载停车场列表失败，请稍后重试");
      } finally {
        this.loading = false;
      }
    },

    /**
     * 处理搜索（实时联动，带防抖）
     */
    handleSearch(keyword: string) {
      this.searchKeyword = keyword;
      // 防抖处理
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(() => {
        this.currentPage = 1; // 搜索时重置到第一页
        this.loadParkingLots();
      }, 500);
    },

    /**
     * 处理回车键搜索（立即执行，无防抖）
     */
    handleSearchEnter(keyword: string) {
      this.searchKeyword = keyword;
      // 清除防抖定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
        this.searchTimer = null;
      }
      // 立即执行搜索
      this.currentPage = 1;
      this.loadParkingLots();
    },

    /**
     * 处理筛选（实时联动）
     */
    handleFilter(filterType: string) {
      this.filterType = filterType;
      this.currentPage = 1; // 筛选时重置到第一页
      this.loadParkingLots();
    },

    /**
     * 处理排序（实时联动）
     */
    handleSort(orderBy: string) {
      this.orderBy = orderBy;
      this.currentPage = 1; // 排序时重置到第一页
      this.loadParkingLots();
    },

    /**
     * 处理分页大小变化
     */
    handleSizeChange(newSize: number) {
      this.pageSize = newSize;
      this.currentPage = 1; // 改变每页数量时重置到第一页
      this.loadParkingLots();
    },

    /**
     * 处理页码变化
     */
    handlePageChange(newPage: number) {
      this.currentPage = newPage;
      this.loadParkingLots();
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    /**
     * 切换视图模式
     */
    toggleViewMode() {
      this.viewMode = this.viewMode === "list" ? "map" : "list";
    },

    /**
     * 打开详情弹窗
     */
    async openDetailModal(parking: ParkingLotVO, step = 1) {
      this.buttonLoading = true;
      try {
        // 转换数据格式以适配弹窗组件
        this.selectedParkingLot = {
          id: parking.id,
          name: parking.name,
          address: parking.address,
          totalSpots: parking.totalSpaces,
          availableSpots: parking.availableSpaces,
          distance: parking.distance,
          price: parking.pricePerHour,
          type: parking.type === 0 ? "public" : "shared",
          status: "active",
          image: parking.img,
        };
        this.initialModalStep = step;
        this.showDetailModal = true;
      } catch (error) {
        console.error("打开详情失败:", error);
      } finally {
        this.buttonLoading = false;
      }
    },

    /**
     * 关闭详情弹窗
     */
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedParkingLot = null;
    },

    /**
     * 显示Toast提示
     */
    showToast(type: "success" | "error" | "info", message: string) {
      if (type === "success") {
        this.$message.success(message);
      } else if (type === "error") {
        this.$message.error(message);
      } else {
        this.$message.info(message);
      }
    },
  },
});
</script>

<style scoped>
/* 确保Tailwind CSS类正常工作 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
