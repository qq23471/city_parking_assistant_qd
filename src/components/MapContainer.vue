<template>
  <div class="map-wrapper">
    <div id="container"></div>
    <div id="route-panel" class="route-panel"></div>
    <div id="search-panel" class="search-panel"></div>

    <div class="map-overlay top-left">
      <div class="overlay-card">
        <p class="title">当前城市</p>
        <p class="value">{{ cityName || "定位中..." }}</p>
        <p class="sub" v-if="cityAdcode">区域代码：{{ cityAdcode }}</p>
      </div>
    </div>

    <div class="map-overlay bottom-right">
      <button class="action-btn" @click="initCitySearch">重新定位城市</button>
    </div>

    <div v-if="loading" class="loading-mask">
      <div class="spinner"></div>
      <p>地图加载中...</p>
    </div>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";

// 高德地图配置常量
const AMAP_CONFIG = {
  securityJsCode: "05506941baf5bbbe50a6a0a2728195dd",
  key: "4b7bb3519b7b675a6bcb0e6111da58fa",
  version: "2.0",
  plugins: [
    "AMap.Scale",
    "AMap.CitySearch",
    "AMap.PlaceSearch",
    "AMap.Driving",
  ],
};

// 地图初始化配置
const MAP_CONFIG = {
  viewMode: "3D",
  zoom: 11,
};

// 地点搜索配置
const PLACE_SEARCH_CONFIG = {
  type: "停车场",
  pageSize: 20,
  autoFitView: false,
};

// 路线规划配置
const DRIVING_CONFIG = {
  policy: 10, // 躲避拥堵，路程较短，尽量缩短时间
};

/**
 * 地图容器组件
 * 功能：初始化高德地图、搜索停车场、提供路线规划
 */
