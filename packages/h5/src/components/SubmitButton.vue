<script setup lang="ts">
defineProps<{
  loading: boolean;
  disabled: boolean;
}>();

defineEmits<{
  submit: [];
}>();
</script>

<template>
  <div class="submit-btn-wrapper animate-in anim-delay-5">
    <van-button
      type="primary"
      round
      block
      :loading="loading"
      :disabled="disabled || loading"
      loading-text="Submitting..."
      @click="$emit('submit')"
    >
      Submit
    </van-button>
  </div>
</template>
