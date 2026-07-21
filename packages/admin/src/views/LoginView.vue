<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const route = useRoute();
const { login, rememberMe } = useAuth();

const formRef = ref();
const submitting = ref(false);
const errorMsg = ref('');

const form = reactive({
  username: '',
  password: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  errorMsg.value = '';

  try {
    await login({ username: form.username, password: form.password });
    const redirect = (route.query.redirect as string) || '/applications';
    router.push(redirect);
  } catch (err: any) {
    errorMsg.value = err.message || '登录失败，请重试';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Logo + Title -->
      <div class="login-header">
        <img
          src="/logo.jpg"
          alt="YiwuTrade"
          class="login-logo"
          @error="($event.target as HTMLImageElement).style.display='none'"
        />
        <h1>YiwuTrade</h1>
        <p class="subtitle">留学生招聘管理系统</p>
      </div>

      <!-- Error alert -->
      <el-alert
        v-if="errorMsg"
        :title="errorMsg"
        type="error"
        show-icon
        :closable="true"
        @close="errorMsg = ''"
        style="margin-bottom: 20px;"
      />

      <!-- Login Form -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="'User'"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <div class="login-options">
          <el-checkbox v-model="rememberMe" label="记住我" size="small" />
        </div>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="submitting"
            :disabled="submitting"
            class="login-btn"
            @click="handleLogin"
          >
            {{ submitting ? '登录中…' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #d00000 0%, #800000 100%);
  padding: 20px;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px 32px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  margin-bottom: 12px;
  object-fit: cover;
}

.login-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 4px;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.login-options {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-btn {
  width: 100%;
  height: 46px;
  font-size: 16px;
  letter-spacing: 4px;
}

.login-btn:not(.is-disabled) {
  --el-button-bg-color: var(--color-primary);
  --el-button-border-color: var(--color-primary);
  --el-button-hover-bg-color: var(--color-primary-dark);
  --el-button-hover-border-color: var(--color-primary-dark);
}
</style>
