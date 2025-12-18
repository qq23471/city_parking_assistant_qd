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
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                车位照片 URL（可选）
              </label>
              <input
                v-model="formData.img"
                type="url"
                placeholder="例如：https://example.com/parking.jpg"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p class="text-xs text-slate-500 mt-1">
                支持直接填写图片链接；如需上传请先传至图床后粘贴链接。
              </p>
              <div v-if="formData.img" class="mt-2">
                <p class="text-xs text-slate-600 mb-1">预览：</p>
                <img
                  :src="formData.img"
                  alt="车位照片预览"
                  class="w-full max-w-md rounded-lg border border-slate-200"
                  @error="onImageLoadError"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  总车位数 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.totalSpaces"
                  type="number"
                  min="1"
                  placeholder="例如：1"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  空闲车位数 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.availableSpaces"
                  type="number"
                  min="0"
                  :max="formData.totalSpaces || 999"
                  placeholder="例如：1"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
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
                  v-model.number="formData.pricePerHour"
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder="例如：5"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
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

        <!-- 提交按钮 -->
        <div class="flex gap-4 pt-4 border-t border-slate-200">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? "提交中..." : "提交发布" }}
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

    <!-- 发布流程说明 -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">发布流程</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex items-start gap-3">
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold text-sm"
          >
            1
          </div>
          <div>
            <h4 class="font-medium text-slate-900 mb-1">填写信息</h4>
            <p class="text-sm text-slate-600">
              填写车位基本信息、价格等详细信息
            </p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold text-sm"
          >
            2
          </div>
          <div>
            <h4 class="font-medium text-slate-900 mb-1">提交发布</h4>
            <p class="text-sm text-slate-600">
              填写完成后立即提交，系统会自动完成发布
            </p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold text-sm"
          >
            3
          </div>
          <div>
            <h4 class="font-medium text-slate-900 mb-1">开始收益</h4>
            <p class="text-sm text-slate-600">
              提交成功后，车位会立即上线，用户即可预约使用
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 注意事项 -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3
        class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"
      >
        <span>📋</span>
        注意事项
      </h3>
      <ul class="space-y-2 text-sm text-slate-700">
        <li class="flex items-start gap-2">
          <span class="text-blue-500 mt-1">•</span>
          <span>请确保填写的信息真实有效，虚假信息将被拒绝审核</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-blue-500 mt-1">•</span>
          <span>空闲车位数不能大于总车位数，请如实填写</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-blue-500 mt-1">•</span>
          <span>建议参考附近停车场价格，合理定价有助于提高使用率</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-blue-500 mt-1">•</span>
          <span>提交成功后，您可以在个人中心管理您的共享车位</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-blue-500 mt-1">•</span>
          <span>如有疑问，请联系平台客服或查看帮助中心</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createParkingLot } from "@/api/ParkingLot";
import { ParkingLotCreateDto } from "@/api";
export default Vue.extend({
  name: "PublishParkingView",
  data() {
    return {
      loading: false,
      formData: {
        name: "",
        address: "",
        img: "",
        totalSpaces: 0,
        availableSpaces: 0,
        distance: 0,
        type: 1, // 0: 公共, 1: 共享
        pricePerHour: 0,
      } as ParkingLotCreateDto,
    };
  },
  methods: {
    async handleSubmit() {
      if (this.loading) return;

      // 验证必填项
      if (
        !this.formData.name ||
        !this.formData.address ||
        !this.formData.totalSpaces ||
        !this.formData.availableSpaces ||
        !this.formData.pricePerHour
      ) {
        this.$message.warning("请填写所有必填项");
        return;
      }

      // 验证空闲车位数不能大于总车位数
      const totalSpaces = this.formData.totalSpaces;
      const availableSpaces = this.formData.availableSpaces;

      if (totalSpaces && availableSpaces && availableSpaces > totalSpaces) {
        this.$message.warning("空闲车位数不能大于总车位数");
        return;
      }

      // 验证总车位数和空闲车位数必须大于0
      if (totalSpaces && totalSpaces <= 0) {
        this.$message.warning("总车位数必须大于0");
        return;
      }

      if (availableSpaces !== null && availableSpaces < 0) {
        this.$message.warning("空闲车位数不能小于0");
        return;
      }

      // 校验图片 URL（可选）
      if (this.formData.img) {
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(this.formData.img)) {
          this.$message.warning("请输入有效的图片链接（需以 http/https 开头）");
          return;
        }
      }

      this.loading = true;

      try {
        const res = await createParkingLot(this.formData);
        if (res.data.code === 200) {
          this.$message.success("提交成功");
          this.handleReset();
          this.$router.push("/home/index");
        } else {
          this.$message.error(res.data.message);
        }
      } catch (error) {
        console.error("提交失败:", error);
        this.$message.error("提交失败，请稍后重试");
      } finally {
        this.loading = false;
      }
    },
    handleReset() {
      this.formData = {
        name: "",
        address: "",
        img: "",
        totalSpaces: 0,
        availableSpaces: 0,
        distance: 0,
        type: 1, // 0: 公共, 1: 共享
        pricePerHour: 0,
      };
    },
    onImageLoadError() {
      this.$message.warning("图片加载失败，请检查链接是否正确");
    },
  },
});
</script>
