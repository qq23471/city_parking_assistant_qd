<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">添加停车历史记录</h2>
      <p class="text-sm text-slate-600 mt-1">
        记录您的停车信息，方便日后查看和管理
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 基本信息 -->
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-4">基本信息</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                选择停车场 <span class="text-red-500">*</span>
              </label>
              <el-select
                v-model="formData.parkingLotId"
                filterable
                clearable
                placeholder="请搜索或选择停车场"
                class="w-full"
                @change="handleParkingLotChange"
              >
                <el-option
                  v-for="lot in parkingLots"
                  :key="lot.id"
                  :label="lot.name"
                  :value="lot.id"
                >
                  <span style="float: left">{{ lot.name }}</span>
                  <span
                    style="
                      float: right;
                      color: #8492a6;
                      font-size: 13px;
                      margin-left: 10px;
                    "
                    >{{ lot.address }}</span
                  >
                </el-option>
              </el-select>
            </div>
            <div v-if="!formData.parkingLotId">
              <label class="block text-sm font-medium text-slate-700 mb-1">
                未选择现有停车场？请输入名称 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.parkingName"
                type="text"
                placeholder="例如：某个路边停车位"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                :required="!formData.parkingLotId"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                详细地址 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.address"
                type="text"
                placeholder="请输入详细地址"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                :disabled="!!formData.parkingLotId"
              />
            </div>
          </div>
        </div>

        <!-- 停车时间 -->
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-4">停车时间</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  开始日期 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.startDate"
                  type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  开始时间 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.startTime"
                  type="time"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  结束日期 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.endDate"
                  type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  结束时间 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.endTime"
                  type="time"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
            <div
              v-if="calculatedDuration !== null"
              class="bg-emerald-50 border border-emerald-200 rounded-lg p-4"
            >
              <p class="text-sm text-emerald-800">
                <span class="font-medium">自动计算停车时长：</span>
                {{ calculatedDuration.toFixed(2) }} 小时
              </p>
            </div>
          </div>
        </div>

        <!-- 费用信息 -->
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-4">费用信息</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                停车费用（元） <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="例如：25.50"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        <!-- 路线信息 -->
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-4">路线信息</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                路线描述（可选）
              </label>
              <textarea
                v-model="formData.routeInfo"
                rows="4"
                placeholder="例如：从起点出发，沿解放路行驶2.5公里，右转进入商业街，停车场位于右侧"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm text-blue-800">
                💡 提示：填写路线信息可以帮助您下次快速找到该停车场
              </p>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="flex gap-4 pt-4 border-t border-slate-200">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? "保存中..." : "保存记录" }}
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { addParkingHistory } from "@/api/ParkingHistory";
import { getAdminParkingLots } from "@/api/Admin";
import { ParkingHistoryCreateDto, ParkingLotVO } from "@/api/index";

interface ParkingHistoryForm {
  parkingLotId: number | null;
  parkingName: string;
  address: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  price: number | null;
  routeInfo: string;
}

