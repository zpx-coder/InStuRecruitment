<script setup lang="ts">
import { inject, computed, ref } from 'vue';
import type { FormData, FormErrors } from '../composables/useFormValidation';

const formData = inject<FormData>('formData')!;
const errors = inject<FormErrors>('formErrors')!;

const showBirthdayPicker = ref(false);
const showGenderPicker = ref(false);
const showNationalityPicker = ref(false);
const nationalitySearch = ref('');

const genderColumns = [
  { text: 'Male', value: 'male' },
  { text: 'Female', value: 'female' },
  { text: 'Prefer not to say', value: 'prefer_not_to_say' },
];

// All countries sorted A-Z
const allCountries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Benin',
  'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cambodia', 'Cameroon', 'Canada', 'Chad', 'Chile', 'China',
  'Colombia', 'Congo', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba',
  'Cyprus', 'Czech Republic',
  'Denmark', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Eswatini', 'Ethiopia',
  'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece',
  'Guatemala', 'Guinea', 'Guyana',
  'Haiti', 'Honduras', 'Hong Kong', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Libya', 'Lithuania', 'Luxembourg',
  'Macau', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia',
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
  'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman',
  'Pakistan', 'Palestine', 'Panama', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia', 'Rwanda',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Singapore', 'Slovakia',
  'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo',
  'Tunisia', 'Turkey', 'Turkmenistan',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan',
  'Venezuela', 'Vietnam',
  'Yemen',
  'Zambia', 'Zimbabwe',
];

function getError(key: string): string {
  return (errors as Record<string, string>)[key] || '';
}

const genderLabel = computed(() => {
  const opt = genderColumns.find((c) => c.value === formData.gender);
  return opt?.text || '';
});

const birthdayLabel = computed(() => {
  if (!formData.birthday) return '';
  const d = new Date(formData.birthday);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

// ---- Nationality ----
const filteredCountries = computed(() => {
  const q = nationalitySearch.value.toLowerCase().trim();
  if (!q) return allCountries;
  return allCountries.filter((c) => c.toLowerCase().includes(q));
});

function onNationalityClick() {
  nationalitySearch.value = '';
  showNationalityPicker.value = true;
}

function selectNationality(country: string) {
  formData.nationality = country;
  showNationalityPicker.value = false;
}

// ---- Birthday ----
function onBirthdayConfirm({ selectedValues }: { selectedValues: string[] }) {
  formData.birthday = selectedValues.join('-');
  showBirthdayPicker.value = false;
}

const minDate = new Date(1900, 0, 1);
const maxDate = new Date();

const defaultBirthday = ['2000', '01', '01'];

const birthdayPickerValue = computed(() => {
  if (!formData.birthday) return defaultBirthday;
  return formData.birthday.split('-');
});

// ---- Gender ----
function onGenderConfirm({ selectedOptions }: { selectedOptions: Array<{ text: string; value: string }> }) {
  formData.gender = selectedOptions[0]?.value || '';
  showGenderPicker.value = false;
}
</script>

<template>
  <div class="section-bg-alt" style="padding: var(--spacing-lg) 0;">
    <div class="form-card animate-in anim-delay-1">
      <h2 class="card-title">📋 Personal Information</h2>

      <van-field
        v-model="formData.name"
        label="Name"
        placeholder="Enter your full name"
        required
        :error="!!getError('name')"
        :error-message="getError('name')"
      />

      <!-- Gender — picker -->
      <van-field
        :model-value="genderLabel"
        is-link
        readonly
        label="Gender"
        placeholder="Select gender"
        required
        :error="!!getError('gender')"
        :error-message="getError('gender')"
        @click="showGenderPicker = true"
      />

      <van-field
        v-model="formData.phone"
        label="Phone Number"
        placeholder="+86 138 0000 0000"
        type="tel"
        required
        :error="!!getError('phone')"
        :error-message="getError('phone')"
      />

      <van-field
        v-model="formData.email"
        label="Email"
        placeholder="yourname@example.com"
        type="email"
        required
        :error="!!getError('email')"
        :error-message="getError('email')"
      />

      <!-- Nationality — searchable picker -->
      <van-field
        :model-value="formData.nationality"
        is-link
        readonly
        label="Nationality"
        placeholder="Select your nationality"
        required
        :error="!!getError('nationality')"
        :error-message="getError('nationality')"
        @click="onNationalityClick"
      />

      <!-- Birthday — date picker -->
      <van-field
        :model-value="birthdayLabel"
        is-link
        readonly
        label="Birthday"
        placeholder="Select your birthday"
        required
        :error="!!getError('birthday')"
        :error-message="getError('birthday')"
        @click="showBirthdayPicker = true"
      />

      <van-field
        v-model="formData.passport_number"
        label="Passport Number"
        placeholder="e.g. M12345678"
        required
        :error="!!getError('passport_number')"
        :error-message="getError('passport_number')"
      >
        <template #extra>
          <span class="passport-hint">🔒 Encrypted &amp; secure</span>
        </template>
      </van-field>
    </div>

    <!-- Gender Picker -->
    <van-popup v-model:show="showGenderPicker" position="bottom" round>
      <van-picker
        :columns="genderColumns"
        title="Select Gender"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
      />
    </van-popup>

    <!-- Nationality Picker -->
    <van-popup v-model:show="showNationalityPicker" position="bottom" round :style="{ height: '70vh' }">
      <div class="nationality-picker">
        <div class="nationality-header">
          <h3 class="nationality-title">Select Nationality</h3>
          <van-icon name="cross" size="20" @click="showNationalityPicker = false" />
        </div>
        <van-search
          v-model="nationalitySearch"
          placeholder="Search country..."
          shape="round"
          autofocus
        />
        <div class="nationality-list">
          <div
            v-for="country in filteredCountries"
            :key="country"
            class="nationality-item"
            :class="{ active: formData.nationality === country }"
            @click="selectNationality(country)"
          >
            <span>{{ country }}</span>
            <van-icon
              v-if="formData.nationality === country"
              name="success"
              color="#d00000"
              size="18"
            />
          </div>
          <div v-if="!filteredCountries.length" class="nationality-empty">
            No countries found
          </div>
        </div>
      </div>
    </van-popup>

    <!-- Birthday Picker -->
    <van-popup v-model:show="showBirthdayPicker" position="bottom" round>
      <van-date-picker
        :model-value="birthdayPickerValue"
        :min-date="minDate"
        :max-date="maxDate"
        title="Select Birthday"
        @confirm="onBirthdayConfirm"
        @cancel="showBirthdayPicker = false"
      />
    </van-popup>
  </div>
</template>

<style scoped>
.nationality-picker {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.nationality-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 8px;
}

.nationality-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.nationality-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 4px 0 20px;
}

.nationality-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  font-size: 15px;
  color: var(--color-text-primary);
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.15s;
}

.nationality-item:active {
  background: #f7f0eb;
}

.nationality-item.active {
  color: var(--color-primary);
  font-weight: 600;
}

.nationality-empty {
  padding: 40px 20px;
  text-align: center;
  color: #9e9e9e;
  font-size: 14px;
}
</style>
