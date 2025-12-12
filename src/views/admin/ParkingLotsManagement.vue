<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">停车场管理</h2>
        <p class="text-sm text-slate-600 mt-1">管理所有停车场信息</p>
      </div>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
      >
        + 添加停车场
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white rounded-xl flex shadow-sm p-4 border border-slate-200">
      <div class="w-full gap-4 flex">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索停车场名称..."
          class="flex-1 min-w-0 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-40 flex-shrink-0"
        >
          <option value="">全部状态</option>
          <option value="active">运营中</option>
          <option value="maintenance">维护中</option>
          <option value="closed">已关闭</option>
        </select>
      </div>
    </div>

    <!-- 停车场列表 -->
    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
            >
              停车场名称
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
            >
              地址
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
            >
              总车位数
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
            >
              空闲车位
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
            >
              状态
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr
            v-for="lot in filteredParkingLots"
            :key="lot.id"
            class="hover:bg-slate-50 transition"
          >
            <td class="px-6 py-4 text-sm font-medium text-slate-900">
              {{ lot.name }}
            </td>
            <td class="px-6 py-4 text-sm text-slate-600">{{ lot.address }}</td>
            <td class="px-6 py-4 text-sm text-slate-600">
              {{ lot.totalSpots }}
            </td>
            <td class="px-6 py-4 text-sm text-slate-600">
              {{ lot.availableSpots }}
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-700': lot.status === 'active',
                  'bg-yellow-100 text-yellow-700': lot.status === 'maintenance',
                  'bg-red-100 text-red-700': lot.status === 'closed',
                }"
              >
                {{
                  lot.status === "active"
                    ? "运营中"
                    : lot.status === "maintenance"
                    ? "维护中"
                    : "已关闭"
                }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <button
                  @click="editParkingLot(lot)"
                  class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  编辑
                </button>
                <button
                  @click="deleteParkingLot(lot.id)"
                  class="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加/编辑模态框 -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showAddModal = false"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">
          {{ editingLot ? "编辑停车场" : "添加停车场" }}
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >停车场名称</label
            >
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >地址</label
            >
            <input
              v-model="formData.address"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >总车位数</label
            >
            <input
              v-model.number="formData.totalSpots"
              type="number"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >状态</label
            >
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="active">运营中</option>
              <option value="maintenance">维护中</option>
              <option value="closed">已关闭</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button
            @click="saveParkingLot"
            class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            保存
          </button>
          <button
            @click="cancelEdit"
            class="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface ParkingLot {
  id: number;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  status: string;
}

export default Vue.extend({
  name: "ParkingLotsManagement",
  data() {
    return {
      searchQuery: "",
      filterStatus: "",
      showAddModal: false,
      editingLot: null as ParkingLot | null,
      formData: {
        name: "",
        address: "",
        totalSpots: 0,
        status: "active",
      },
      parkingLots: [
        {
          id: 1,
          name: "市中心商业区停车场",
          address: "市中心商业街123号",
          totalSpots: 200,
          availableSpots: 45,
          status: "active",
        },
        {
          id: 2,
          name: "火车站停车场",
          address: "火车站广场",
          totalSpots: 150,
          availableSpots: 12,
          status: "active",
        },
        {
          id: 3,
          name: "医院停车场",
          address: "市第一医院",
          totalSpots: 100,
          availableSpots: 8,
          status: "active",
        },
        {
          id: 4,
          name: "购物中心停车场",
          address: "万达广场",
          totalSpots: 300,
          availableSpots: 89,
          status: "maintenance",
        },
      ] as ParkingLot[],
    };
  },
  computed: {
    filteredParkingLots(): ParkingLot[] {
      let filtered = this.parkingLots;
      if (this.searchQuery) {
        filtered = filtered.filter(
          (lot) =>
            lot.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            lot.address.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      if (this.filterStatus) {
        filtered = filtered.filter((lot) => lot.status === this.filterStatus);
      }
      return filtered;
    },
  },
  methods: {
    editParkingLot(lot: ParkingLot) {
      this.editingLot = lot;
      this.formData = {
        name: lot.name,
        address: lot.address,
        totalSpots: lot.totalSpots,
        status: lot.status,
      };
      this.showAddModal = true;
    },
    saveParkingLot() {
      if (this.editingLot) {
        // 更新
        const index = this.parkingLots.findIndex(
          (lot) => lot.id === this.editingLot!.id
        );
        if (index !== -1) {
          this.parkingLots[index] = {
            ...this.editingLot,
            ...this.formData,
            availableSpots: this.parkingLots[index].availableSpots,
          };
        }
      } else {
        // 新增
        this.parkingLots.push({
          id: Date.now(),
          ...this.formData,
          availableSpots: this.formData.totalSpots,
        });
      }
      this.cancelEdit();
      alert("保存成功！");
    },
    cancelEdit() {
      this.showAddModal = false;
      this.editingLot = null;
      this.formData = {
        name: "",
        address: "",
        totalSpots: 0,
        status: "active",
      };
    },
    deleteParkingLot(id: number) {
      if (confirm("确定要删除这个停车场吗？")) {
        this.parkingLots = this.parkingLots.filter((lot) => lot.id !== id);
        alert("删除成功！");
      }
    },
  },
});
</script>
