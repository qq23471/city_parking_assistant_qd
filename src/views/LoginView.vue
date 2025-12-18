<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
  >
    <div
      class="mx-auto flex h-screen max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:items-center"
    >
      <!-- Hero / copy -->
      <section class="flex-1 space-y-6">
        <p
          class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.08em] text-emerald-200 ring-1 ring-white/20"
        >
          智慧城市 · 车位共享 · 导航推荐
        </p>
        <div class="space-y-4">
          <h1 class="text-3xl font-bold leading-tight md:text-4xl">
            智慧城市停车引导与车位共享平台
          </h1>
          <p class="text-sm text-slate-200 md:text-base">
            实时发现附近车位、共享自家车位、智能推荐最优停车点，并支持预约与导航。
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <p class="text-sm font-semibold text-emerald-200">
              实时车位 · 地图可视化
            </p>
            <p class="mt-2 text-xs text-slate-200">
              绿色空闲 / 红色已占用，距离、费用、余量一目了然。
            </p>
          </div>
          <div class="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <p class="text-sm font-semibold text-emerald-200">
              智能推荐 · 共享经济
            </p>
            <p class="mt-2 text-xs text-slate-200">
              按距离/价格/偏好排序，支持发布和预约私家车位。
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 text-xs text-slate-200">
          <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            地图 API
          </span>
          <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            车位共享
          </span>
          <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            预约与导航
          </span>
          <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            ECharts 可视化
          </span>
        </div>
      </section>

      <!-- Auth card -->
      <section class="flex-1">
        <div
          class="rounded-2xl border border-white/10 bg-slate-900/70 text-white shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/30 backdrop-blur"
        >
          <div class="border-b border-white/10 px-6 py-4">
            <h2 class="text-xl font-bold text-white">欢迎来到城市停车助手</h2>
            <p class="text-xs text-slate-300">
              输入账号密码即可体验智能停车与车位共享。
            </p>
          </div>
          <form class="space-y-4 px-6 py-6" @submit.prevent="handleLogin">
            <label class="block text-sm font-medium text-slate-200">
              用户名
              <input
                v-model="account"
                type="text"
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
                placeholder="请输入密码"
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
                记住我
              </label>
              <router-link
                to="/forgot"
                class="font-semibold text-emerald-300 hover:text-emerald-200"
              >
                忘记密码？
              </router-link>
            </div>
            <button
              type="submit"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <span v-if="!loading">登录</span>
              <span v-else>正在登录...</span>
            </button>
            <p class="text-xs text-slate-300">
              还没有账号？
              <router-link
                to="/register"
                class="font-semibold text-emerald-300 hover:text-emerald-200"
              >
                立即注册
              </router-link>
            </p>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { login } from "@/api/uset";
import Vue from "vue";
export default Vue.extend({
  name: "LoginView",
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
    async handleLogin() {
      if (this.loading) return;
      if (
        !this.captchaInput ||
        this.captchaInput.trim().toUpperCase() !== this.captcha
      ) {
        this.$message.error("验证码不正确");
        this.generateCaptcha();
        this.captchaInput = "";
        return;
      }
      this.loading = true;
      //TODO: 接入登录接口
      try {
        await login({
          username: this.account,
          password: this.password,
          rememberMe: this.rememberMe,
        }).then((res) => {
          if (res.data.code === 200) {
            localStorage.setItem("city_parking_token", res.data.data.token);
            this.$router.push("/home/index");
          } else {
            this.$message.error(res.data.message);
          }
        });
      } catch (error) {
        this.$message.error("登录失败");
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
