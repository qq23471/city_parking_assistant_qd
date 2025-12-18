<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
  >
    <div
      class="mx-auto flex h-screen max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:items-center"
    >
      <section class="flex-1 space-y-6">
        <p
          class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.08em] text-emerald-200 ring-1 ring-white/20"
        >
          车位共享 · 安全注册
        </p>
        <div class="space-y-4">
          <h1 class="text-3xl font-bold leading-tight md:text-4xl">
            新用户注册 · 加入智慧城市停车平台
          </h1>
          <p class="text-sm text-slate-200 md:text-base">
            一次注册，体验车位共享、实时车位查询、预约与导航等完整能力。
          </p>
        </div>
        <ul class="space-y-3 text-sm text-slate-200">
          <li class="flex items-start gap-2">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-emerald-400"></span>
            支持车主发布共享车位与价格时段。
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-emerald-400"></span>
            智能推荐最近/最优车位，快速导航。
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-emerald-400"></span>
            数据加密存储，保障账号安全。
          </li>
        </ul>
      </section>

      <section class="flex-1">
        <div
          class="rounded-2xl border border-white/10 bg-slate-900/70 text-white shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/30 backdrop-blur"
        >
          <div class="border-b border-white/10 px-6 py-4">
            <h2 class="text-xl font-bold text-white">注册新账号</h2>
            <p class="text-xs text-slate-300">
              填写基础信息，体验车位共享与智能停车。
            </p>
          </div>
          <form class="space-y-4 px-6 py-6" @submit.prevent="handleRegister">
            <label class="block text-sm font-medium text-slate-200">
              用户名
              <input
                v-model="account"
                type="text"
                pattern="^1\\d{10}$"
                placeholder="例如: user123"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </label>
            <label class="block text-sm font-medium text-slate-200">
              密码
              <input
                v-model="password"
                type="password"
                placeholder="设置登录密码"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
                minlength="6"
              />
            </label>
            <label class="block text-sm font-medium text-slate-200">
              确认密码
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </label>
            <label class="block text-sm font-medium text-slate-200">
              手机号（可选）
              <input
                v-model="phone"
                type="tel"
                placeholder="用于找回密码与消息通知"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>
            <button
              type="submit"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <span v-if="!loading">创建账号</span>
              <span v-else>正在提交...</span>
            </button>
            <p class="text-xs text-slate-300">
              已有账号？
              <router-link
                to="/"
                class="font-semibold text-emerald-300 hover:text-emerald-200"
              >
                直接登录
              </router-link>
            </p>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { register } from "@/api/uset";
import Vue from "vue";

export default Vue.extend({
  name: "RegisterView",
  data() {
    return {
      account: "",
      password: "",
      confirmPassword: "",
      phone: "",
      loading: false,
    };
  },
  methods: {
    async handleRegister() {
      if (this.loading) return;
      if (this.password !== this.confirmPassword) {
        this.$message.error("两次输入的密码不一致");
        return;
      }
      this.loading = true;
      try {
        const res = await register({
          username: this.account,
          password: this.password,
          phone: this.phone,
        });
        if (res.data.code === 200) {
          this.$message.success("注册成功");
          this.$router.push("/");
        } else {
          this.$message.error(res.data.message);
        }
      } catch (error) {
        this.$message.error("注册失败");
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
