<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">个人中心</h2>
      <p class="text-sm text-slate-600 mt-1">管理您的预约和共享车位</p>
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
        </div>
      </div>

      <div class="p-6">
        <!-- 我的预约 -->
        <div v-if="activeTab === 'reservations'" class="space-y-4">
          <div
            v-for="reservation in reservations"
            :key="reservation.id"
            class="bg-slate-50 rounded-lg p-4 border border-slate-200"
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
                  <span
                    class="px-3 py-1 text-xs font-medium rounded-full flex-shrink-0"
                    :class="{
                      'bg-blue-100 text-blue-700':
                        reservation.status === 'pending',
                      'bg-green-100 text-green-700':
                        reservation.status === 'confirmed',
                      'bg-yellow-100 text-yellow-700':
                        reservation.status === 'active',
                      'bg-slate-100 text-slate-700':
                        reservation.status === 'completed',
                      'bg-red-100 text-red-700':
                        reservation.status === 'cancelled',
                    }"
                  >
                    {{
                      reservation.status === "pending"
                        ? "待确认"
                        : reservation.status === "confirmed"
                        ? "已确认"
                        : reservation.status === "active"
                        ? "进行中"
                        : reservation.status === "completed"
                        ? "已完成"
                        : "已取消"
                    }}
                  </span>
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
                  v-if="
                    reservation.status === 'pending' ||
                    reservation.status === 'confirmed'
                  "
                  @click="cancelReservation(reservation.id)"
                  class="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm whitespace-nowrap"
                >
                  取消预约
                </button>
                <button
                  @click="viewDetail(reservation.parkingId)"
                  class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm whitespace-nowrap"
                >
                  查看详情
                </button>
                <button
                  v-if="
                    reservation.status === 'active' ||
                    reservation.status === 'confirmed'
                  "
                  @click="openNavigation(reservation.address)"
                  class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm whitespace-nowrap"
                >
                  导航
                </button>
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
        </div>

        <!-- 我的共享车位 -->
        <div v-if="activeTab === 'shared'" class="space-y-4">
          <div
            v-for="spot in sharedSpots"
            :key="spot.id"
            class="bg-slate-50 rounded-lg p-4 border border-slate-200"
          >
            <div class="flex flex-col md:flex-row gap-4">
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
                  </div>
                  <span
                    class="px-3 py-1 text-xs font-medium rounded-full flex-shrink-0"
                    :class="{
                      'bg-yellow-100 text-yellow-700':
                        spot.status === 'pending',
                      'bg-green-100 text-green-700': spot.status === 'approved',
                      'bg-red-100 text-red-700': spot.status === 'rejected',
                    }"
                  >
                    {{
                      spot.status === "pending"
                        ? "审核中"
                        : spot.status === "approved"
                        ? "已通过"
                        : "已拒绝"
                    }}
                  </span>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p class="text-slate-600 mb-1">价格</p>
                    <p class="font-medium text-emerald-600">
                      ¥{{ spot.price }}/小时
                    </p>
                  </div>
                  <div>
                    <p class="text-slate-600 mb-1">可用时间</p>
                    <p class="font-medium text-slate-900">
                      {{ spot.startTime }} - {{ spot.endTime }}
                    </p>
                  </div>
                  <div>
                    <p class="text-slate-600 mb-1">总收益</p>
                    <p class="font-medium text-slate-900">
                      ¥{{ spot.totalEarnings }}
                    </p>
                  </div>
                  <div>
                    <p class="text-slate-600 mb-1">预约次数</p>
                    <p class="font-medium text-slate-900">
                      {{ spot.reservationCount }} 次
                    </p>
                  </div>
                </div>
                <div
                  v-if="spot.status === 'rejected' && spot.rejectReason"
                  class="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <p class="text-sm text-red-800">
                    <span class="font-medium">拒绝原因：</span
                    >{{ spot.rejectReason }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-2 flex-shrink-0">
                <button
                  v-if="spot.status === 'approved'"
                  @click="editSpot(spot.id)"
                  class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm whitespace-nowrap"
                >
                  编辑
                </button>
                <button
                  v-if="spot.status === 'approved'"
                  @click="toggleSpotStatus(spot.id)"
                  class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm whitespace-nowrap"
                >
                  {{ spot.isActive ? "暂停" : "启用" }}
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface Reservation {
  id: number;
  parkingId: number;
  parkingName: string;
  address: string;
  date: string;
  time: string;
  duration: number;
  cost: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
}

interface SharedSpot {
  id: number;
  name: string;
  address: string;
  price: number;
  startTime: string;
  endTime: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  totalEarnings: number;
  reservationCount: number;
  rejectReason?: string;
}

export default Vue.extend({
  name: "UserCenterView",
  data() {
    return {
      activeTab: "reservations",
      reservations: [
        {
          id: 1,
          parkingId: 5,
          parkingName: "张先生私家车位",
          address: "阳光小区A栋地下车库",
          date: "2024-01-15",
          time: "14:00",
          duration: 3,
          cost: 12,
          status: "confirmed",
        },
        {
          id: 2,
          parkingId: 6,
          parkingName: "李女士共享车位",
          address: "绿城花园3号楼",
          date: "2024-01-16",
          time: "10:00",
          duration: 2,
          cost: 10,
          status: "pending",
        },
      ] as Reservation[],
      sharedSpots: [
        {
          id: 1,
          name: "我的私家车位",
          address: "阳光小区A栋地下车库",
          price: 4,
          startTime: "08:00",
          endTime: "20:00",
          status: "approved",
          isActive: true,
          totalEarnings: 156,
          reservationCount: 12,
        },
        {
          id: 2,
          name: "小区共享车位",
          address: "绿城花园3号楼",
          price: 5,
          startTime: "09:00",
          endTime: "18:00",
          status: "pending",
          isActive: false,
          totalEarnings: 0,
          reservationCount: 0,
        },
      ] as SharedSpot[],
    };
  },
  methods: {
    cancelReservation(id: number) {
      if (confirm("确定要取消这个预约吗？")) {
        const index = this.reservations.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.reservations[index].status = "cancelled";
          alert("预约已取消");
        }
      }
    },
    viewDetail(parkingId: number) {
      this.$router.push({
        name: "ParkingDetail",
        params: { id: parkingId.toString() },
      });
    },
    openNavigation(address: string) {
      // TODO: 集成导航API
      alert(`开始导航到：${address}`);
    },
    editSpot(id: number) {
      // TODO: 跳转到编辑页面
      alert("编辑功能开发中...");
    },
    toggleSpotStatus(id: number) {
      const spot = this.sharedSpots.find((s) => s.id === id);
      if (spot) {
        spot.isActive = !spot.isActive;
        alert(spot.isActive ? "车位已启用" : "车位已暂停");
      }
    },
    deleteSpot(id: number) {
      if (confirm("确定要删除这个共享车位吗？")) {
        this.sharedSpots = this.sharedSpots.filter((s) => s.id !== id);
        alert("删除成功");
      }
    },
  },
});
</script>