export default {
  name: "MapContainer",
  data() {
    return {
      map: null,
      loading: true,
      cityName: "",
      cityAdcode: "",
      parkingMarkers: [],
      placeSearch: null,
      driving: null,
      searchResults: [],
    };
  },
  mounted() {
    this.initAMap();
  },
  beforeDestroy() {
    this.cleanup();
  },
  methods: {
    /**
     * 初始化高德地图
     */
    initAMap() {
      window._AMapSecurityConfig = {
        securityJsCode: AMAP_CONFIG.securityJsCode,
      };

      AMapLoader.load({
        key: AMAP_CONFIG.key,
        version: AMAP_CONFIG.version,
        plugins: AMAP_CONFIG.plugins,
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", MAP_CONFIG);
          this.map.addControl(new AMap.Scale());
          this.initCitySearch();
        })
        .catch((error) => {
          console.error("地图加载失败:", error);
          this.loading = false;
        });
    },

    /**
     * 搜索当前城市的停车场
     * @param {string} cityName - 城市名称
     */
    searchParkings(cityName) {
      if (!this.map || !window.AMap) return;

      this.clearMarkers();

      if (!this.placeSearch) {
        this.placeSearch = new window.AMap.PlaceSearch({
          ...PLACE_SEARCH_CONFIG,
          city: cityName || this.cityName,
          map: this.map,
          panel: "search-panel",
        });
      } else {
        this.placeSearch.setCity(cityName || this.cityName);
      }

      this.placeSearch.search("停车场", (status, result) => {
        if (status === "complete" && result?.poiList?.pois?.length) {
          this.searchResults = result.poiList.pois;
          this.attachNavigationClickEvents();
        } else {
          console.warn("停车场搜索无结果", result);
        }
      });
    },

    /**
     * 为搜索结果面板添加点击事件，实现导航功能
     */
    attachNavigationClickEvents() {
      this.$nextTick(() => {
        const panel = document.getElementById("search-panel");
        if (!panel) return;

        // 使用事件委托优化性能
        const handleClick = (e) => {
          const item = e.target.closest(".poibox");
          if (!item) return;

          e.stopPropagation();
          const index = Array.from(panel.querySelectorAll(".poibox")).indexOf(
            item
          );
          if (this.searchResults[index]) {
            this.openNavigation(this.searchResults[index]);
          }
        };

        // 移除旧的事件监听器
        panel.removeEventListener("click", this._navigationClickHandler);
        // 保存引用以便后续清理
        this._navigationClickHandler = handleClick;
        panel.addEventListener("click", handleClick);

        // 设置鼠标样式
        const items = panel.querySelectorAll(".poibox");
        items.forEach((item) => {
          item.style.cursor = "pointer";
        });
      });
    },

    /**
     * 打开驾车路线规划
     * @param {Object} poi - 停车场POI对象
     */
    openNavigation(poi) {
      if (!poi || !poi.location) {
        console.warn("无效的目的地坐标");
        return;
      }

      if (!window.AMap || !window.AMap.Driving) {
        console.warn("Driving服务不可用");
        return;
      }

      if (this.driving) {
        this.driving.clear();
      }

      this.driving = new window.AMap.Driving({
        map: this.map,
        panel: "route-panel",
        policy: DRIVING_CONFIG.policy,
      });

      const points = [
        { keyword: this.cityName, city: this.cityName },
        { keyword: poi.name, city: this.cityName },
      ];
      this.driving.search(points, (status, result) => {
        if (status === "complete" && result?.routes?.length) {
          console.log("路线规划成功，共找到", result.routes.length, "条路线");
        } else {
          console.warn("路线规划失败", status, result);
        }
      });
    },

    /**
     * 初始化城市定位
     */
    initCitySearch() {
      if (!this.map || !window.AMap) return;

      this.loading = true;

      const citySearch = new window.AMap.CitySearch();
      citySearch.getLocalCity((status, result) => {
        this.loading = false;

        if (status === "complete" && result.info === "OK") {
          this.cityName = result.city || "";
          this.cityAdcode = result.adcode || "";
          if (result.bounds) {
            this.map.setBounds(result.bounds);
          } else if (result.city) {
            this.map.setCity(result.city);
          }

          this.map.setZoom(12);
          this.searchParkings(result.city);
        } else {
          console.warn("CitySearch 定位城市失败:", result);
        }
      });
    },

    /**
     * 清理标记点
     */
    clearMarkers() {
      this.parkingMarkers.forEach((marker) => {
        this.map.remove(marker);
      });
      this.parkingMarkers = [];
    },

    /**
     * 清理资源
     */
    cleanup() {
      if (this.map) {
        this.map.destroy();
        this.map = null;
      }

      const panel = document.getElementById("search-panel");
      if (panel && this._navigationClickHandler) {
        panel.removeEventListener("click", this._navigationClickHandler);
      }

      this.driving = null;
      this.placeSearch = null;
    },
  },
};
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 800px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

#container {
  width: 100%;
  height: 100%;
}

/* 面板通用样式 */
.route-panel,
.search-panel {
  position: absolute;
  width: 320px;
  max-height: 600px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  z-index: 15;
  overflow-y: auto;
}

.route-panel {
  top: 16px;
  right: 16px;
  display: none;
}

.route-panel:not(:empty) {
  display: block;
}

.search-panel {
  top: 120px;
  left: 16px;
}

/* 地图覆盖层 */
.map-overlay {
  position: absolute;
  z-index: 10;
}

.map-overlay.top-left {
  top: 16px;
  left: 16px;
}

.map-overlay.bottom-right {
  bottom: 16px;
  right: 16px;
}

/* 信息卡片 */
.overlay-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  min-width: 180px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.overlay-card .title {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.overlay-card .value {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.overlay-card .sub {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* 操作按钮 */
.action-btn {
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #0ea371;
}

/* 加载遮罩 */
.loading-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.75);
  z-index: 20;
  gap: 8px;
  color: #111827;
  font-size: 14px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
