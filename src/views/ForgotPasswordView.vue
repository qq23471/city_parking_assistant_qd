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
          安全 · 重置密码
        </p>
        <div class="space-y-4">
          <h1 class="text-3xl font-bold leading-tight md:text-4xl">
            忘记密码？用手机号找回
          </h1>
          <p class="text-sm text-slate-200 md:text-base">
            输入注册手机号并设置新密码，提交后重置。
          </p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 text-sm text-slate-200">
          <div class="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <p class="font-semibold text-emerald-200">手机号验证</p>
            <p class="mt-2 text-xs text-slate-200">
              输入注册手机号，等待后端发送短信验证码(未实现)。
            </p>
          </div>
          <div class="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <p class="font-semibold text-emerald-200">直接设置新密码</p>
            <p class="mt-2 text-xs text-slate-200">输入新密码，提交后重置。</p>
          </div>
        </div>
      </section>

      <section class="flex-1">
        <div
          class="rounded-2xl border border-white/10 bg-slate-900/70 text-white shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/30 backdrop-blur"
        >
          <div class="border-b border-white/10 px-6 py-4">
            <h2 class="text-xl font-bold text-white">重置密码</h2>
            <p class="text-xs text-slate-300">
              输入手机号与新密码，提交后重置密码。
            </p>
          </div>
          <form class="space-y-4 px-6 py-6" @submit.prevent="handleReset">
            <label class="block text-sm font-medium text-slate-200">
              注册手机号
              <input
                v-model="phone"
                type="tel"
                placeholder="请输入注册手机号（11位）"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </label>
            <label class="block text-sm font-medium text-slate-200">
              新密码
              <input
                v-model="newPassword"
                type="password"
                placeholder="输入新密码"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
                minlength="6"
              />
            </label>
            <label class="block text-sm font-medium text-slate-200">
              确认新密码
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="再次输入新密码"
                class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </label>
            <button
              type="submit"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <span v-if="!loading">提交重置</span>
              <span v-else>正在提交...</span>
            </button>
            <p class="text-xs text-slate-300">
              已想起密码？
              <router-link
                to="/"
                class="font-semibold text-emerald-300 hover:text-emerald-200"
              >
                返回登录
              </router-link>
            </p>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import http from "@/api/http";
import { resetPassword } from "@/api/uset";

export default Vue.extend({
  name: "ForgotPasswordView",
  data() {
    return {
      phone: "",
      newPassword: "",
      confirmPassword: "",
      loading: false,
    };
  },
  methods: {
    async handleReset() {
      if (this.loading) return;
      if (this.newPassword !== this.confirmPassword) {
        this.$message.error("两次输入的密码不一致");
        return;
      }
      if (!/^1\d{10}$/.test(this.phone)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      this.loading = true;
      try {
        const res = await resetPassword({
          phone: this.phone,
          newPassword: this.newPassword,
        });
        if (res.data.code === 200) {
          this.$message.success("重置密码成功");
          this.$router.push("/");
        } else {
          this.$message.error(res.data.message);
        }
      } catch (error) {
        this.$message.error("重置密码失败");
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
