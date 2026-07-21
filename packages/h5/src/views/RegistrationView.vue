<script setup lang="ts">
import { reactive, ref, provide, onMounted, nextTick } from 'vue';
import { showDialog, showToast } from 'vant';
import type { FormData } from '../composables/useFormValidation';
import { useFormValidation } from '../composables/useFormValidation';
import { submitApplication, fetchDictOptions } from '../api';
import type { DictOptions } from '../api';

import BannerSection from '../components/BannerSection.vue';
import ProcessSteps from '../components/ProcessSteps.vue';
import PersonalInfoSection from '../components/PersonalInfoSection.vue';
import LanguagesSection from '../components/LanguagesSection.vue';
import EducationSection from '../components/EducationSection.vue';
import CareerBackgroundSection from '../components/CareerBackgroundSection.vue';
import PrivacyConsent from '../components/PrivacyConsent.vue';
import SubmitButton from '../components/SubmitButton.vue';

// ---- State ----

const formData = reactive<FormData>({
  name: '',
  gender: '',
  phone: '',
  email: '',
  nationality: '',
  birthday: '',
  passport_number: '',
  proficient_languages: [],
  hsk_level: '',
  english_proficiency: '',
  university: '',
  major: '',
  highest_degree: '',
  current_academic_year: '',
  graduation_date: '',
  post_graduation_plan: '',
  intended_city: '',
  family_business: '',
  expected_position: '',
});

const privacyConsent = ref(false);
const submitting = ref(false);
const dictLoading = ref(true);
const dictOptions = ref<DictOptions | null>(null);

const { errors, validate, clearErrors, firstErrorField } = useFormValidation();

// ---- Provide for child components ----

provide('formData', formData);
provide('formErrors', errors);
provide('dictOptions', dictOptions);

// ---- Load dictionary options ----

onMounted(async () => {
  try {
    const res = await fetchDictOptions();
    dictOptions.value = res.data;
  } catch {
    showToast('Failed to load form options. Please refresh the page.');
  } finally {
    dictLoading.value = false;
  }
});

// ---- Submit ----

async function handleSubmit() {
  clearErrors();

  // 1. Validate form
  if (!validate(formData)) {
    await scrollToFirstError();
    return;
  }

  // 2. Check privacy consent
  if (!privacyConsent.value) {
    showToast('Please agree to the Privacy Notice before submitting.');
    return;
  }

  // 3. Submit
  submitting.value = true;
  try {
    await submitApplication({ ...formData });
    showSuccessDialog();
  } catch (err: any) {
    // If server returned field errors, map them
    if (err.fieldErrors?.length) {
      for (const fe of err.fieldErrors) {
        if (fe.field in formData) {
          errors[fe.field] = fe.message;
        }
      }
      await scrollToFirstError();
    } else {
      showToast(err.message || 'Network error, please try again.');
    }
  } finally {
    submitting.value = false;
  }
}

async function scrollToFirstError() {
  await nextTick();
  const field = firstErrorField();
  if (field) {
    // Try to find a field or radio-group with this name
    const el = document.querySelector(`[data-field="${field}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('shake');
      setTimeout(() => el.classList.remove('shake'), 500);
    }
  }
}

function showSuccessDialog() {
  showDialog({
    title: '✅ Submitted Successfully!',
    message:
      'Our staff will contact you once a matching position is found. Thank you for your interest in YiwuTrade!',
    confirmButtonText: 'OK',
    confirmButtonColor: '#d00000',
  }).then(() => {
    // Reset form
    Object.keys(formData).forEach((k) => {
      if (Array.isArray((formData as any)[k])) {
        (formData as any)[k] = [];
      } else {
        (formData as any)[k] = '';
      }
    });
    privacyConsent.value = false;
    clearErrors();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function showPrivacyNotice() {
  showDialog({
    title: 'Privacy Notice',
    message:
      'YiwuTrade ("we," "us," or "our") collects personal data from international students for recruitment matching purposes.\n\n' +
      'Data collected includes: name, contact information, nationality, passport number (encrypted), education background, language proficiency, and career preferences.\n\n' +
      'Your passport number is encrypted using AES-256 and used solely for identity verification. We do not share your personal data with third parties without your explicit consent.\n\n' +
      'You have the right to:\n' +
      '• Access your personal data\n' +
      '• Correct inaccurate data\n' +
      '• Request deletion of your data\n\n' +
      'To exercise these rights, please contact our recruitment team. Data retention period: 2 years after the recruitment event concludes.',
    confirmButtonText: 'I Understand',
    confirmButtonColor: '#d00000',
  });
}
</script>

<template>
  <div class="registration-page">
    <!-- Skeleton while loading dict options -->
    <template v-if="dictLoading">
      <div style="height: 280px; background: linear-gradient(160deg, #d00000, #800000);" />
      <div style="padding: 24px 16px; background: linear-gradient(180deg, #f7f0eb 0%, #f3e8e2 100%);">
        <div class="skeleton skeleton-input" />
        <div class="skeleton skeleton-input" />
        <div class="skeleton skeleton-input" style="width: 50%;" />
      </div>
    </template>

    <template v-else>
      <!-- Banner -->
      <BannerSection />

      <!-- Process Steps -->
      <ProcessSteps />

      <!-- Personal Info -->
      <PersonalInfoSection data-field-section="name" />

      <!-- Languages -->
      <LanguagesSection />

      <!-- Education -->
      <EducationSection />

      <!-- Career & Background -->
      <CareerBackgroundSection />

      <!-- Privacy + Submit -->
      <PrivacyConsent
        v-model="privacyConsent"
        @show-privacy="showPrivacyNotice"
      />
      <SubmitButton
        :loading="submitting"
        :disabled="!privacyConsent"
        @submit="handleSubmit"
      />
    </template>
  </div>
</template>

<style scoped>
.registration-page {
  max-width: 768px;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(180deg, #fdfaf7 0%, #faf4f2 30%, #f7f0eb 60%, #faf4f2 100%);
  overflow-x: hidden;
}
</style>
