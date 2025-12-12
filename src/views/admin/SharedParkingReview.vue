<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">共享车位审核</h2>
      <p class="text-sm text-slate-600 mt-1">审核用户提交的共享车位申请</p>
    </div>

    <!-- 筛选标签 -->
    <div class="flex gap-2">
      <button
        @click="filterStatus = ''"
        :class="
          filterStatus === ''
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-slate-700 border border-slate-300'
        "
        class="px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        全部 ({{ sharedParkings.length }})
      </button>
      <button
        @click="filterStatus = 'pending'"
        :class="
          filterStatus === 'pending'
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-slate-700 border border-slate-300'
        "
        class="px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        待审核 ({{ pendingCount }})
      </button>
      <button
        @click="filterStatus = 'approved'"
        :class="
          filterStatus === 'approved'
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-slate-700 border border-slate-300'
        "
        class="px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        已通过 ({{ approvedCount }})
      </button>
      <button
        @click="filterStatus = 'rejected'"
        :class="
          filterStatus === 'rejected'
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-slate-700 border border-slate-300'
        "
        class="px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        已拒绝 ({{ rejectedCount }})
      </button>
    </div>

    <!-- 共享车位列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="parking in filteredSharedParkings"
        :key="parking.id"
        class="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-slate-900">
              {{ parking.address }}
            </h3>
            <p class="text-sm text-slate-600 mt-1">
              发布者：{{ parking.owner }}
            </p>
          </div>
          <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="{
              'bg-yellow-100 text-yellow-700': parking.status === 'pending',
              'bg-green-100 text-green-700': parking.status === 'approved',
              'bg-red-100 text-red-700': parking.status === 'rejected',
            }"
          >
            {{
              parking.status === "pending"
                ? "待审核"
                : parking.status === "approved"
                ? "已通过"
                : "已拒绝"
            }}
          </span>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600">价格</span>
            <span class="font-semibold text-slate-900"
              >¥{{ parking.price }}/小时</span
            >
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600">可预约时间</span>
            <span class="font-medium text-slate-900">{{
              parking.availableTime
            }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600">提交时间</span>
            <span class="text-slate-600">{{ parking.submitTime }}</span>
          </div>
        </div>

        <div v-if="parking.description" class="mb-4">
          <p class="text-sm text-slate-600 line-clamp-2">
            {{ parking.description }}
          </p>
        </div>

        <div v-if="parking.status === 'pending'" class="flex gap-2">
          <button
            @click="approveParking(parking.id)"
            class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
          >
            通过
          </button>
          <button
            @click="rejectParking(parking.id)"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
          >
            拒绝
          </button>
        </div>
        <div v-else class="text-sm text-slate-600">
          <p>审核时间：{{ parking.reviewTime }}</p>
          <p v-if="parking.reviewNote">备注：{{ parking.reviewNote }}</p>
        </div>
      </div>
    </div>

    <div v-if="filteredSharedParkings.length === 0" class="text-center py-12">
      <p class="text-slate-600">暂无数据</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface SharedParking {
  id: number;
  address: string;
  owner: string;
  price: number;
  availableTime: string;
  description: string;
  status: string;
  submitTime: string;
  reviewTime?: string;
  reviewNote?: string;
}

export default Vue.extend({
  name: "SharedParkingReview",
  data() {
    return {
      filterStatus: "pending",
      sharedParkings: [
        {
          id: 1,
          address: "市中心小区A座地下停车场",
          owner: "张三",
          price: 5,
          availableTime: "工作日 18:00-次日8:00",
          description: "位于市中心，交通便利，安全可靠",
          status: "pending",
          submitTime: "2024-01-15 10:30",
        },
        {
          id: 2,
          address: "商业街附近私人车位",
          owner: "李四",
          price: 8,
          availableTime: "全天",
          description: "靠近商业区，适合购物停车",
          status: "pending",
          submitTime: "2024-01-14 15:20",
        },
        {
          id: 3,
          address: "学校附近居民区车位",
          owner: "王五",
          price: 4,
          availableTime: "周末全天",
          description: "安静安全，适合长时间停车",
          status: "approved",
          submitTime: "2024-01-10 09:00",
          reviewTime: "2024-01-10 14:30",
          reviewNote: "信息真实，已通过审核",
        },
        {
          id: 4,
          address: "火车站附近车位",
          owner: "赵六",
          price: 10,
          availableTime: "工作日 9:00-17:00",
          description: "位置优越，方便出行",
          status: "rejected",
          submitTime: "2024-01-08 11:15",
          reviewTime: "2024-01-08 16:00",
          reviewNote: "地址信息不准确",
        },
        {
          id: 5,
          address: "医院附近小区车位",
          owner: "孙七",
          price: 6,
          availableTime: "工作日 19:00-次日7:00",
          description: "靠近医院，方便就医停车",
          status: "pending",
          submitTime: "2024-01-16 08:45",
        },
      ] as SharedParking[],
    };
  },
  computed: {
    filteredSharedParkings(): SharedParking[] {
      if (!this.filterStatus) {
        return this.sharedParkings;
      }
      return this.sharedParkings.filter((p) => p.status === this.filterStatus);
    },
    pendingCount(): number {
      return this.sharedParkings.filter((p) => p.status === "pending").length;
    },
    approvedCount(): number {
      return this.sharedParkings.filter((p) => p.status === "approved").length;
    },
    rejectedCount(): number {
      return this.sharedParkings.filter((p) => p.status === "rejected").length;
    },
  },
  methods: {
    approveParking(id: number) {
      if (confirm("确定要通过这个共享车位申请吗？")) {
        const parking = this.sharedParkings.find((p) => p.id === id);
        if (parking) {
          parking.status = "approved";
          parking.reviewTime = new Date().toLocaleString("zh-CN");
          parking.reviewNote = "审核通过";
          alert("审核通过！");
        }
      }
    },
    rejectParking(id: number) {
      const note = prompt("请输入拒绝原因：");
      if (note !== null) {
        const parking = this.sharedParkings.find((p) => p.id === id);
        if (parking) {
          parking.status = "rejected";
          parking.reviewTime = new Date().toLocaleString("zh-CN");
          parking.reviewNote = note || "审核未通过";
          alert("已拒绝申请");
        }
      }
    },
  },
});
</script>
