<script setup lang="ts">
// Registration page — placeholder, will be implemented in Phase 3
</script>

<template>
  <div class="registration-page">
    <div class="placeholder">
      <h1>International Students Recruitment</h1>
      <p>YiwuTrade</p>
      <p class="hint">Registration form coming soon…</p>
    </div>
  </div>
</template>

<style scoped>
.registration-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}

.placeholder {
  text-align: center;
  color: #ffffff;
}

.placeholder h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.placeholder p {
  font-size: 16px;
  opacity: 0.85;
}

.hint {
  margin-top: 24px;
  font-size: 14px;
  opacity: 0.6;
}
</style>
