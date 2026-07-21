<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const bannerRef = ref<HTMLElement>();
const offset = ref(0);

function onScroll() {
  if (!bannerRef.value) return;
  offset.value = window.scrollY * 0.3;
}

let scrollRaf = 0;
function onScrollThrottled() {
  cancelAnimationFrame(scrollRaf);
  scrollRaf = requestAnimationFrame(onScroll);
}

onMounted(() => window.addEventListener('scroll', onScrollThrottled, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScrollThrottled));
</script>

<template>
  <div class="banner-wrapper" ref="bannerRef">
    <div
      class="banner-parallax"
      :style="{ transform: `translateY(${offset}px)` }"
    >
      <div class="banner-bg">
        <!-- Geometric particles -->
        <div class="particles">
          <span class="particle p1"></span>
          <span class="particle p2"></span>
          <span class="particle p3"></span>
          <span class="particle p4"></span>
        </div>

        <div class="banner-content">
          <img
            src="/logo.jpg"
            alt="YiwuTrade"
            class="banner-logo"
            @error="($event.target as HTMLImageElement).style.display='none'"
          />
          <h1 class="banner-title">International Students Recruitment</h1>
          <p class="banner-brand">YiwuTrade</p>
          <p class="banner-tagline">
            10,000+ Chinese employers are looking for YOU
          </p>
          <p class="banner-subline">
            Jobs &nbsp;·&nbsp; Business Setup &nbsp;·&nbsp; Visa &nbsp;—&nbsp; All in One Place
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-wrapper {
  height: 280px;
  overflow: hidden;
  position: relative;
}

.banner-parallax {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 280px;
}

.banner-bg {
  height: 280px;
  background: linear-gradient(160deg, #d00000 0%, #a00000 40%, #800000 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Particles — fewer & smaller */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.p1 { width: 60px; height: 60px; top: -15px; right: 10%; animation: float1 8s ease-in-out infinite; }
.p2 { width: 30px; height: 30px; top: 25%; left: 8%; animation: float2 6s ease-in-out infinite; }
.p3 { width: 50px; height: 50px; bottom: -10px; right: 20%; animation: float1 7s ease-in-out infinite reverse; }
.p4 { width: 20px; height: 20px; top: 40%; right: 30%; background: rgba(255, 255, 255, 0.14); animation: float2 5s ease-in-out infinite; }

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(10px, -12px) scale(1.05); }
  66% { transform: translate(-8px, 6px) scale(0.95); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-12px, -8px); }
}

/* Content — compact */
.banner-content {
  text-align: center;
  color: #ffffff;
  z-index: 2;
  position: relative;
}

.banner-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
  object-fit: cover;
}

.banner-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 2px;
}

.banner-brand {
  font-size: 13px;
  font-weight: 500;
  opacity: 0.8;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 4px;
}

.banner-tagline {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.95;
  line-height: 1.4;
  max-width: 340px;
  margin: 12px auto 0;
  padding: 0 16px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.banner-subline {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.78;
  line-height: 1.5;
  max-width: 340px;
  margin: 6px auto 0;
  padding: 0 16px;
  letter-spacing: 0.3px;
}
</style>
