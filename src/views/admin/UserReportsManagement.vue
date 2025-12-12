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
        全部 ({{ reports.length }})
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
        待处理 ({{ pendingCount }})
      </button>
      <button
        @click="filterStatus = 'resolved'"
        :class="
          filterStatus === 'resolved'
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
              举报人
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
            v-for="report in filteredReports"
            :key="report.id"
            class="hover:bg-slate-50 transition"
          >
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-red-100 text-red-700': report.type === '虚假信息',
                  'bg-orange-100 text-orange-700': report.type === '价格欺诈',
                  'bg-yellow-100 text-yellow-700': report.type === '服务问题',
                  'bg-blue-100 text-blue-700': report.type === '其他',
                }"
              >
                {{ report.type }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="max-w-md">
                <p class="text-sm font-medium text-slate-900">
                  {{ report.title }}
                </p>
                <p class="text-xs text-slate-600 mt-1 line-clamp-2">
                  {{ report.content }}
                </p>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600">
              {{ report.reporter }}
            </td>
            <td class="px-6 py-4 text-sm text-slate-600">
              {{ report.reportTime }}
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-700': report.status === 'pending',
                  'bg-green-100 text-green-700': report.status === 'resolved',
                }"
              >
                {{ report.status === "pending" ? "待处理" : "已处理" }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <button
                  v-if="report.status === 'pending'"
                  @click="viewReport(report)"
                  class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  查看
                </button>
                <button
                  v-if="report.status === 'pending'"
                  @click="resolveReport(report.id)"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  处理
                </button>
                <button
                  @click="deleteReport(report.id)"
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
            <p class="text-sm text-slate-900">{{ selectedReport.type }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >标题</label
            >
            <p class="text-sm text-slate-900">{{ selectedReport.title }}</p>
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
              >举报人</label
            >
            <p class="text-sm text-slate-900">{{ selectedReport.reporter }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >举报时间</label
            >
            <p class="text-sm text-slate-900">
              {{ selectedReport.reportTime }}
            </p>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button
            v-if="selectedReport.status === 'pending'"
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

interface Report {
  id: number;
  type: string;
  title: string;
  content: string;
  reporter: string;
  reportTime: string;
  status: string;
}

export default Vue.extend({
  name: "UserReportsManagement",
  data() {
    return {
      filterStatus: "pending",
      showDetailModal: false,
      selectedReport: null as Report | null,
      reports: [
        {
          id: 1,
          type: "虚假信息",
          title: "车位地址与实际不符",
          content:
            "该共享车位标注的地址与实际位置相差较远，导致我无法找到车位，浪费了时间。",
          reporter: "用户A",
          reportTime: "2024-01-15 14:30",
          status: "pending",
        },
        {
          id: 2,
          type: "价格欺诈",
          title: "实际收费与标注价格不一致",
          content:
            "标注价格为5元/小时，但实际收费时要求10元/小时，存在价格欺诈行为。",
          reporter: "用户B",
          reportTime: "2024-01-14 10:20",
          status: "pending",
        },
        {
          id: 3,
          type: "服务问题",
          title: "车位已被占用但未更新状态",
          content:
            "预约时显示空闲，到达后发现车位已被占用，系统状态更新不及时。",
          reporter: "用户C",
          reportTime: "2024-01-13 16:45",
          status: "resolved",
        },
        {
          id: 4,
          type: "虚假信息",
          title: "车位照片与实际不符",
          content: "上传的车位照片与实际车位环境完全不同，存在误导行为。",
          reporter: "用户D",
          reportTime: "2024-01-12 09:15",
          status: "pending",
        },
        {
          id: 5,
          type: "其他",
          title: "车位环境脏乱差",
          content: "车位周围环境脏乱，存在安全隐患，不适合停车。",
          reporter: "用户E",
          reportTime: "2024-01-11 11:30",
          status: "resolved",
        },
      ] as Report[],
    };
  },
  computed: {
    filteredReports(): Report[] {
      if (!this.filterStatus) {
        return this.reports;
      }
      return this.reports.filter((r) => r.status === this.filterStatus);
    },
    pendingCount(): number {
      return this.reports.filter((r) => r.status === "pending").length;
    },
    resolvedCount(): number {
      return this.reports.filter((r) => r.status === "resolved").length;
    },
  },
  methods: {
    viewReport(report: Report) {
      this.selectedReport = report;
      this.showDetailModal = true;
    },
    resolveReport(id: number) {
      if (confirm("确定要标记为已处理吗？")) {
        const report = this.reports.find((r) => r.id === id);
        if (report) {
          report.status = "resolved";
          this.showDetailModal = false;
          alert("已标记为已处理");
        }
      }
    },
    deleteReport(id: number) {
      if (confirm("确定要删除这个举报吗？")) {
        this.reports = this.reports.filter((r) => r.id !== id);
        alert("删除成功");
      }
    },
  },
});
</script>
