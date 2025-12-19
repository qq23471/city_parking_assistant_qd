<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">个人中心</h2>
      <p class="text-sm text-slate-600 mt-1">
        管理您的预约、共享车位和停车历史
      </p>
    </div>

    <!-- 基本信息 -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div class="flex items-center gap-4">
          <el-avatar :size="64" :src="userInfo.avatar">
            <i class="el-icon-user"></i>
          </el-avatar>
          <div>
            <p class="text-lg font-semibold text-slate-900">
              {{ userInfo.username || "未命名用户" }}
            </p>
            <p class="text-sm text-slate-600">
              手机号：{{ userInfo.phone || "未填写" }}
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" size="small" @click="openEditDialog">
            编辑资料
          </el-button>
          <el-button size="small" @click="$router.push('/home/add-history')">
            添加停车记录
          </el-button>
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200">
      <div class="border-b border-slate-200">
        <div class="flex gap-4 px-6">
          <button
            @click="activeTab = 'reservations'"
            class="px-4 py-3 font-medium transition border-b-2"
            :class="
              activeTab === 'reservations'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            "
          >
            我的预约
          </button>
          <button
            @click="activeTab = 'shared'"
            class="px-4 py-3 font-medium transition border-b-2"
            :class="
              activeTab === 'shared'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            "
          >
            我的共享车位
          </button>
          <button
            @click="activeTab = 'history'"
            class="px-4 py-3 font-medium transition border-b-2"
            :class="
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            "
          >
            停车历史记录
          </button>
        </div>
      </div>

      <div class="p-6">
        <!-- 我的预约 -->
        <div
          v-if="activeTab === 'reservations'"
          class="flex flex-col min-h-[60vh] max-h-[60vh]"
        >
          <div class="overflow-y-auto h-full">
            <div
              v-for="reservation in pagedReservations"
              :key="reservation.id"
              class="bg-slate-50 rounded-lg p-4 border border-slate-200 mt-4"
            >
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <div class="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 class="text-lg font-semibold text-slate-900 mb-1">
                        {{ reservation.parkingName }}
                      </h3>
                      <p class="text-sm text-slate-600 flex items-center gap-1">
                        <span>📍</span>
                        <span>{{ reservation.address }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p class="text-slate-600 mb-1">预约日期</p>
                      <p class="font-medium text-slate-900">
                        {{ reservation.date }}
                      </p>
                    </div>
                    <div>
                      <p class="text-slate-600 mb-1">预约时间</p>
                      <p class="font-medium text-slate-900">
                        {{ reservation.time }}
                      </p>
                    </div>
                    <div>
                      <p class="text-slate-600 mb-1">停车时长</p>
                      <p class="font-medium text-slate-900">
                        {{ reservation.duration }} 小时
                      </p>
                    </div>
                    <div>
                      <p class="text-slate-600 mb-1">费用</p>
                      <p class="font-medium text-emerald-600">
                        ¥{{ reservation.cost }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2 flex-shrink-0">
                  <button
                    @click="openReservationDetail(reservation)"
                    class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm whitespace-nowrap"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="reservations.length === 0" class="text-center py-12">
            <p class="text-4xl mb-4">📅</p>
            <p class="text-lg font-medium text-slate-900 mb-2">暂无预约记录</p>
            <p class="text-sm text-slate-600 mb-4">去首页寻找合适的车位吧</p>
            <router-link
              to="/home/index"
              class="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              去首页
            </router-link>
          </div>
          <!-- 分页 -->
          <ParkingPagination
            class="mt-auto"
            :current-page="reservationCurrentPage"
            :page-size="reservationPageSize"
            :total="reservations.length"
            @size-change="handleReservationSizeChange"
            @page-change="handleReservationPageChange"
          />
        </div>

        <!-- 我的共享车位 -->
        <div
          v-if="activeTab === 'shared'"
          class="flex flex-col min-h-[60vh] max-h-[60vh]"
        >
          <div class="overflow-y-auto h-full">
            <div
              v-for="spot in pagedSharedSpots"
              :key="spot.id"
              class="bg-slate-50 rounded-lg p-4 border border-slate-200 mt-2"
            >
              <div class="flex flex-col md:flex-row gap-4">
                <!-- 车位图片 -->
                <!-- <div class="flex-shrink-0">
                  <img
                    :src="spot.img || require('@/assets/OIP.webp')"
                    :alt="spot.name"
                    class="w-32 h-32 object-cover rounded-lg border border-slate-200"
                    @error="handleImageError"
                  />
                </div> -->
                <div class="flex-1">
                  <div class="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 class="text-lg font-semibold text-slate-900 mb-1">
                        {{ spot.name }}
                      </h3>
                      <p class="text-sm text-slate-600 flex items-center gap-1">
                        <span>📍</span>
                        <span>{{ spot.address }}</span>
                      </p>
                      <p
                        v-if="spot.distance"
                        class="text-xs text-slate-500 mt-1"
                      >
                        距离：{{ spot.distance }}km
                      </p>
                    </div>
                  </div>
                  <div
                    class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3"
                  >
                    <div>
                      <p class="text-slate-600 mb-1">价格</p>
                      <p class="font-medium text-emerald-600">
                        ¥{{ spot.price }}/小时
                      </p>
                    </div>
                    <div>
                      <p class="text-slate-600 mb-1">总车位数</p>
                      <p class="font-medium text-slate-900">
                        {{ spot.totalSpaces }} 个
                      </p>
                    </div>
                    <div>
                      <p class="text-slate-600 mb-1">可用车位数</p>
                      <p class="font-medium text-slate-900">
                        {{ spot.availableSpaces }} 个
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2 flex-shrink-0">
                  <button
                    @click="editSpot(spot.id)"
                    class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm whitespace-nowrap"
                  >
                    编辑
                  </button>
                  <button
                    @click="deleteSpot(spot.id)"
                    class="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm whitespace-nowrap"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <ParkingPagination
            class="mt-auto"
            :current-page="sharedCurrentPage"
            :page-size="sharedPageSize"
            :total="sharedSpotsTotal"
            @size-change="handleSharedSizeChange"
            @page-change="handleSharedPageChange"
          />

          <!-- 空状态 -->
          <div v-if="sharedSpots.length === 0" class="text-center py-12">
            <p class="text-4xl mb-4">🏠</p>
            <p class="text-lg font-medium text-slate-900 mb-2">
              还没有发布共享车位
            </p>
            <p class="text-sm text-slate-600 mb-4">
              发布您的空闲车位，获得额外收入
            </p>
            <router-link
              to="/home/publish"
              class="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              发布共享车位
            </router-link>
          </div>
        </div>

        <!-- 停车历史记录 -->
        <div
          v-if="activeTab === 'history'"
          class="flex flex-col min-h-[60vh] max-h-[60vh]"
        >
          <div class="overflow-y-auto h-full">
            <div
              v-for="record in pagedParkingHistory"
              :key="record.id"
              class="bg-slate-50 rounded-lg p-4 border border-slate-200 mt-2"
            >
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <div class="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 class="text-lg font-semibold text-slate-900 mb-1">
                        {{ record.parkingName }}
                      </h3>
                      <p class="text-sm text-slate-600 flex items-center gap-1">
                        <span>📍</span>
                        <span>{{ record.address }}</span>
                      </p>
                    </div>
                  </div>
                  <div
                    class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3"
                  >
                    <div>
                      <p class="text-slate-600 mb-1">开始时间</p>
                      <p class="font-medium text-slate-900">
                        {{ formatDateTime(record.startTime) }}
                      </p>
                    </div>
                    <div>
                      <p class="text-slate-600 mb-1">结束时间</p>
                      <p class="font-medium text-slate-900">
                        {{ formatDateTime(record.endTime) }}
                      </p>
                    </div>
                    <div>
                      <p class="text-slate-600 mb-1">停车时长</p>
                      <p class="font-medium text-slate-900">
                        {{ record.duration }} 小时
                      </p>
                    </div>
                    <div>
                      <p class="text-slate-600 mb-1">费用</p>
                      <p class="font-medium text-emerald-600">
                        ¥{{ record.price }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="record.routeInfo"
                    class="bg-emerald-50 border border-emerald-200 rounded-lg p-3"
                  >
                    <p class="text-sm text-emerald-800 mb-2">
                      <span class="font-medium">路线信息：</span>
                    </p>
                    <p class="text-xs text-emerald-700">
                      {{ record.routeInfo }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <ParkingPagination
            class="mt-auto"
            :current-page="historyCurrentPage"
            :page-size="historyPageSize"
            :total="parkingHistoryTotal"
            @size-change="handleHistorySizeChange"
            @page-change="handleHistoryPageChange"
          />

          <!-- 空状态 -->
          <div v-if="parkingHistory.length === 0" class="text-center py-12">
            <p class="text-4xl mb-4">🕐</p>
            <p class="text-lg font-medium text-slate-900 mb-2">
              暂无停车历史记录
            </p>
            <p class="text-sm text-slate-600 mb-4">
              完成停车后，历史记录将显示在这里
            </p>
            <router-link
              to="/home/index"
              class="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              去首页
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 预约详情弹窗 -->
    <el-dialog
      title="预约详情"
      :visible.sync="showReservationDetailDialog"
      width="520px"
      :close-on-click-modal="true"
    >
      <div v-if="selectedReservation" class="space-y-4">
        <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h3 class="text-lg font-semibold text-slate-900 mb-2">
            {{ selectedReservation.parkingName }}
          </h3>
          <p class="text-sm text-slate-600 flex items-center gap-1">
            <span>📍</span>
            <span>{{ selectedReservation.address }}</span>
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-slate-600 mb-1">预约日期</p>
            <p class="font-medium text-slate-900">
              {{ selectedReservation.date }}
            </p>
          </div>
          <div>
            <p class="text-slate-600 mb-1">预约时间</p>
            <p class="font-medium text-slate-900">
              {{ selectedReservation.time }}
            </p>
          </div>
          <div>
            <p class="text-slate-600 mb-1">停车时长</p>
            <p class="font-medium text-slate-900">
              {{ selectedReservation.duration }} 小时
            </p>
          </div>
          <div>
            <p class="text-slate-600 mb-1">费用</p>
            <p class="font-medium text-emerald-600">
              ¥{{ selectedReservation.cost }}
            </p>
          </div>
        </div>

        <div>
          <p class="text-slate-600 mb-1 text-sm">状态</p>
          <p class="font-medium text-sm">
            <span
              class="px-3 py-1 rounded-full text-xs"
              :class="{
                'bg-yellow-100 text-yellow-700':
                  selectedReservation.status === 0,
                'bg-emerald-100 text-emerald-700':
                  selectedReservation.status === 1,
                'bg-blue-100 text-blue-700': selectedReservation.status === 2,
                'bg-red-100 text-red-700': selectedReservation.status === 3,
              }"
            >
              {{
                selectedReservation.status === 0
                  ? "待确认"
                  : selectedReservation.status === 1
                  ? "已确认"
                  : selectedReservation.status === 2
                  ? "已完成"
                  : "已取消"
              }}
            </span>
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showReservationDetailDialog = false">关闭</el-button>
        <!-- 待确认状态：可以确认预约 -->
        <el-button
          v-if="selectedReservation && selectedReservation.status === 0"
          type="primary"
          :loading="reservationConfirming"
          @click="handleConfirmFromDetail"
        >
          确认预约
        </el-button>
        <!-- 已确认状态：可以支付 -->
        <el-button
          v-if="selectedReservation && selectedReservation.status === 1"
          type="primary"
          :loading="reservationPaying"
          @click="handlePayFromDetail"
        >
          支付
        </el-button>
      </div>
    </el-dialog>

    <!-- 编辑资料弹窗 -->
    <el-dialog
      title="编辑资料"
      :visible.sync="showEditDialog"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="头像">
          <div class="flex items-center gap-4">
            <el-avatar :size="80" :src="editForm.avatar">
              <i class="el-icon-user"></i>
            </el-avatar>
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleAvatarUpload"
              :disabled="avatarUploading"
            >
              <el-button
                size="small"
                type="primary"
                :loading="avatarUploading"
                :disabled="avatarUploading"
              >
                {{ avatarUploading ? "上传中..." : "上传头像" }}
              </el-button>
            </el-upload>
          </div>
          <p class="text-xs text-slate-500 mt-2">
            支持 JPG、PNG 格式，大小不超过 2MB
          </p>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="editForm.username"
            placeholder="请输入用户名"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="editForm.phone"
            placeholder="请输入手机号"
            maxlength="11"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSaveEdit">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!-- 编辑共享车位弹窗 -->
    <el-dialog
      title="编辑共享车位"
      :visible.sync="showEditSpotDialog"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editSpotForm"
        :model="editSpotForm"
        label-width="120px"
        class="space-y-4"
      >
        <el-form-item label="车位名称" required>
          <el-input
            v-model="editSpotForm.name"
            placeholder="例如：阳光小区A栋地下车库"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="详细地址" required>
          <el-input
            v-model="editSpotForm.address"
            placeholder="请输入详细地址"
            maxlength="200"
          ></el-input>
        </el-form-item>
        <el-form-item label="车位照片 URL">
          <el-input
            v-model="editSpotForm.img"
            placeholder="例如：https://example.com/parking.jpg"
            type="url"
          ></el-input>
          <p class="text-xs text-slate-500 mt-1">
            支持直接填写图片链接；如需上传请先传至图床后粘贴链接。
          </p>
          <div v-if="editSpotForm.img" class="mt-2">
            <p class="text-xs text-slate-600 mb-1">预览：</p>
            <img
              :src="editSpotForm.img"
              alt="车位照片预览"
              class="w-full max-w-md rounded-lg border border-slate-200"
              @error="handleImageError"
            />
          </div>
        </el-form-item>
        <el-form-item label="总车位数" required>
          <el-input-number
            v-model="editSpotForm.totalSpaces"
            :min="1"
            :max="999"
            placeholder="例如：1"
            class="w-full"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="空闲车位数" required>
          <el-input-number
            v-model="editSpotForm.availableSpaces"
            :min="0"
            :max="editSpotForm.totalSpaces || 999"
            placeholder="例如：1"
            class="w-full"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="每小时价格(元)" required>
          <el-input-number
            v-model="editSpotForm.pricePerHour"
            :min="0"
            :precision="2"
            placeholder="例如：10.00"
            class="w-full"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditSpotDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="editSpotSaving"
          @click="handleSaveEditSpot"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ParkingPagination from "@/components/ParkingPagination.vue";
import { getUserInfo, uploadAvatar, updateProfile } from "@/api/uset";
import { getAppointment, SureAppointment } from "@/api/appointment";
import { AppointmenVO, ParkingHistoryVO } from "@/api";
import {
  getMyParkingLots,
  updateParkingLot,
  deleteParkingLot,
} from "@/api/ParkingLot";
import { getParkingHistory } from "@/api/ParkingHistory";

interface SharedSpot {
  id: number;
  name: string;
  address: string;
  img: string; // 图片URL（可能为null）
  totalSpaces: number; // 总车位数
  availableSpaces: number; // 可用车位数
  price: number; // 每小时价格
  distance?: number; // 距离（可选）
}

export default Vue.extend({
  name: "UserCenterView",
  components: {
    ParkingPagination,
  },
  data() {
    // 手机号验证规则
    const validatePhone = (
      rule: unknown,
      value: string,
      callback: (error?: Error) => void
    ) => {
      if (value && !/^1\d{10}$/.test(value)) {
        callback(new Error("请输入正确的11位手机号"));
      } else {
        callback();
      }
    };

    return {
      userInfo: {
        username: "",
        phone: "",
        avatar: "",
      },
      showEditDialog: false,
      editForm: {
        username: "",
        phone: "",
        avatar: "",
      },
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名长度为2-20个字符",
            trigger: "blur",
          },
        ],
        phone: [{ validator: validatePhone, trigger: "blur" }],
      },
      saving: false,
      avatarUploading: false, // 头像上传 loading 状态
      activeTab: "reservations",
      showReservationDetailDialog: false,
      selectedReservation: null as AppointmenVO | null,
      reservations: [] as AppointmenVO[],
      sharedSpots: [] as SharedSpot[],
      parkingHistory: [] as ParkingHistoryVO[],
      reservationCurrentPage: 1,
      reservationPageSize: 10,
      sharedCurrentPage: 1,
      sharedPageSize: 10,
      sharedSpotsTotal: 0, // 共享车位总数（从后端获取）
      historyCurrentPage: 1,
      historyPageSize: 10,
      parkingHistoryTotal: 0, // 停车历史记录总数（从后端获取）
      // “我的预约”详情弹窗中的操作 loading 状态
      reservationConfirming: false,
      reservationPaying: false,
      // 编辑共享车位对话框
      showEditSpotDialog: false,
      editingSpot: null as SharedSpot | null,
      editSpotForm: {
        name: "",
        address: "",
        img: "",
        totalSpaces: 0,
        availableSpaces: 0,
        pricePerHour: 0,
      },
      editSpotSaving: false,
    };
  },
  mounted() {
    this.loadUserInfo();
    // 检查URL参数，如果tab=history则切换到历史记录标签页
    const tab = this.$route.query.tab as string;
    if (tab === "history") {
      this.activeTab = "history";
    }

    // 加载停车历史记录
    this.loadParkingHistory();
    // 加载预约信息
    this.loadReservations();
    this.loadMyParking();
  },
  watch: {
    // 监听路由变化，当从添加页面返回时刷新历史记录
    $route(to, from) {
      if (from.name === "AddParkingHistory" && to.name === "UserCenter") {
        this.loadParkingHistory();
        // 如果URL参数中有tab=history，切换到历史记录标签页
        if (to.query.tab === "history") {
          this.activeTab = "history";
        }
      }
    },
  },
  computed: {
    /**
     * 分页后的预约列表
     */
    pagedReservations(): AppointmenVO[] {
      const start =
        (this.reservationCurrentPage - 1) * this.reservationPageSize;
      const end = start + this.reservationPageSize;
      return this.reservations.slice(start, end);
    },
    /**
     * 分页后的共享车位列表（后端已分页，直接返回）
     */
    pagedSharedSpots(): SharedSpot[] {
      return this.sharedSpots;
    },
    /**
     * 分页后的停车历史记录（后端已分页，直接返回）
     */
    pagedParkingHistory(): ParkingHistoryVO[] {
      return this.parkingHistory;
    },
  },
  methods: {
    async loadUserInfo() {
      try {
        const res = await getUserInfo();
        if (res.data?.code === 200) {
          this.userInfo = {
            username: res.data.data.username || "",
            phone: res.data.data.phone || "未填写",
            avatar: "http://localhost:8080" + res.data.data.avatarUrl || "",
          };
          // 同步到编辑表单
          this.editForm = {
            username: this.userInfo.username,
            phone: this.userInfo.phone === "未填写" ? "" : this.userInfo.phone,
            avatar: this.userInfo.avatar,
          };
        } else {
          this.$message.error(res.data?.message || "获取用户信息失败");
        }
      } catch (error) {
        this.$message.error("获取用户信息失败");
      }
    },
    async loadReservations() {
      const res = await getAppointment({
        pageNum: Number(this.reservationCurrentPage) || 1,
        pageSize: Number(this.reservationPageSize) || 10,
      });
      if (res.data?.code === 200) {
        this.reservations = res.data.data.data;
      } else {
        this.$message.error(res.data?.message || "获取预约信息失败");
      }
    },
    /**
     * 加载我的共享车位列表
     */
    async loadMyParking() {
      try {
        const res = await getMyParkingLots({
          pageNum: Number(this.sharedCurrentPage) || 1,
          pageSize: Number(this.sharedPageSize) || 10,
        });
        if (res.data?.code === 200) {
          // 将后端返回的 ParkingLotVO 映射到前端的 SharedSpot
          const parkingLots = res.data.data?.data || [];
          this.sharedSpotsTotal = res.data.data?.total || 0;
          this.sharedSpots = parkingLots
            .filter((lot) => lot.type === 1) // 只显示共享车位（type === 1）
            .map((lot) => ({
              // 只使用后端返回的字段
              id: lot.id,
              name: lot.name,
              address: lot.address,
              img: lot.img || "", // 图片URL（可能为null）
              totalSpaces: lot.totalSpaces, // 总车位数
              availableSpaces: lot.availableSpaces, // 可用车位数
              price: lot.pricePerHour, // 每小时价格
              distance: lot.distance, // 距离（可选）
            }));
        } else {
          this.$message.error(res.data?.message || "获取共享车位列表失败");
        }
      } catch (error) {
        console.error("加载共享车位失败:", error);
        this.$message.error("获取共享车位列表失败，请稍后重试");
      }
    },
    // 打开编辑弹窗时初始化表单
    openEditDialog() {
      this.showEditDialog = true;
      this.editForm = {
        username: this.userInfo.username,
        phone: this.userInfo.phone === "未填写" ? "" : this.userInfo.phone,
        avatar: this.userInfo.avatar,
      };
    },
    // 保存编辑
    async handleSaveEdit() {
      const form = this.$refs.editForm as unknown as {
        validate: (callback: (valid: boolean) => void) => void;
      };
      if (!form) return;

      form.validate(async (valid: boolean) => {
        if (!valid) {
          return false;
        }

        this.saving = true;
        try {
          // 使用新的 updateProfile 接口
          const res = await updateProfile({
            username: this.editForm.username,
            phone: this.editForm.phone || undefined,
            // 如果头像已上传，使用上传后的 URL；否则不更新头像
            avatar: this.editForm.avatar || undefined,
          });

          if (res.data?.code === 200) {
            this.$message.success("保存成功");
            this.showEditDialog = false;
            // 重新加载用户信息
            await this.loadUserInfo();
            // 通知父组件（导航栏）更新用户信息
            this.$root.$emit("user-info-updated");
          } else {
            this.$message.error(res.data?.message || "保存失败");
          }
        } catch (error) {
          console.error("保存用户资料失败:", error);
          this.$message.error("保存失败，请稍后重试");
        } finally {
          this.saving = false;
        }
      });
    },
    // 头像上传前验证
    beforeAvatarUpload(file: File) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("头像图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("头像图片大小不能超过 2MB!");
        return false;
      }
      return true;
    },
    /**
     * 处理头像上传
     */
    async handleAvatarUpload(options: { file: File }) {
      const file = options.file;
      this.avatarUploading = true;
      try {
        const res = await uploadAvatar(file);
        if (res.data?.code === 200) {
          // 更新表单中的头像 URL
          this.editForm.avatar =
            "http://localhost:8080" + res.data.data?.avatarUrl || "";
          this.$message.success("头像上传成功");
          // 立即更新显示的头像
          if (res.data.data?.avatarUrl) {
            this.userInfo.avatar = res.data.data.avatarUrl;
          }
          // 通知父组件（导航栏）更新用户信息
          this.$root.$emit("user-info-updated");
        } else {
          this.$message.error(res.data?.message || "头像上传失败");
        }
      } catch (error) {
        console.error("头像上传失败:", error);
        this.$message.error("头像上传失败，请稍后重试");
      } finally {
        this.avatarUploading = false;
      }
    },
    /**
     * 加载停车历史记录（从后端API）
     */
    async loadParkingHistory() {
      try {
        const res = await getParkingHistory({
          pageNum: Number(this.historyCurrentPage) || 1,
          pageSize: Number(this.historyPageSize) || 10,
        });
        if (res.data?.code === 200) {
          this.parkingHistory = res.data.data.data;
          this.parkingHistoryTotal = res.data.data.total || 0;
        } else {
          this.$message.error(res.data?.message || "获取停车历史记录失败");
        }
      } catch (error) {
        console.error("加载停车历史记录失败:", error);
        this.$message.error("获取停车历史记录失败，请稍后重试");
      }
    },
    async cancelReservation(id: number) {
      try {
        await this.$confirm("确定要取消这个预约吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const index = this.reservations.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.reservations[index].status = 3;
          this.$message.success("预约已取消");
        }
      } catch {
        // 用户取消操作
      }
    },
    /**
     * 在“我的预约”详情弹窗中确认预约
     */
    async handleConfirmFromDetail() {
      if (!this.selectedReservation) return;
      if (this.reservationConfirming) return;

      this.reservationConfirming = true;
      try {
        const res = await SureAppointment(this.selectedReservation.id);
        if (res.data?.code === 200) {
          this.$message.success("预约已确认");
          // 更新当前选中预约和列表中的状态
          this.selectedReservation.status = 1;
          const idx = this.reservations.findIndex(
            (r) => r.id === this.selectedReservation!.id
          );
          if (idx !== -1) {
            this.reservations[idx].status = 1;
          }
        } else {
          this.$message.error(res.data?.message || "确认预约失败");
        }
      } catch (e) {
        this.$message.error("确认预约失败，请稍后重试");
      } finally {
        this.reservationConfirming = false;
      }
    },
    /**
     * 在“我的预约”详情弹窗中支付
     */
    async handlePayFromDetail() {
      if (!this.selectedReservation) return;
      if (this.reservationPaying) return;

      this.reservationPaying = true;
      try {
        const traceNo =
          window.crypto && "randomUUID" in window.crypto
            ? (window.crypto as any).randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        const aliPayData = {
          traceNo,
          totalAmount: this.selectedReservation.cost,
          subject: this.selectedReservation.parkingName,
        };

        window.open(
          `http://localhost:8080/api/user/alipay/pay?traceNo=${aliPayData.traceNo}&totalAmount=${aliPayData.totalAmount}&subject=${aliPayData.subject}`,
          "_blank"
        );

        this.$message.success("支付成功，预约已完成，请按时到达停车场。");

        // 更新状态为“已完成”
        this.selectedReservation.status = 2;
        const idx = this.reservations.findIndex(
          (r) => r.id === this.selectedReservation!.id
        );
        if (idx !== -1) {
          this.reservations[idx].status = 2;
        }
      } catch (e) {
        this.$message.error("支付失败，请稍后重试");
      } finally {
        this.reservationPaying = false;
      }
    },
    handleReservationSizeChange(newSize: number) {
      this.reservationPageSize = newSize;
      this.reservationCurrentPage = 1;
    },
    handleReservationPageChange(newPage: number) {
      this.reservationCurrentPage = newPage;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    handleSharedSizeChange(newSize: number) {
      this.sharedPageSize = newSize;
      this.sharedCurrentPage = 1;
      this.loadMyParking(); // 重新加载数据
    },
    handleSharedPageChange(newPage: number) {
      this.sharedCurrentPage = newPage;
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.loadMyParking(); // 重新加载数据
    },
    handleHistorySizeChange(newSize: number) {
      this.historyPageSize = newSize;
      this.historyCurrentPage = 1;
      this.loadParkingHistory(); // 重新加载数据
    },
    handleHistoryPageChange(newPage: number) {
      this.historyCurrentPage = newPage;
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.loadParkingHistory(); // 重新加载数据
    },
    openReservationDetail(reservation: AppointmenVO) {
      this.selectedReservation = reservation;
      this.showReservationDetailDialog = true;
    },
    /**
     * 打开编辑共享车位对话框
     */
    editSpot(id: number) {
      const spot = this.sharedSpots.find((s) => s.id === id);
      if (!spot) {
        this.$message.error("未找到该共享车位");
        return;
      }
      this.editingSpot = spot;
      // 填充表单数据
      this.editSpotForm = {
        name: spot.name,
        address: spot.address,
        img: spot.img || "",
        totalSpaces: spot.totalSpaces,
        availableSpaces: spot.availableSpaces,
        pricePerHour: spot.price,
      };
      this.showEditSpotDialog = true;
    },
    /**
     * 保存编辑的共享车位
     */
    async handleSaveEditSpot() {
      if (!this.editingSpot) {
        return;
      }

      // 表单验证
      if (!this.editSpotForm.name || !this.editSpotForm.name.trim()) {
        this.$message.warning("请输入车位名称");
        return;
      }
      if (!this.editSpotForm.address || !this.editSpotForm.address.trim()) {
        this.$message.warning("请输入详细地址");
        return;
      }
      if (this.editSpotForm.totalSpaces <= 0) {
        this.$message.warning("总车位数必须大于0");
        return;
      }
      if (
        this.editSpotForm.availableSpaces < 0 ||
        this.editSpotForm.availableSpaces > this.editSpotForm.totalSpaces
      ) {
        this.$message.warning("空闲车位数不能小于0且不能大于总车位数");
        return;
      }
      if (this.editSpotForm.pricePerHour < 0) {
        this.$message.warning("每小时价格不能小于0");
        return;
      }

      // 图片URL验证
      if (this.editSpotForm.img) {
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(this.editSpotForm.img)) {
          this.$message.warning("请输入有效的图片链接（需以 http/https 开头）");
          return;
        }
      }

      this.editSpotSaving = true;
      try {
        const res = await updateParkingLot({
          id: this.editingSpot.id,
          name: this.editSpotForm.name.trim(),
          address: this.editSpotForm.address.trim(),
          img: this.editSpotForm.img || undefined,
          totalSpaces: this.editSpotForm.totalSpaces,
          availableSpaces: this.editSpotForm.availableSpaces,
          pricePerHour: this.editSpotForm.pricePerHour,
          type: 1, // 共享车位
        });

        if (res.data?.code === 200) {
          this.$message.success("编辑成功");
          this.showEditSpotDialog = false;
          // 重新加载共享车位列表
          await this.loadMyParking();
        } else {
          this.$message.error(res.data?.message || "编辑失败，请稍后重试");
        }
      } catch (error) {
        console.error("编辑共享车位失败:", error);
        this.$message.error("编辑失败，请稍后重试");
      } finally {
        this.editSpotSaving = false;
      }
    },
    /**
     * 删除共享车位
     */
    async deleteSpot(id: number) {
      const spot = this.sharedSpots.find((s) => s.id === id);
      if (!spot) {
        this.$message.error("未找到该共享车位");
        return;
      }

      try {
        await this.$confirm(
          `确定要删除共享车位"${spot.name}"吗？此操作不可恢复。`,
          "确认删除",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );

        // 调用删除API
        const res = await deleteParkingLot(id);

        if (res.data?.code === 200) {
          this.$message.success("删除成功");
          // 重新加载共享车位列表
          await this.loadMyParking();
        } else {
          this.$message.error(res.data?.message || "删除失败，请稍后重试");
        }
      } catch (error: any) {
        // 用户取消删除
        if (error === "cancel") {
          return;
        }
        console.error("删除共享车位失败:", error);
        this.$message.error("删除失败，请稍后重试");
      }
    },
    /**
     * 处理图片加载错误
     */
    handleImageError(event: Event) {
      const img = event.target as HTMLImageElement;
      img.style.display = "none"; // 隐藏加载失败的图片
    },
    /**
     * 格式化日期时间显示
     * 将 ISO 格式（2024-12-17T09:00:00）转换为友好格式（2024-12-17 09:00）
     */
    formatDateTime(dateTimeStr: string): string {
      if (!dateTimeStr) return "";
      try {
        // 处理 ISO 格式：2024-12-17T09:00:00
        const date = new Date(dateTimeStr);
        if (isNaN(date.getTime())) {
          // 如果不是有效的日期，尝试直接格式化字符串
          return dateTimeStr.replace("T", " ").substring(0, 16);
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      } catch (e) {
        // 如果解析失败，返回原始字符串（去掉 T 和秒数）
        return dateTimeStr.replace("T", " ").substring(0, 16);
      }
    },
  },
});
</script>
