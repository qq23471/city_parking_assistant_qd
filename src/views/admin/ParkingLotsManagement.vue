<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">停车场管理</h2>
        <p class="text-sm text-slate-600 mt-1">管理所有停车场信息</p>
      </div>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
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
          placeholder="搜索停车场名称或地址..."
          class="flex-1 min-w-0 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <select
          v-model="filterType"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-40 flex-shrink-0"
        >
          <option value="">全部类型</option>
          <option value="0">公共停车场</option>
          <option value="1">商务停车场</option>
        </select>
      </div>
    </div>

    <!-- 停车场列表 -->
    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <!-- ... (table head remains same) ... -->
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
                类型
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
                价格/小时
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
              >
                距离(km)
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
              v-for="lot in parkingLots"
              :key="lot.id"
              class="hover:bg-slate-50 transition"
            >
              <!-- ... (row cells remain same) ... -->
              <td class="px-6 py-4 text-sm font-medium text-slate-900">
                {{ lot.name }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                {{ lot.address }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-blue-100 text-blue-700': lot.type === 0,
                    'bg-green-100 text-green-700': lot.type === 1,
                  }"
                >
                  {{ lot.type === 0 ? "公共" : "共享" }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                {{ lot.totalSpaces }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                <span
                  :class="{
                    'text-green-600 font-semibold': lot.availableSpaces > 0,
                    'text-red-600 font-semibold': lot.availableSpaces === 0,
                  }"
                >
                  {{ lot.availableSpaces }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                ¥{{ lot.pricePerHour }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                {{ lot.distance || 0 }}km
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button
                    @click="editParkingLot(lot)"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
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

      <!-- 分页区域 -->
      <div
        class="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50"
      >
        <div class="text-sm text-slate-600">
          共 <span class="font-medium">{{ total }}</span> 条记录
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        >
        </el-pagination>
      </div>
    </div>

    <!-- 添加/编辑模态框 -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4"
      @click.self="showAddModal = false"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl my-auto">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">
          {{ editingLot ? "编辑停车场" : "添加停车场" }}
        </h3>
        <form @submit.prevent="saveParkingLot" class="space-y-4">
          <!-- 第一行：名称和类型 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                停车场名称 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                maxlength="100"
                required
                placeholder="请输入停车场名称"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                类型 <span class="text-red-500">*</span>
              </label>
              <select
                v-model.number="formData.type"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option :value="0">公共停车场</option>
                <option :value="1">商务停车场</option>
              </select>
            </div>
          </div>

          <!-- 地址 -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              地址 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.address"
              type="text"
              maxlength="200"
              required
              placeholder="请输入详细地址"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <!-- 图片URL -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              图片URL
            </label>
            <input
              v-model="formData.img"
              type="url"
              maxlength="200"
              placeholder="请输入图片URL（可选）"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p class="text-xs text-slate-500 mt-1">
              支持图片链接，留空则使用默认图片
            </p>
          </div>

          <!-- 第二行：总车位和空闲车位 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                总车位数 <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.totalSpaces"
                type="number"
                min="0"
                required
                placeholder="请输入总车位数"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                :max="formData.totalSpaces"
                required
                placeholder="请输入空闲车位数"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <!-- 第三行：价格和距离 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                每小时价格(元) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.pricePerHour"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                距离(km)
              </label>
              <input
                v-model.number="formData.distance"
                type="number"
                min="0"
                placeholder="0"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <!-- 按钮 -->
          <div class="flex gap-3 mt-6 pt-4 border-t border-slate-200">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving">保存中...</span>
              <span v-else>保存</span>
            </button>
            <button
              type="button"
              @click="cancelEdit"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition disabled:opacity-50"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  createParkingLot,
  updateParkingLot,
  deleteParkingLot,
} from "@/api/ParkingLot";
import { getAdminParkingLots } from "@/api/Admin";
import { ParkingLotVO } from "@/api/index";

interface ParkingLot extends ParkingLotVO {
  id: number;
  name: string;
  address: string;
  img: string;
  totalSpaces: number;
  availableSpaces: number;
  type: number;
  pricePerHour: number;
  distance?: number;
}

export default Vue.extend({
  name: "ParkingLotsManagement",
  data() {
    return {
      searchQuery: "",
      filterType: "",
      showAddModal: false,
      editingLot: null as ParkingLot | null,
      saving: false,
      formData: {
        name: "",
        address: "",
        img: "",
        totalSpaces: 0,
        availableSpaces: 0,
        type: 0, // 0: 公共, 1: 商务
        pricePerHour: 0,
        distance: 0,
      },
      parkingLots: [] as ParkingLot[],
      loading: false,
      total: 0,
      pageNum: 1,
      pageSize: 10,
    };
  },
  watch: {
    searchQuery() {
      this.pageNum = 1;
      this.loadParkingLots();
    },
    filterType() {
      this.pageNum = 1;
      this.loadParkingLots();
    },
  },
  mounted() {
    this.loadParkingLots();
  },
  methods: {
    /**
     * 加载停车场列表
     */
    async loadParkingLots() {
      this.loading = true;
      try {
        const params: any = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        };
        if (this.searchQuery) {
          params.keyword = this.searchQuery;
        }
        if (this.filterType !== "") {
          params.type = Number(this.filterType);
        }
        const response = await getAdminParkingLots(params);
        if (response.data?.code === 200) {
          this.parkingLots = response.data.data?.data || [];
          this.total = response.data.data?.total || 0;
        } else {
          this.$message.error(response.data?.message || "加载停车场列表失败");
        }
      } catch (error) {
        console.error("加载停车场列表失败:", error);
        this.$message.error("加载停车场列表失败，请稍后重试");
      } finally {
        this.loading = false;
      }
    },

    /**
     * 处理分页大小变化
     */
    handleSizeChange(val: number) {
      this.pageSize = val;
      this.pageNum = 1;
      this.loadParkingLots();
    },

    /**
     * 处理当前页变化
     */
    handleCurrentChange(val: number) {
      this.pageNum = val;
      this.loadParkingLots();
    },

    /**
     * 编辑停车场
     */
    editParkingLot(lot: ParkingLot) {
      this.editingLot = lot;
      this.formData = {
        name: lot.name,
        address: lot.address,
        img: lot.img || "",
        totalSpaces: lot.totalSpaces,
        availableSpaces: lot.availableSpaces,
        type: lot.type,
        pricePerHour: lot.pricePerHour,
        distance: lot.distance || 0,
      };
      this.showAddModal = true;
    },

    /**
     * 保存停车场
     */
    async saveParkingLot() {
      // 表单验证
      if (!this.formData.name || !this.formData.name.trim()) {
        this.$message.error("请输入停车场名称");
        return;
      }
      if (!this.formData.address || !this.formData.address.trim()) {
        this.$message.error("请输入地址");
        return;
      }
      if (this.formData.totalSpaces < 0) {
        this.$message.error("总车位数不能小于0");
        return;
      }
      if (this.formData.availableSpaces < 0) {
        this.$message.error("空闲车位数不能小于0");
        return;
      }
      if (this.formData.availableSpaces > this.formData.totalSpaces) {
        this.$message.error("空闲车位数不能大于总车位数");
        return;
      }
      if (this.formData.pricePerHour < 0) {
        this.$message.error("价格不能小于0");
        return;
      }

      this.saving = true;
      try {
        if (this.editingLot) {
          // 更新
          const response = await updateParkingLot({
            id: this.editingLot.id,
            ...this.formData,
          });
          if (response.data.code === 200) {
            this.$message.success("更新成功");
            await this.loadParkingLots();
            this.cancelEdit();
          } else {
            this.$message.error(response.data.message || "更新失败");
          }
        } else {
          // 新增
          const response = await createParkingLot(this.formData);
          if (response.data.code === 200) {
            this.$message.success("添加成功");
            await this.loadParkingLots();
            this.cancelEdit();
          } else {
            this.$message.error(response.data.message || "添加失败");
          }
        }
      } catch (error: any) {
        console.error("保存停车场失败:", error);
        this.$message.error("保存失败，请稍后重试");
      } finally {
        this.saving = false;
      }
    },

    /**
     * 取消编辑
     */
    cancelEdit() {
      this.showAddModal = false;
      this.editingLot = null;
      this.formData = {
        name: "",
        address: "",
        img: "",
        totalSpaces: 0,
        availableSpaces: 0,
        type: 0,
        pricePerHour: 0,
        distance: 0,
      };
    },

    /**
     * 删除停车场
     */
    async deleteParkingLot(id: number) {
      this.$confirm("确定要删除这个停车场吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const response = await deleteParkingLot(id);
            if (response.data.code === 200) {
              this.$message.success("删除成功");
              await this.loadParkingLots();
            } else {
              this.$message.error(response.data.message || "删除失败");
            }
          } catch (error) {
            console.error("删除停车场失败:", error);
            this.$message.error("删除失败，请稍后重试");
          }
        })
        .catch(() => {
          // 用户取消
        });
    },
  },
});
</script>
