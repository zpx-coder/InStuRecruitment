<script setup lang="ts">
import { inject, computed, ref, unref } from 'vue';
import type { FormData, FormErrors } from '../composables/useFormValidation';
import type { DictOptions } from '../api';

const formData = inject<FormData>('formData')!;
const errors = inject<FormErrors>('formErrors')!;
const dict = inject<DictOptions | null>('dictOptions')!;
const d = computed(() => unref(dict));

const showPlanPicker = ref(false);

function getError(key: string): string {
  return (errors as Record<string, string>)[key] || '';
}

const familyBusinessLen = computed(() => formData.family_business.length);

// ---- Post-graduation Plan ----
const planLabel = computed(() => {
  const opt = d.value?.post_graduation_plan?.find((p) => p.value === formData.post_graduation_plan);
  return opt?.label || '';
});

const planColumns = computed(() =>
  d.value?.post_graduation_plan?.map((p) => ({ text: p.label, value: p.value })) || [],
);

function onPlanConfirm({ selectedOptions }: { selectedOptions: Array<{ text: string; value: string }> }) {
  formData.post_graduation_plan = selectedOptions[0]?.value || '';
  showPlanPicker.value = false;
}
</script>

<template>
  <div class="section-bg-white" style="padding: var(--spacing-lg) 0;">
    <div class="form-card animate-in anim-delay-4">
      <h2 class="card-title">💼 Career &amp; Background</h2>

      <!-- Post-graduation Plan — picker -->
      <van-field
        :model-value="planLabel"
        is-link
        readonly
        label="Post-graduation Plan"
        placeholder="Select plan"
        required
        :error="!!getError('post_graduation_plan')"
        :error-message="getError('post_graduation_plan')"
        @click="showPlanPicker = true"
      />

      <van-field
        v-model="formData.intended_city"
        label="Intended City"
        placeholder="e.g. Shanghai, Beijing, Guangzhou"
        required
        :error="!!getError('intended_city')"
        :error-message="getError('intended_city')"
      />

      <van-field
        v-model="formData.family_business"
        label="Family Business / Target Products"
        type="textarea"
        rows="4"
        maxlength="500"
        placeholder="Describe your family business or target products (5-500 characters)"
        required
        :error="!!getError('family_business')"
        :error-message="getError('family_business')"
      >
        <template #extra>
          <span
            class="passport-hint"
            :style="{ color: familyBusinessLen > 500 ? 'var(--color-error)' : undefined }"
          >
            {{ familyBusinessLen }}/500
          </span>
        </template>
      </van-field>

      <van-field
        v-model="formData.expected_position"
        label="Expected Position / Service"
        placeholder="e.g. International Trade Specialist, Sourcing Agent"
        required
        :error="!!getError('expected_position')"
        :error-message="getError('expected_position')"
      />
    </div>

    <!-- Plan Picker -->
    <van-popup v-model:show="showPlanPicker" position="bottom" round>
      <van-picker
        :columns="planColumns"
        title="Post-graduation Plan"
        @confirm="onPlanConfirm"
        @cancel="showPlanPicker = false"
      />
    </van-popup>
  </div>
</template>
