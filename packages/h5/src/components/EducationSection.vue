<script setup lang="ts">
import { inject, computed, ref, unref } from 'vue';
import type { FormData, FormErrors } from '../composables/useFormValidation';
import type { DictOptions } from '../api';

const formData = inject<FormData>('formData')!;
const errors = inject<FormErrors>('formErrors')!;
const dict = inject<DictOptions | null>('dictOptions')!;
const d = computed(() => unref(dict));

const showGraduationPicker = ref(false);
const showDegreePicker = ref(false);
const showYearPicker = ref(false);

function getError(key: string): string {
  return (errors as Record<string, string>)[key] || '';
}

// ---- Degree ----
const degreeLabel = computed(() => {
  const opt = d.value?.highest_degree?.find((d) => d.value === formData.highest_degree);
  return opt?.label || '';
});

const degreeColumns = computed(() =>
  d.value?.highest_degree?.map((d) => ({ text: d.label, value: d.value })) || [],
);

function onDegreeConfirm({ selectedOptions }: { selectedOptions: Array<{ text: string; value: string }> }) {
  formData.highest_degree = selectedOptions[0]?.value || '';
  showDegreePicker.value = false;
}

// ---- Academic Year ----
const yearLabel = computed(() => {
  const opt = d.value?.current_academic_year?.find((y) => y.value === formData.current_academic_year);
  return opt?.label || '';
});

const yearColumns = computed(() =>
  d.value?.current_academic_year?.map((y) => ({ text: y.label, value: y.value })) || [],
);

function onYearConfirm({ selectedOptions }: { selectedOptions: Array<{ text: string; value: string }> }) {
  formData.current_academic_year = selectedOptions[0]?.value || '';
  showYearPicker.value = false;
}

// ---- Graduation Date ----
const graduationLabel = computed(() => {
  if (!formData.graduation_date) return '';
  const d = new Date(formData.graduation_date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

function onGraduationConfirm({ selectedValues }: { selectedValues: string[] }) {
  formData.graduation_date = selectedValues.join('-');
  showGraduationPicker.value = false;
}

const minDate = new Date(2020, 0, 1);
const maxDate = new Date(2035, 11, 31);

const graduationPickerValue = computed(() => {
  if (!formData.graduation_date) return undefined;
  return formData.graduation_date.split('-');
});
</script>

<template>
  <div class="section-bg-alt" style="padding: var(--spacing-lg) 0;">
    <div class="form-card animate-in anim-delay-3">
      <h2 class="card-title">🎓 Education Background</h2>

      <van-field
        v-model="formData.university"
        label="University"
        placeholder="e.g. Peking University"
        required
        :error="!!getError('university')"
        :error-message="getError('university')"
      />

      <van-field
        v-model="formData.major"
        label="Major"
        placeholder="e.g. Computer Science"
        required
        :error="!!getError('major')"
        :error-message="getError('major')"
      />

      <!-- Highest Degree — picker -->
      <van-field
        :model-value="degreeLabel"
        is-link
        readonly
        label="Highest Degree"
        placeholder="Select degree"
        required
        :error="!!getError('highest_degree')"
        :error-message="getError('highest_degree')"
        @click="showDegreePicker = true"
      />

      <!-- Current Academic Year — picker -->
      <van-field
        :model-value="yearLabel"
        is-link
        readonly
        label="Current Academic Year"
        placeholder="Select academic year"
        required
        :error="!!getError('current_academic_year')"
        :error-message="getError('current_academic_year')"
        @click="showYearPicker = true"
      />

      <!-- Graduation Date — date picker -->
      <van-field
        :model-value="graduationLabel"
        is-link
        readonly
        label="Graduation Date"
        placeholder="Select graduation date"
        required
        :error="!!getError('graduation_date')"
        :error-message="getError('graduation_date')"
        @click="showGraduationPicker = true"
      />
    </div>

    <!-- Degree Picker -->
    <van-popup v-model:show="showDegreePicker" position="bottom" round>
      <van-picker
        :columns="degreeColumns"
        title="Highest Degree"
        @confirm="onDegreeConfirm"
        @cancel="showDegreePicker = false"
      />
    </van-popup>

    <!-- Academic Year Picker -->
    <van-popup v-model:show="showYearPicker" position="bottom" round>
      <van-picker
        :columns="yearColumns"
        title="Current Academic Year"
        @confirm="onYearConfirm"
        @cancel="showYearPicker = false"
      />
    </van-popup>

    <!-- Graduation Date Picker -->
    <van-popup v-model:show="showGraduationPicker" position="bottom" round>
      <van-date-picker
        :model-value="graduationPickerValue"
        :min-date="minDate"
        :max-date="maxDate"
        title="Select Graduation Date"
        @confirm="onGraduationConfirm"
        @cancel="showGraduationPicker = false"
      />
    </van-popup>
  </div>
</template>
