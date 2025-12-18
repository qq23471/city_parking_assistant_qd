<template>
  <!-- 弹窗遮罩层 -->
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4"
    @click.self="handleClose"
  >
    <!-- 弹窗内容 -->
    <div
      class="bg-gradient-to-br from-sky-100 via-blue-50 to-sky-100 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-auto"
      @click.stop
    >
      <div class="p-6">
        <!-- 关闭按钮 -->
        <button
          @click="handleClose"
          class="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
        >
          <span>←</span>
          <span>返回</span>
        </button>

        <!-- 主内容区域 -->
        <div v-if="parkingLot" class="space-y-6">
          <!-- 顶部信息栏 -->
          <div
            class="bg-slate-800 text-white px-6 py-4 rounded-lg flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <span class="text-2xl">🅿️</span>
              <div>
                <p class="text-xl font-bold">{{ parkingLot.name }}</p>
              </div>
            </div>
            <div class="flex gap-4">
              <button
                @click="reportIssue"
                class="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
              >
                举报问题
              </button>
              <div class="text-right">
                <p class="text-sm text-slate-300">预计费用</p>
                <p class="text-2xl font-bold">¥{{ estimatedCost }}</p>
              </div>
            </div>
          </div>

          <div>
            <img
              :src="parkingLot.image || defaultImage"
              alt="停车场图片"
              class="w-full h-64 object-cover"
              @error="handleImageError"
            />
          </div>
          <!-- 步骤指示器 -->
          <div class="py-4">
            <div class="flex items-center justify-between gap-2">
              <!-- 步骤1：信息 -->
              <div class="flex-1 text-center">
                <div
                  class="px-4 py-3 rounded-lg transition text-sm"
                  :class="
                    currentStep === 1
                      ? 'bg-slate-800 text-white'
                      : 'bg-white/50 text-slate-600'
                  "
                >
                  <p class="font-semibold mb-1">信息</p>
                  <p class="text-xs">查看停车场详情</p>
                </div>
              </div>

              <!-- 步骤2：预约 -->
              <div class="flex-1 text-center">
                <div
                  class="px-4 py-3 rounded-lg transition relative text-sm"
                  :class="
                    currentStep === 2
                      ? 'bg-slate-800 text-white'
                      : 'bg-white/50 text-slate-600'
                  "
                >
                  <p class="font-semibold mb-1">预约</p>
                  <p class="text-xs">填写预约信息</p>
                  <div
                    v-if="currentStep === 2"
                    class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-800"
                  ></div>
                </div>
              </div>

              <!-- 步骤3：确认 -->
              <div class="flex-1 text-center">
                <div
                  class="px-4 py-3 rounded-lg transition text-sm"
                  :class="
                    currentStep === 3
                      ? 'bg-slate-800 text-white'
                      : 'bg-white/50 text-slate-600'
                  "
                >
                  <p class="font-semibold mb-1">确认</p>
                  <p class="text-xs">确认预约信息</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 步骤1：信息详情 -->
          <div v-if="currentStep === 1" class="space-y-6">
            <!-- 关键信息 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center bg-zinc-50 rounded p-3">
                <p class="text-sm text-slate-600 mb-2">空闲车位</p>
                <p class="text-3xl font-bold text-emerald-600">
                  {{ parkingLot.availableSpots }}
                </p>
                <p class="text-xs text-slate-500 mt-2">
                  / {{ parkingLot.totalSpots }} 总车位
                </p>
              </div>
              <div class="text-center bg-zinc-50 rounded p-3">
                <p class="text-sm text-slate-600 mb-2">距离</p>
                <p class="text-3xl font-bold text-slate-900">
                  {{ parkingLot.distance }}km
                </p>
                <p class="text-xs text-slate-500 mt-2">直线距离</p>
              </div>
              <div class="text-center bg-zinc-50 rounded p-3">
                <p class="text-sm text-slate-600 mb-2">价格</p>
                <p class="text-3xl font-bold text-slate-900">
                  ¥{{ parkingLot.price }}
                </p>
                <p class="text-xs text-slate-500 mt-2">每小时</p>
              </div>
              <div class="text-center bg-zinc-50 rounded p-3">
                <p class="text-sm text-slate-600 mb-2">类型</p>
                <p class="text-lg font-semibold text-slate-900">
                  {{ parkingLot.type === "public" ? "公共停车场" : "共享车位" }}
                </p>
              </div>
            </div>

            <!-- 地址信息 -->
            <div>
              <p class="text-base text-slate-600 mb-2">📍 地址</p>
              <p class="text-lg text-slate-900 font-medium">
                {{ parkingLot.address }}
              </p>
            </div>

            <!-- 详细信息（共享车位） -->
            <div v-if="parkingLot.type === 'shared'" class="space-y-4">
              <h3 class="text-xl font-semibold text-slate-900">详细信息</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-slate-600 mb-2">车位类型</p>
                  <p class="text-base text-slate-900">
                    {{ parkingLot.spotType || "室内车位" }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-slate-600 mb-2">车位大小</p>
                  <p class="text-base text-slate-900">
                    {{ parkingLot.size || "中型车" }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-slate-600 mb-2">可用时间</p>
                  <p class="text-base text-slate-900">
                    {{ parkingLot.startTime || "08:00" }} -
                    {{ parkingLot.endTime || "20:00" }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-slate-600 mb-2">联系方式</p>
                  <p class="text-base text-slate-900">
                    {{ parkingLot.contact || "138****8888" }}
                  </p>
                </div>
              </div>
              <div v-if="parkingLot.description">
                <p class="text-sm text-slate-600 mb-2">备注说明</p>
                <p
                  class="text-base text-slate-900 whitespace-pre-wrap leading-relaxed"
                >
                  {{ parkingLot.description }}
                </p>
              </div>
            </div>

            <!-- 下一步按钮 -->
            <div class="pt-4">
              <button
                v-if="
                  parkingLot.type === 'shared' && parkingLot.availableSpots > 0
                "
                @click="currentStep = 2"
                class="px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-semibold text-right"
              >
                下一步
              </button>
              <div v-else class="space-y-2 flex flex-col items-start">
                <p
                  v-if="parkingLot.type === 'public'"
                  class="text-sm text-slate-600 mb-2"
                >
                  提示：只有共享车位可以预约，公共停车场不支持预约功能
                </p>
              </div>
            </div>
          </div>

          <!-- 步骤2：预约表单 -->
          <div
            v-if="
              currentStep === 2 &&
              parkingLot.type === 'shared' &&
              parkingLot.availableSpots > 0
            "
            class="space-y-6"
          >
            <h2 class="text-2xl font-bold text-slate-900">填写预约信息</h2>

            <form @submit.prevent="handleReserve" class="space-y-6">
              <!-- 表单输入区域 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 左侧列 -->
                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-base font-medium text-slate-700 mb-2"
                    >
                      预约日期 <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="reserveForm.date"
                      type="date"
                      :min="minDate"
                      class="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label
                      class="block text-base font-medium text-slate-700 mb-2"
                    >
                      预计停车时长（小时）
                    </label>
                    <input
                      v-model.number="reserveForm.duration"
                      type="number"
                      min="1"
                      max="24"
                      value="2"
                      class="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <!-- 右侧列 -->
                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-base font-medium text-slate-700 mb-2"
                    >
                      预约时间 <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="reserveForm.time"
                      type="time"
                      class="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label
                      class="block text-base font-medium text-slate-700 mb-2"
                    >
                      预计费用
                    </label>
                    <div
                      class="w-full px-4 py-3 bg-slate-100 border-2 border-slate-300 rounded-lg"
                    >
                      <p class="text-2xl font-bold text-emerald-600">
                        ¥{{ estimatedCost }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 复选框 -->
              <div class="flex items-center gap-3 pt-2">
                <input
                  id="same-address"
                  type="checkbox"
                  v-model="useSameAddress"
                  class="w-5 h-5 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                />
                <label for="same-address" class="text-base text-slate-700">
                  我已阅读并同意停车服务协议
                </label>
              </div>

              <!-- 底部按钮 -->
              <div class="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  @click="currentStep = 1"
                  class="px-8 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold"
                >
                  返回
                </button>
                <button
                  type="submit"
                  :disabled="reserveLoading || !useSameAddress"
                  class="px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ reserveLoading ? "预约中..." : "确认预约" }}
                </button>
              </div>
            </form>
          </div>

          <!-- 步骤3：确认信息 -->
          <div
            v-if="
              currentStep === 3 &&
              parkingLot.type === 'shared' &&
              parkingLot.availableSpots > 0
            "
            class="space-y-6"
          >
            <h2 class="text-2xl font-bold text-slate-900">确认预约信息</h2>
            <div class="space-y-4">
              <div class="bg-white/50 backdrop-blur-sm rounded-lg p-6">
                <h3 class="text-xl font-semibold text-slate-900 mb-4">
                  {{ parkingLot.name }}
                </h3>
                <div class="space-y-3 text-base">
                  <p>
                    <span class="text-slate-600 font-medium">地址：</span
                    >{{ parkingLot.address }}
                  </p>
                  <p>
                    <span class="text-slate-600 font-medium">预约日期：</span
                    >{{ reserveForm.date }}
                  </p>
                  <p>
                    <span class="text-slate-600 font-medium">预约时间：</span
                    >{{ reserveForm.time }}
                  </p>
                  <p>
                    <span class="text-slate-600 font-medium">停车时长：</span
                    >{{ reserveForm.duration }}
                    小时
                  </p>
                  <p
                    class="text-xl font-bold text-emerald-600 pt-3 border-t border-slate-300"
                  >
                    <span class="text-slate-600 font-medium">总费用：</span>¥{{
                      estimatedCost
                    }}
                  </p>
                </div>
              </div>
              <!-- 待确认状态：显示确认预约按钮 -->
              <div
                v-if="appointmentStatus === 0"
                class="flex justify-end gap-4"
              >
                <button
                  @click="currentStep = 2"
                  class="px-8 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold"
                >
                  返回修改
                </button>
                <button
                  @click="handleConfirmReserve"
                  :disabled="reserveLoading"
                  class="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ reserveLoading ? "提交中..." : "确认预约" }}
                </button>
              </div>

              <!-- 已确认状态：显示支付按钮 -->
              <div v-else-if="appointmentStatus === 1" class="space-y-4">
                <div
                  class="bg-emerald-50 border border-emerald-200 rounded-lg p-4"
                >
                  <p class="text-sm text-emerald-800 flex items-center gap-2">
                    <span>✓</span>
                    <span>预约已确认，请完成支付以完成预约</span>
                  </p>
                </div>
                <div class="flex justify-end gap-4">
                  <button
                    @click="handlePay"
                    :disabled="payLoading"
                    class="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ payLoading ? "支付中..." : "去支付" }}
                  </button>
                </div>
              </div>

              <!-- 已支付状态：显示成功信息 -->
              <div v-else-if="appointmentStatus === 2" class="space-y-4">
                <div
                  class="bg-emerald-50 border border-emerald-200 rounded-lg p-4"
                >
                  <p class="text-sm text-emerald-800 flex items-center gap-2">
                    <span>✓</span>
                    <span>支付成功！预约已完成，请按时到达停车场。</span>
                  </p>
                </div>
                <div class="flex justify-end">
                  <button
                    @click="handleClose"
                    class="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                  >
                    完成
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-else class="text-center py-12">
          <p class="text-lg text-slate-600">加载中...</p>
        </div>
      </div>
    </div>

    <!-- 举报问题对话框 - 移到遮罩层外面，使用 append-to-body 避免层级冲突 -->
    <el-dialog
      title="举报问题"
      :visible.sync="showReportDialog"
      width="600px"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      append-to-body
    >
      <el-form
        ref="reportForm"
        :model="reportForm"
        :rules="reportRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="举报类型" prop="type">
          <el-select
            v-model="reportForm.type"
            placeholder="请选择举报类型"
            style="width: 100%"
          >
            <el-option label="虚假信息" value="false_info"></el-option>
            <el-option label="价格欺诈" value="price_fraud"></el-option>
            <el-option label="服务问题" value="service_issue"></el-option>
            <el-option label="安全隐患" value="safety_issue"></el-option>
            <el-option label="其他问题" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" prop="description">
          <el-input
            v-model="reportForm.description"
            type="textarea"
            :rows="5"
            placeholder="请详细描述您遇到的问题，以便我们更好地处理..."
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelReport">取消</el-button>
        <el-button
          type="primary"
          :loading="reportLoading"
          @click="handleSubmitReport"
        >
          提交举报
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { addAppointment, SureAppointment } from "@/api/appointment";
import { createReport } from "@/api/Report";
import Vue from "vue";

interface ParkingLot {
  id: number;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  distance: number;
  price: number;
  type: "public" | "shared";
  status: string;
  spotType?: string;
  size?: string;
  startTime?: string;
  endTime?: string;
  contact?: string;
  description?: string;
  image?: string;
  images?: string[];
}

export default Vue.extend({
  name: "ParkingDetailModal",
  props: {
    /**
     * 控制弹窗显示/隐藏
     */
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * 打开弹窗时的初始步骤（1 信息 / 2 预约）
     */
    initialStep: {
      type: Number,
      default: 1,
    },
    /**
     * 停车场数据
     */
    parkingLot: {
      type: Object as () => ParkingLot | null,
      default: null,
    },
  },
  data() {
    return {
      reserveLoading: false,
      payLoading: false,
      currentStep: 1, // 当前步骤：1-信息，2-预约，3-确认
      appointmentStatus: 0, // 预约状态：0-待确认，1-已确认，2-已支付
      appointmentId: 0 as number, // 预约ID
      useSameAddress: false,
      reserveForm: {
        date: "",
        time: "",
        duration: 2,
      },
      // 默认图片
      defaultImage: require("@/assets/OIP.webp"),
      // 举报对话框
      showReportDialog: false,
      reportLoading: false,
      reportForm: {
        type: "",
        description: "",
      },
      // 举报表单验证规则
      reportRules: {
        type: [
          {
            required: true,
            message: "请选择举报类型",
            trigger: "change",
          },
        ],
        description: [
          {
            required: true,
            message: "请输入问题描述",
            trigger: "blur",
          },
          {
            min: 10,
            max: 500,
            message: "问题描述长度在 10 到 500 个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    /**
     * 最小日期（今天）
     */
    minDate(): string {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },
    /**
     * 预计费用
     */
    estimatedCost(): number {
      if (!this.parkingLot) return 0;
      return this.parkingLot.price * (this.reserveForm.duration || 2);
    },
  },
  watch: {
    /**
     * 监听弹窗显示状态，重置表单
     */
    visible(newVal: boolean) {
      if (newVal) {
        const canReserveShared = this.parkingLot?.type === "shared";
        this.currentStep = canReserveShared ? this.initialStep : 1;
        this.appointmentStatus = 0; // 重置为待确认状态
        this.appointmentId = 0; // 重置预约ID
        this.useSameAddress = false;
        this.reserveForm.date = this.minDate;
        this.reserveForm.time = "";
        this.reserveForm.duration = 2;
      }
    },
  },
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$emit("close");
    },
    /**
     * 处理预约提交
     */
    async handleReserve() {
      if (this.reserveLoading) return;

      // 验证是否为共享车位
      if (!this.parkingLot || this.parkingLot.type !== "shared") {
        this.$message.warning("只有共享车位可以预约，公共停车场不支持预约功能");
        return;
      }

      if (!this.useSameAddress) {
        this.$message.warning("请先同意停车服务协议");
        return;
      }

      this.reserveLoading = true;
      try {
        const res = await addAppointment({
          parkingLotId: this.parkingLot?.id,
          date: this.reserveForm.date,
          time: this.reserveForm.time,
          duration: this.reserveForm.duration,
          cost: this.estimatedCost,
        });
        if (res.data.code === 200) {
          this.appointmentId = res.data.data;
          this.currentStep = 3;
        } else {
          this.$message?.error(res.data.message);
        }
      } catch (error) {
        this.$message?.error("预约失败");
      } finally {
        this.reserveLoading = false;
      }
    },
    /**
     * 确认预约（status = 1）
     */
    async handleConfirmReserve() {
      if (this.reserveLoading) return;

      // 验证是否为共享车位
      if (!this.parkingLot || this.parkingLot.type !== "shared") {
        this.$message?.error("只有共享车位可以预约，公共停车场不支持预约功能");
        return;
      }

      this.reserveLoading = true;
      try {
        const res = await SureAppointment(this.appointmentId);
        if (res.data.code === 200) {
          this.appointmentStatus = 1; // 已确认
        } else {
          this.$message?.error(res.data.message);
        }
      } catch (error) {
        this.$message?.error("确认预约失败");
      } finally {
        this.reserveLoading = false;
      }
    },
    /**
     * 支付预约（status = 2）
     */
    async handlePay() {
      if (this.payLoading) return;

      if (!this.appointmentId) {
        this.$message?.error("预约信息异常，请重新预约");
        return;
      }

      this.payLoading = true;
      // 要有空闲车位（如果没有车位信息或可用车位数小于等于 0，则不允许支付）
      if ((this.parkingLot?.availableSpots ?? 0) <= 0) {
        this.$message?.error("当前车位已满，请选择其他车位");
        return;
      }

      try {
        const traceNo =
          window.crypto && "randomUUID" in window.crypto
            ? (window.crypto as any).randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        const aliPayData = {
          traceNo: traceNo,
          totalAmount: this.estimatedCost,
          subject: this.parkingLot?.name,
        };
        window.open(
          `http://localhost:8080/api/user/alipay/pay?traceNo=${aliPayData.traceNo}&totalAmount=${aliPayData.totalAmount}&subject=${aliPayData.subject}`,
          "_blank"
        );
        this.$message.success("支付成功，预约已完成，请按时到达停车场。");
      } catch (error) {
        this.$message.error("下单失败");
        console.error("下单错误:", error);
      } finally {
        this.payLoading = false;
      }
    },
    /**
     * 打开举报对话框
     */
    reportIssue() {
      // 重置表单
      this.reportForm = {
        type: "",
        description: "",
      };
      // 清除表单验证
      this.$nextTick(() => {
        const form = this.$refs.reportForm as any;
        if (form && typeof form.clearValidate === "function") {
          form.clearValidate();
        }
      });
      this.showReportDialog = true;
    },
    /**
     * 取消举报
     */
    handleCancelReport() {
      this.showReportDialog = false;
      // 重置表单
      this.reportForm = {
        type: "",
        description: "",
      };
    },
    /**
     * 提交举报
     */
    async handleSubmitReport() {
      const form = this.$refs.reportForm as any;
      if (!form) return;

      form.validate(async (valid: boolean) => {
        if (!valid) {
          this.$message.warning("请完善举报信息");
          return false;
        }

        this.reportLoading = true;

        if (!this.parkingLot) {
          this.$message.error("停车场信息缺失，无法提交举报");
          this.reportLoading = false;
          return;
        }

        try {
          const res = await createReport({
            parkingLotId: this.parkingLot.id,
            type: this.reportForm.type,
            content: this.reportForm.description,
          });

          if (res.data.code === 200) {
            this.$message.success("举报已提交，我们会尽快处理！");
            this.showReportDialog = false;
            // 重置表单
            this.reportForm = {
              type: "",
              description: "",
            };
          } else {
            this.$message.error(res.data.message || "举报提交失败，请稍后重试");
          }
        } catch (error) {
          console.error("提交举报失败:", error);
          this.$message.error("举报提交失败，请检查网络或稍后重试");
        } finally {
          this.reportLoading = false;
        }
      });
    },
    /**
     * 处理图片加载错误
     */
    handleImageError(event: Event) {
      const img = event.target as HTMLImageElement;
      img.src = this.defaultImage;
    },
  },
});
</script>