export default Vue.extend({
  name: "AddParkingHistoryView",
  data() {
    // 获取今天的日期作为默认值
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toTimeString().slice(0, 5);

    return {
      loading: false,
      parkingLots: [] as ParkingLotVO[],
      formData: {
        parkingLotId: null as number | null,
        parkingName: "",
        address: "",
        startDate: today,
        startTime: now,
        endDate: today,
        endTime: now,
        price: null as number | null,
        routeInfo: "",
      } as ParkingHistoryForm,
    };
  },
  async created() {
    await this.loadParkingLots();
  },
  computed: {
    /**
     * 自动计算停车时长（小时）
     */
    calculatedDuration(): number | null {
      if (
        !this.formData.startDate ||
        !this.formData.startTime ||
        !this.formData.endDate ||
        !this.formData.endTime
      ) {
        return null;
      }

      try {
        const startDateTime = new Date(
          `${this.formData.startDate}T${this.formData.startTime}`
        );
        const endDateTime = new Date(
          `${this.formData.endDate}T${this.formData.endTime}`
        );

        if (endDateTime <= startDateTime) {
          return null;
        }

        const diffMs = endDateTime.getTime() - startDateTime.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours;
      } catch (e) {
        console.error("计算停车时长失败", e);
        return null;
      }
    },
  },
  methods: {
    /**
     * 加载停车场列表
     */
    async loadParkingLots() {
      try {
        const res = await getAdminParkingLots({ pageNum: 1, pageSize: 1000 });
        if (res.data?.code === 200) {
          this.parkingLots = res.data.data.data;
        }
      } catch (e) {
        console.error("加载停车场列表失败", e);
      }
    },

    /**
     * 停车场选择变化时
     */
    handleParkingLotChange() {
      if (this.formData.parkingLotId) {
        const selectedLot = this.parkingLots.find(
          (lot) => lot.id === this.formData.parkingLotId
        );
        if (selectedLot) {
          this.formData.parkingName = selectedLot.name;
          this.formData.address = selectedLot.address;
        }
      } else {
        this.formData.parkingName = "";
        this.formData.address = "";
      }
    },

    /**
     * 处理表单提交
     */
    async handleSubmit() {
      if (this.loading) return;

      // 验证必填项
      if (
        !this.formData.parkingName ||
        !this.formData.address ||
        !this.formData.startDate ||
        !this.formData.startTime ||
        !this.formData.endDate ||
        !this.formData.endTime ||
        this.formData.price === null ||
        this.formData.price < 0
      ) {
        this.$message.warning("请填写所有必填项");
        return;
      }

      // 验证时间逻辑
      if (this.calculatedDuration === null || this.calculatedDuration <= 0) {
        this.$message.warning("结束时间必须晚于开始时间");
        return;
      }

      this.loading = true;

      try {
        // 格式化时间字符串为 ISO 8601 格式（后端 LocalDateTime 需要）
        // 格式：YYYY-MM-DDTHH:mm:ss
        const formatToISO = (date: string, time: string): string => {
          // 如果时间没有秒数，添加 :00
          const timeWithSeconds = time.includes(":")
            ? time.split(":").length === 2
              ? `${time}:00`
              : time
            : `${time}:00:00`;
          return `${date}T${timeWithSeconds}`;
        };

        const startTimeStr = formatToISO(
          this.formData.startDate,
          this.formData.startTime
        );
        const endTimeStr = formatToISO(
          this.formData.endDate,
          this.formData.endTime
        );

        // 构建请求数据
        const requestData: ParkingHistoryCreateDto = {
          parkingId: this.formData.parkingLotId || undefined,
          parkingName: this.formData.parkingName.trim(),
          address: this.formData.address.trim(),
          startTime: startTimeStr,
          endTime: endTimeStr,
          duration: Number(this.calculatedDuration.toFixed(2)),
          price: this.formData.price,
          routeInfo: this.formData.routeInfo?.trim() || undefined,
        };

        // 调用后端API添加停车历史记录
        const res = await addParkingHistory(requestData);

        if (res.data?.code === 200) {
          this.$message.success("停车历史记录已保存！");

          // 跳转回个人中心，并显示历史记录标签页
          this.$router.push({
            path: "/home/center",
            query: { tab: "history" },
          });
        } else {
          this.$message.error(res.data?.message || "保存失败，请重试");
        }
      } catch (e) {
        console.error("保存停车历史记录失败", e);
        this.$message.error("保存失败，请重试");
      } finally {
        this.loading = false;
      }
    },

    /**
     * 处理取消操作
     */
    async handleCancel() {
      try {
        await this.$confirm("确定要取消吗？未保存的数据将丢失。", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        this.$router.push("/home/center");
      } catch {
        // 用户取消操作
      }
    },
  },
});
</script>
