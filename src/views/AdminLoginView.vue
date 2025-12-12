<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
  >
    <div
      class="mx-auto flex h-screen max-w-5xl flex-col gap-10 px-6 py-12 md:flex-row md:items-center"
    >
      <section class="flex-1 space-y-6">
        <p
          class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.08em] text-emerald-200 ring-1 ring-white/20"
        >
          管理后台 · 安全登录
        </p>
        <div class="space-y-4">
          <h1 class="text-3xl font-bold leading-tight md:text-4xl">
            城市停车后台管理
          </h1>
          <p class="text-sm text-slate-200 md:text-base">
            管理停车场、共享车位审核、用户举报与数据看板。仅限管理员使用。
          </p>
        </div>
        <ul class="space-y-3 text-sm text-slate-200">
          <li class="flex items-start gap-2">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-emerald-400"></span>
            支持车位占用监控与状态同步。
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-emerald-400"></span>
            共享车位审核、用户管理、举报处理。
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-emerald-400"></span>
            报表与可视化：车位利用率、热门时段、收入统计。
          </li>
        </ul>
      </section>

      <section class="flex-1">
        <div
          class="rounded-2xl border border-white/10 bg-slate-900/80 text-white shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/30 backdrop-blur"
        >
          <div class="border-b border-white/10 px-6 py-4">
            <h2 class="text-xl font-bold text-white">管理员登录</h2>
            <p class="text-xs text-slate-300">
              请输入管理员账号、密码和验证码。
            </p>
          </div>
          <form class="space-y-4 px-6 py-6" @submit.prevent="handleLogin">
            <label class="block text-sm font-medium text-slate-200">
              管理员账号
              <input
                v-model="account"
                type="text"
                placeholder="例如: admin123"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </label>
            <label class="block text-sm font-medium text-slate-200">
              管理员密码
              <input
                v-model="password"
                type="password"
                placeholder="请输入管理员密码"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </label>
            <div class="grid gap-3 sm:grid-cols-[2fr,1fr]">
              <label class="block text-sm font-medium text-slate-200">
                验证码
                <input
                  v-model="captchaInput"
                  type="text"
                  placeholder="请输入右侧验证码"
                  class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </label>
              <button
                type="button"
                class="mt-6 w-full rounded-lg border border-emerald-500/40 bg-emerald-600/20 px-3 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-600/30 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
                @click="generateCaptcha"
              >
                {{ captcha }}
              </button>
            </div>
            <div
              class="flex items-center justify-between text-xs text-slate-300"
            >
              <label class="inline-flex items-center gap-2">
                <input
                  v-model="rememberMe"
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-500 bg-slate-800 text-emerald-400 focus:ring-emerald-500"
                />
                记住我（7 天）
              </label>
              <router-link
                to="/"
                class="font-semibold text-emerald-300 hover:text-emerald-200"
              >
                返回用户登录
              </router-link>
            </div>
            <button
              type="submit"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <span v-if="!loading">登录后台</span>
              <span v-else>正在登录...</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const ADMIN_SESSION_KEY = "city_parking_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 天

export default Vue.extend({
  name: "AdminLoginView",
  data() {
    return {
      account: "",
      password: "",
      rememberMe: true,
      loading: false,
      captcha: "",
      captchaInput: "",
    };
  },
  mounted() {
    this.generateCaptcha();
  },
  methods: {
    generateCaptcha() {
      const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 4; i += 1) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      this.captcha = code;
    },
    handleLogin() {
      if (this.loading) return;
      if (
        !this.captchaInput ||
        this.captchaInput.trim().toUpperCase() !== this.captcha
      ) {
        alert("验证码不正确，请重新输入");
        this.generateCaptcha();
        this.captchaInput = "";
        return;
      }
      this.loading = true;
      // TODO: 接入后台管理员登录接口
      setTimeout(() => {
        this.loading = false;
        this.$router.push("/admin/dashboard");
      }, 600);
    },
  },
});
</script>
