<script setup lang="ts">
// Login page — placeholder, will be implemented in Phase 4
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>YiwuTrade</h1>
      <p>留学生招聘管理系统</p>
      <p class="hint">登录功能开发中…</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}

.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  min-width: 360px;
}

.login-card h1 {
  font-size: 28px;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.login-card p {
  color: #606266;
  margin-bottom: 16px;
}

.hint {
  font-size: 13px;
  color: #909399;
  margin-top: 24px;
}
</style>
