<script setup lang="ts">
// Application list — placeholder, will be implemented in Phase 4
</script>

<template>
  <div class="app-list-page">
    <header class="page-header">
      <h1>YiwuTrade — 留学生招聘管理系统</h1>
      <span class="user-info">管理员</span>
    </header>
    <main class="page-main">
      <p class="hint">留学生管理列表开发中…</p>
    </main>
  </div>
</template>

<style scoped>
.app-list-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.page-header h1 {
  font-size: 18px;
  font-weight: 600;
}

.user-info {
  color: #909399;
  font-size: 14px;
}

.page-main {
  padding: 48px;
  text-align: center;
}

.hint {
  color: #909399;
  font-size: 15px;
  margin-top: 48px;
}
</style>
