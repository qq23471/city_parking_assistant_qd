<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">用户举报管理</h2>
      <p class="text-sm text-slate-600 mt-1">处理用户提交的举报信息</p>
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
        全部 ({{ totalCount }})
      </button>
      <button
        @click="filterStatus = '0'"
        :class="
          filterStatus === '0'
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-slate-700 border border-slate-300'
        "
        class="px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        待处理 ({{ pendingCount }})
      </button>
      <button
        @click="filterStatus = '1'"
        :class="
          filterStatus === '1'
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-slate-700 border border-slate-300'
        "
        class="px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        已处理 ({{ resolvedCount }})
      </button>
    </div>

    <!-- 举报列表 -->
    <div
      class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
              >
                举报类型
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
              >
                举报内容
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
              >
                举报人（ID）
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase"
              >
                举报时间
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
              v-for="report in reports"
              :key="report.id"
              class="hover:bg-slate-50 transition"
            >
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getReportTypeTagClass(report.type)"
                >
                  {{ getReportTypeLabel(report.type) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="max-w-md">
                  <p class="text-xs text-slate-600 line-clamp-2">
                    {{ report.content }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                <p class="text-xs text-slate-500">
                  用户ID：{{ report.reporterId ?? "-" }}
                </p>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                {{ formatDateTime(report.reportTime) }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-700': report.status === 0,
                    'bg-green-100 text-green-700': report.status === 1,
                  }"
                >
                  {{ report.status === 0 ? "待处理" : "已处理" }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button
                    v-if="report.status === 0"
                    @click="viewReport(report)"
                    class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    查看
                  </button>
                  <button
                    v-if="report.status === 0"
                    @click="resolveReport(report.id)"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    处理
                  </button>
                  <button
                    @click="deleteReportItem(report.id)"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="reports.length === 0 && !loading">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">
                暂无举报记录
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

    <!-- 查看详情模态框 -->
    <div
      v-if="showDetailModal && selectedReport"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showDetailModal = false"
    >
      <div
        class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <h3 class="text-lg font-semibold text-slate-900 mb-4">举报详情</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >举报类型</label
            >
            <p class="text-sm text-slate-900">
              {{ getReportTypeLabel(selectedReport.type) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >详细内容</label
            >
            <p class="text-sm text-slate-900 whitespace-pre-wrap">
              {{ selectedReport.content }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >举报人信息</label
            >
            <div class="text-sm text-slate-900 space-y-1">
              <p class="text-xs text-slate-500">
                用户ID：{{ selectedReport.reporterId }}
              </p>
              <p v-if="reporterLoading" class="text-xs text-slate-400">
                正在加载用户信息...
              </p>
              <div
                v-else-if="reporterInfo"
                class="text-xs text-slate-700 space-y-1"
              >
                <p>用户名：{{ reporterInfo.username || "未知" }}</p>
                <p v-if="reporterInfo.phone">
                  手机号：{{ reporterInfo.phone }}
                </p>
              </div>
              <button
                v-if="!reporterLoading && !reporterInfo"
                @click="loadReporterInfo"
                class="mt-1 inline-flex items-center px-2 py-1 text-xs text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-100 transition"
              >
                查看用户信息
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >举报时间</label
            >
            <p class="text-sm text-slate-900">
              {{ formatDateTime(selectedReport.reportTime) }}
            </p>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button
            v-if="selectedReport.status === 0"
            @click="resolveReport(selectedReport.id)"
            class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            标记为已处理
          </button>
          <button
            @click="showDetailModal = false"
            class="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getReports,
  getReportDetail,
  handleReport,
  deleteReport,
  getUserInfo,
} from "@/api/Admin";
import { ReportVO, UserInfoVO, ReportQueryDto } from "@/api/index";

export default Vue.extend({
  name: "UserReportsManagement",
  data() {
    return {
      loading: false,
      filterStatus: "", // 空字符串表示全部，0: 待处理, 1: 已处理
      showDetailModal: false,
      selectedReport: null as ReportVO | null,
      reports: [] as ReportVO[],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 统计数据
      totalCount: 0,
      pendingCount: 0,
      resolvedCount: 0,
      // 举报人信息
      reporterInfo: null as UserInfoVO | null,
      reporterLoading: false,
    };
  },
  mounted() {
    this.loadReports();
  },
  watch: {
    filterStatus() {
      this.pageNum = 1;
      this.loadReports();
    },
  },
  methods: {
    /**
     * 加载统计数字
     */
    async loadCounts() {
      try {
        // 分别请求不同状态的总数
        const [allRes, pendingRes, resolvedRes] = await Promise.all([
          getReports({ pageNum: 1, pageSize: 1 }),
          getReports({ pageNum: 1, pageSize: 1, status: 0 }),
          getReports({ pageNum: 1, pageSize: 1, status: 1 }),
        ]);

        if (allRes.data?.code === 200) this.totalCount = allRes.data.data.total;
        if (pendingRes.data?.code === 200)
          this.pendingCount = pendingRes.data.data.total;
        if (resolvedRes.data?.code === 200)
          this.resolvedCount = resolvedRes.data.data.total;
      } catch (error) {
        console.error("加载举报统计失败:", error);
      }
    },

    /**
     * 加载举报列表
     */
    async loadReports() {
      this.loading = true;
      try {
        const params: ReportQueryDto = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        };
        if (this.filterStatus !== "") {
          params.status = Number(this.filterStatus);
        }
        const res = await getReports(params);
        if (res.data?.code === 200) {
          this.reports = res.data.data?.data || [];
          this.total = res.data.data?.total || 0;

          // 刷新总计数
          this.loadCounts();
        } else {
          this.$message.error(res.data?.message || "获取举报列表失败");
        }
      } catch (error) {
        console.error("加载举报列表失败:", error);
        this.$message.error("获取举报列表失败，请稍后重试");
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
      this.loadReports();
    },

    /**
     * 处理当前页变化
     */
    handleCurrentChange(val: number) {
      this.pageNum = val;
      this.loadReports();
    },
    /**
     * 查看举报详情
     */
    async viewReport(report: ReportVO) {
      try {
        const res = await getReportDetail(report.id);
        if (res.data?.code === 200) {
          this.selectedReport = res.data.data;
          this.reporterInfo = null;
          this.showDetailModal = true;
        } else {
          this.$message.error(res.data?.message || "获取举报详情失败");
        }
      } catch (error) {
        console.error("获取举报详情失败:", error);
        this.$message.error("获取举报详情失败，请稍后重试");
      }
    },
    /**
     * 加载举报人用户信息
     */
    async loadReporterInfo() {
      if (!this.selectedReport?.reporterId) {
        this.$message.warning("缺少用户ID，无法查询用户信息");
        return;
      }
      if (this.reporterLoading) return;
      this.reporterLoading = true;
      try {
        const res = await getUserInfo(this.selectedReport.reporterId);
        if (res.data?.code === 200) {
          this.reporterInfo = res.data.data || null;
        } else {
          this.$message.error(res.data?.message || "获取用户信息失败");
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
        this.$message.error("获取用户信息失败，请稍后重试");
      } finally {
        this.reporterLoading = false;
      }
    },
    /**
     * 处理举报
     */
    async resolveReport(id: number) {
      try {
        await this.$confirm("确定要标记为已处理吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const res = await handleReport({ id });
        if (res.data?.code === 200) {
          this.showDetailModal = false;
          this.$message.success("已标记为已处理");
          await this.loadReports();
        } else {
          this.$message.error(res.data?.message || "处理失败");
        }
      } catch (error: any) {
        if (error !== "cancel") {
          console.error("处理举报失败:", error);
          this.$message.error("处理失败，请稍后重试");
        }
      }
    },
    /**
     * 删除举报
     */
    async deleteReportItem(id: number) {
      try {
        await this.$confirm("确定要删除这个举报吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const res = await deleteReport(id);
        if (res.data?.code === 200) {
          this.$message.success("删除成功");
          await this.loadReports();
        } else {
          this.$message.error(res.data?.message || "删除失败");
        }
      } catch (error: any) {
        if (error !== "cancel") {
          console.error("删除举报失败:", error);
          this.$message.error("删除失败，请稍后重试");
        }
      }
    },
    /**
     * 格式化日期时间
     */
    formatDateTime(dateTime: string): string {
      if (!dateTime) return "";
      try {
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      } catch {
        return dateTime;
      }
    },
    /**
     * 根据举报类型 code 获取展示文案
     */
    getReportTypeLabel(type: string): string {
      switch (type) {
        case "false_info":
          return "虚假信息";
        case "price_fraud":
          return "价格欺诈";
        case "service_issue":
          return "服务问题";
        case "safety_issue":
          return "安全隐患";
        case "other":
          return "其他问题";
        default:
          return type || "其他问题";
      }
    },
    /**
     * 根据举报类型 code 获取标签样式
     */
    getReportTypeTagClass(type: string): string {
      switch (type) {
        case "false_info":
          return "bg-red-100 text-red-700";
        case "price_fraud":
          return "bg-orange-100 text-orange-700";
        case "service_issue":
          return "bg-yellow-100 text-yellow-700";
        case "safety_issue":
          return "bg-purple-100 text-purple-700";
        case "other":
        default:
          return "bg-blue-100 text-blue-700";
      }
    },
  },
});
</script>
