<script setup lang="ts">
</script>

<template>
  <div class="process-steps">
    <h3 class="process-heading">How It Works</h3>
    <div class="steps-container">
      <!-- Step 1 -->
      <div class="step">
        <div class="step-circle">
          <svg class="step-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <div class="step-content">
          <span class="step-title">Submit Application</span>
          <span class="step-desc">Fill in your details &amp; background info</span>
        </div>
      </div>

      <!-- Connector -->
      <div class="step-connector">
        <svg class="connector-svg" viewBox="0 0 32 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="12" x2="22" y2="12"/>
          <polyline points="16 6 24 12 16 18"/>
        </svg>
      </div>

      <!-- Step 2 -->
      <div class="step">
        <div class="step-circle">
          <svg class="step-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div class="step-content">
          <span class="step-title">We'll Match You</span>
          <span class="step-desc">Our team finds the right position for you</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.process-steps {
  padding: 16px var(--spacing-md);
  background: var(--color-card);
}

.process-heading {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.steps-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  background: linear-gradient(135deg, #fff8f6 0%, #fffdfc 50%, #fef6f3 100%);
  border: 1px solid #f5ddd6;
  border-radius: 14px;
  padding: 18px 10px;
  box-shadow: 0 1px 3px rgba(208, 0, 0, 0.04);
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
}

.step-circle {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, #b80000 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(208, 0, 0, 0.3);
}

.step-svg {
  width: 18px;
  height: 18px;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.step-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.3;
  letter-spacing: 0.2px;
}

.step-desc {
  font-size: 10px;
  color: #8e8e93;
  line-height: 1.35;
  font-weight: 400;
}

.step-connector {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 6px;
}

.connector-svg {
  width: 24px;
  height: 20px;
  color: #d00000;
  opacity: 0.55;
}
</style>
