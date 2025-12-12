<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">发布共享车位</h2>
      <p class="text-sm text-slate-600 mt-1">
        将您的空闲车位分享给其他用户，获得额外收入
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
                车位名称 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="例如：阳光小区A栋地下车库"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
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
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  车位类型 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.spotType"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">请选择</option>
                  <option value="indoor">室内车位</option>
                  <option value="outdoor">室外车位</option>
                  <option value="underground">地下车库</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  车位大小 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.size"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">请选择</option>
                  <option value="small">小型车（≤4.5米）</option>
                  <option value="medium">中型车（4.5-5.5米）</option>
                  <option value="large">大型车（≥5.5米）</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 价格信息 -->
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-4">价格信息</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  每小时价格（元） <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.hourlyPrice"
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder="例如：5"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  每日价格（元，可选）
                </label>
                <input
                  v-model.number="formData.dailyPrice"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="例如：50"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p class="text-sm text-emerald-800">
                💡 提示：建议价格参考附近停车场价格，合理定价能提高车位使用率
              </p>
            </div>
          </div>
        </div>

        <!-- 可用时间 -->
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-4">可用时间</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                可用日期
              </label>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="day in weekDays"
                  :key="day.value"
                  class="inline-flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg cursor-pointer transition"
                  :class="
                    formData.availableDays.includes(day.value)
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'bg-white hover:bg-slate-50'
                  "
                >
                  <input
                    type="checkbox"
                    :value="day.value"
                    v-model="formData.availableDays"
                    class="sr-only"
                  />
                  <span class="text-sm">{{ day.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 其他信息 -->
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-4">其他信息</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                联系方式 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.contact"
                type="text"
                placeholder="手机号或微信号"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                备注说明
              </label>
              <textarea
                v-model="formData.description"
                rows="4"
                placeholder="例如：车位位置、注意事项等"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
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
            {{ loading ? "提交中..." : "提交审核" }}
          </button>
          <button
            type="button"
            @click="handleReset"
            class="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
          >
            重置
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PublishParkingView",
  data() {
    return {
      loading: false,
      formData: {
        name: "",
        address: "",
        spotType: "",
        size: "",
        hourlyPrice: null as number | null,
        dailyPrice: null as number | null,
        startTime: "08:00",
        endTime: "20:00",
        availableDays: [] as string[],
        contact: "",
        description: "",
      },
      weekDays: [
        { label: "周一", value: "1" },
        { label: "周二", value: "2" },
        { label: "周三", value: "3" },
        { label: "周四", value: "4" },
        { label: "周五", value: "5" },
        { label: "周六", value: "6" },
        { label: "周日", value: "0" },
      ],
    };
  },
  methods: {
    handleSubmit() {
      if (this.loading) return;

      // 验证必填项
      if (
        !this.formData.name ||
        !this.formData.address ||
        !this.formData.spotType ||
        !this.formData.size ||
        !this.formData.hourlyPrice ||
        !this.formData.contact ||
        this.formData.availableDays.length === 0
      ) {
        alert("请填写所有必填项");
        return;
      }

      this.loading = true;

      // TODO: 接入提交接口
      setTimeout(() => {
        this.loading = false;
        alert(
          "提交成功！您的共享车位申请已提交审核，审核通过后将显示在平台上。"
        );
        this.handleReset();
        this.$router.push("/home/index");
      }, 1000);
    },
    handleReset() {
      this.formData = {
        name: "",
        address: "",
        spotType: "",
        size: "",
        hourlyPrice: null,
        dailyPrice: null,
        startTime: "08:00",
        endTime: "20:00",
        availableDays: [],
        contact: "",
        description: "",
      };
    },
  },
});
</script>
