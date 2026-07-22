<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'showPrivacy': [];
}>();
</script>

<template>
  <div class="privacy-section animate-in anim-delay-5">
    <van-checkbox
      :model-value="props.modelValue"
      shape="square"
      icon-size="18px"
      @update:model-value="emit('update:modelValue', $event as boolean)"
    />
    <div class="privacy-text">
      I agree to the collection and processing of my personal data
      for recruitment matching purposes. My passport number will be
      encrypted and used only for identity verification.
      <a href="#" @click.prevent="emit('showPrivacy')">Privacy Notice</a>
    </div>
  </div>
</template>
