<script setup lang="ts">
import { inject, ref, computed, unref } from 'vue';
import type { FormData, FormErrors } from '../composables/useFormValidation';
import type { DictOptions } from '../api';

const formData = inject<FormData>('formData')!;
const errors = inject<FormErrors>('formErrors')!;
const dict = inject<DictOptions | null>('dictOptions')!;
const d = computed(() => unref(dict));

const showLangPopup = ref(false);
const showHskPicker = ref(false);
const showEnglishPicker = ref(false);

// Temp state for language multi-select (to allow cancel)
const tempLanguages = ref<string[]>([...formData.proficient_languages]);

function getError(key: string): string {
  return (errors as Record<string, string>)[key] || '';
}

// ---- Languages label ----
const languagesLabel = computed(() => {
  if (!formData.proficient_languages.length) return '';
  const names = formData.proficient_languages
    .map((v) => d.value?.proficient_languages?.find((l) => l.value === v)?.label || v);
  return names.join(', ');
});

function openLangPopup() {
  tempLanguages.value = [...formData.proficient_languages];
  showLangPopup.value = true;
}

function confirmLanguages() {
  formData.proficient_languages = [...tempLanguages.value];
  showLangPopup.value = false;
}

function cancelLanguages() {
  showLangPopup.value = false;
}

// ---- HSK label ----
const hskLabel = computed(() => {
  const opt = d.value?.hsk_level?.find((h) => h.value === formData.hsk_level);
  return opt?.label || '';
});

const hskColumns = computed(() =>
  d.value?.hsk_level?.map((h) => ({ text: h.label, value: h.value })) || [],
);

function onHskConfirm({ selectedOptions }: { selectedOptions: Array<{ text: string; value: string }> }) {
  formData.hsk_level = selectedOptions[0]?.value || '';
  showHskPicker.value = false;
}

// ---- English label ----
const englishLabel = computed(() => {
  const opt = d.value?.english_proficiency?.find((e) => e.value === formData.english_proficiency);
  return opt?.label || '';
});

const englishColumns = computed(() =>
  d.value?.english_proficiency?.map((e) => ({ text: e.label, value: e.value })) || [],
);

function onEnglishConfirm({ selectedOptions }: { selectedOptions: Array<{ text: string; value: string }> }) {
  formData.english_proficiency = selectedOptions[0]?.value || '';
  showEnglishPicker.value = false;
}
</script>

<template>
  <div class="section-bg-white" style="padding: var(--spacing-lg) 0;">
    <div class="form-card animate-in anim-delay-2">
      <h2 class="card-title">🌐 Languages</h2>

      <!-- Proficient Languages — multi-select popup -->
      <van-field
        :model-value="languagesLabel"
        is-link
        readonly
        label="Proficient Languages"
        placeholder="Select languages"
        required
        :error="!!getError('proficient_languages')"
        :error-message="getError('proficient_languages')"
        @click="openLangPopup"
      />

      <!-- HSK Level — picker -->
      <van-field
        :model-value="hskLabel"
        is-link
        readonly
        label="HSK Level"
        placeholder="Select HSK level"
        required
        :error="!!getError('hsk_level')"
        :error-message="getError('hsk_level')"
        @click="showHskPicker = true"
      />

      <!-- English Proficiency — picker -->
      <van-field
        :model-value="englishLabel"
        is-link
        readonly
        label="English Proficiency"
        placeholder="Select English level"
        required
        :error="!!getError('english_proficiency')"
        :error-message="getError('english_proficiency')"
        @click="showEnglishPicker = true"
      />
    </div>

    <!-- Languages Checkbox Popup -->
    <van-popup v-model:show="showLangPopup" position="bottom" round :style="{ padding: '16px 16px 24px' }">
      <h3 style="text-align:center; font-size:18px; font-weight:600; margin-bottom:16px;">Select Languages</h3>
      <van-checkbox-group v-model="tempLanguages">
        <van-cell-group inset>
          <van-cell
            v-for="lang in dict?.proficient_languages || []"
            :key="lang.value"
            :title="lang.label"
            clickable
            @click="tempLanguages.includes(lang.value)
              ? (tempLanguages = tempLanguages.filter(v => v !== lang.value))
              : tempLanguages.push(lang.value)"
          >
            <template #right-icon>
              <van-checkbox
                :name="lang.value"
                :model-value="tempLanguages.includes(lang.value)"
                shape="square"
                @click.stop
              />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <div style="display:flex; gap:12px; margin-top:20px;">
        <van-button round block @click="cancelLanguages">Cancel</van-button>
        <van-button round block type="primary" @click="confirmLanguages">Confirm</van-button>
      </div>
    </van-popup>

    <!-- HSK Picker -->
    <van-popup v-model:show="showHskPicker" position="bottom" round>
      <van-picker
        :columns="hskColumns"
        title="HSK Level"
        @confirm="onHskConfirm"
        @cancel="showHskPicker = false"
      />
    </van-popup>

    <!-- English Picker -->
    <van-popup v-model:show="showEnglishPicker" position="bottom" round>
      <van-picker
        :columns="englishColumns"
        title="English Proficiency"
        @confirm="onEnglishConfirm"
        @cancel="showEnglishPicker = false"
      />
    </van-popup>
  </div>
</template>
