<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuth } from '../composables/useAuth';
import { fetchApplications, fetchApplicationDetail, exportExcel, updateApplicationNotes } from '../api';
import type { ApplicationQuery } from '../api';

const router = useRouter();
const route = useRoute();
const { username, logout, getToken } = useAuth();

// ---- Label mappings ----
const degreeLabels: Record<string, string> = {
  high_school: 'High School',
  associate: 'Associate',
  bachelor: "Bachelor's",
  master: "Master's",
  phd: 'PhD',
  other: 'Other',
};

const genderLabels: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  prefer_not_to_say: 'Prefer not to say',
};

const planLabels: Record<string, string> = {
  further_studies: 'Further Studies',
  internship: 'Internship',
  full_time: 'Full-time',
  set_company: 'Start Company',
};

const englishLabels: Record<string, string> = {
  zero: 'Zero',
  basic: 'Basic',
  fluent: 'Fluent',
  business: 'Business',
};

const yearLabels: Record<string, string> = {
  year_1: 'Year 1',
  year_2: 'Year 2',
  year_3: 'Year 3',
  year_4: 'Year 4',
  master_1: "Master's Y1",
  master_2: "Master's Y2",
  phd_1: 'PhD Y1',
  phd_2: 'PhD Y2',
  phd_3: 'PhD Y3',
  graduated: 'Graduated',
};

// ---- Table state ----
const loading = ref(false);
const items = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);

// ---- Filters ----
const showMoreFilters = ref(false);

const filters = reactive<ApplicationQuery>({
  nationality: '',
  highest_degree: '',
  hsk_level: '',
  intended_city: '',
  name: '',
  university: '',
  proficient_languages: '',
  english_proficiency: '',
  post_graduation_plan: '',
});

// Quick filter options (from dict, loaded on mount)
const degreeOptions = [
  { value: 'high_school', label: 'High School' },
  { value: 'associate', label: 'Associate' },
  { value: 'bachelor', label: "Bachelor's" },
  { value: 'master', label: "Master's" },
  { value: 'phd', label: 'PhD' },
  { value: 'other', label: 'Other' },
];

const hskOptions = Array.from({ length: 9 }, (_, i) => ({
  value: `hsk${i + 1}`,
  label: `HSK ${i + 1}`,
}));

const languageOptions = [
  { value: 'chinese', label: 'Chinese' },
  { value: 'english', label: 'English' },
  { value: 'korean', label: 'Korean' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'russian', label: 'Russian' },
  { value: 'other', label: 'Other' },
];

const englishOptions = [
  { value: 'zero', label: '零基础' },
  { value: 'basic', label: '基础日常' },
  { value: 'fluent', label: '流利沟通' },
  { value: 'business', label: '商务精通' },
];

const planOptions = [
  { value: 'further_studies', label: '继续深造' },
  { value: 'internship', label: '实习兼职' },
  { value: 'full_time', label: '全职' },
  { value: 'set_company', label: '创立公司' },
];

// ---- Load data ----
async function loadData() {
  loading.value = true;
  try {
    const params: ApplicationQuery = {
      page: page.value,
      per_page: pageSize.value,
    };
    // Only add non-empty filters
    for (const [key, val] of Object.entries(filters)) {
      if (val) (params as any)[key] = val;
    }

    const res: any = await fetchApplications(params);
    items.value = res.data.items;
    total.value = res.data.pagination.total;
  } catch (err: any) {
    ElMessage.error(err.message || '加载数据失败');
  } finally {
    loading.value = false;
  }
}

// ---- URL Query Sync ----
const FILTER_KEYS = [
  'nationality', 'highest_degree', 'hsk_level', 'intended_city',
  'name', 'university', 'proficient_languages', 'english_proficiency',
  'post_graduation_plan',
];

// Restore filters from URL on mount
onMounted(() => {
  const q = route.query;
  for (const key of FILTER_KEYS) {
    if (q[key]) (filters as any)[key] = q[key] as string;
  }
  if (q.page) page.value = parseInt(q.page as string, 10) || 1;
  if (q.per_page) pageSize.value = parseInt(q.per_page as string, 10) || 20;
  loadData();
});

// Sync filters → URL when filters change
watch(
  () => ({ ...filters }),
  () => {
    const q: Record<string, string> = {};
    for (const key of FILTER_KEYS) {
      if ((filters as any)[key]) q[key] = (filters as any)[key];
    }
    if (page.value > 1) q.page = String(page.value);
    if (pageSize.value !== 20) q.per_page = String(pageSize.value);
    router.replace({ query: q });
  },
  { deep: true },
);

// Watch page changes
watch([page, pageSize], () => {
  loadData();
});

// ---- Search / Reset ----
function handleSearch() {
  page.value = 1;
  loadData();
}

function handleReset() {
  filters.nationality = '';
  filters.highest_degree = '';
  filters.hsk_level = '';
  filters.intended_city = '';
  filters.name = '';
  filters.university = '';
  filters.proficient_languages = '';
  filters.english_proficiency = '';
  filters.post_graduation_plan = '';
  page.value = 1;
  loadData();
}

// ---- Detail Drawer ----
const drawerVisible = ref(false);
const detailLoading = ref(false);
const detail = ref<any>(null);

async function showDetail(row: any) {
  drawerVisible.value = true;
  detailLoading.value = true;
  try {
    const res: any = await fetchApplicationDetail(row.id);
    detail.value = res.data;
  } catch (err: any) {
    ElMessage.error('加载详情失败');
  } finally {
    detailLoading.value = false;
  }
}

// ---- Notes Dialog ----
const notesDialogVisible = ref(false);
const notesSaving = ref(false);
const notesContent = ref('');
const notesCurrentId = ref('');

function openNotesDialog(row: any) {
  notesCurrentId.value = row.id;
  notesContent.value = row.notes || '';
  notesDialogVisible.value = true;
}

async function handleSaveNotes() {
  if (!notesCurrentId.value) return;
  notesSaving.value = true;
  try {
    const res: any = await updateApplicationNotes(notesCurrentId.value, notesContent.value);
    // Update local row data so table reflects changes immediately
    const idx = items.value.findIndex((item: any) => item.id === notesCurrentId.value);
    if (idx !== -1) {
      items.value[idx].notes = notesContent.value;
    }
    ElMessage.success('备注已保存');
    notesDialogVisible.value = false;
  } catch (err: any) {
    ElMessage.error(err.message || '保存失败');
  } finally {
    notesSaving.value = false;
  }
}

// ---- Export ----
const exporting = ref(false);

async function handleExport() {
  exporting.value = true;
  try {
    const params: ApplicationQuery = {};
    for (const [key, val] of Object.entries(filters)) {
      if (val) (params as any)[key] = val;
    }

    const blob: any = await exportExcel(params);
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `留学生报名数据_${dateStr}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success('导出成功');
  } catch (err: any) {
    ElMessage.error(err.message || '导出失败');
  } finally {
    exporting.value = false;
  }
}

// ---- Logout ----
function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    logout();
    ElMessage.success('已退出登录');
  }).catch(() => {});
}

// Format date
function fmtDate(d: string) {
  if (!d) return '-';
  return new Date(d).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtDateOnly(d: string) {
  if (!d) return '-';
  return d.split('T')[0];
}
</script>

<template>
  <div class="app-list-page">
    <!-- ====== Top Nav Bar ====== -->
    <header class="top-nav">
      <div class="nav-left">
        <img
          src="/logo.jpg"
          alt="YiwuTrade"
          class="nav-logo"
          @error="($event.target as HTMLImageElement).style.display='none'"
        />
        <span class="nav-title">留学生招聘管理系统</span>
      </div>
      <div class="nav-right">
        <span class="nav-user">{{ username || '管理员' }}</span>
        <el-button type="danger" text size="small" @click="handleLogout">
          退出
        </el-button>
      </div>
    </header>

    <!-- ====== Main Content ====== -->
    <main class="main-content">
      <!-- Quick Filter Bar -->
      <div class="filter-bar">
        <div class="filter-row">
          <el-input
            v-model="filters.nationality"
            placeholder="国籍"
            clearable
            style="width: 140px;"
            @keyup.enter="handleSearch"
          />
          <el-select
            v-model="filters.highest_degree"
            placeholder="学历"
            clearable
            style="width: 140px;"
          >
            <el-option
              v-for="d in degreeOptions"
              :key="d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
          <el-select
            v-model="filters.hsk_level"
            placeholder="HSK 等级"
            clearable
            style="width: 140px;"
          >
            <el-option
              v-for="h in hskOptions"
              :key="h.value"
              :label="h.label"
              :value="h.value"
            />
          </el-select>
          <el-input
            v-model="filters.intended_city"
            placeholder="意向城市"
            clearable
            style="width: 140px;"
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">
            <el-icon style="margin-right:4px;"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button
            text
            type="primary"
            @click="showMoreFilters = !showMoreFilters"
          >
            {{ showMoreFilters ? '收起筛选 ▾' : '展开筛选 ▸' }}
          </el-button>
        </div>

        <!-- Expanded Filters -->
        <div v-show="showMoreFilters" class="filter-row" style="margin-top: 12px;">
          <el-input
            v-model="filters.name"
            placeholder="姓名"
            clearable
            style="width: 140px;"
          />
          <el-input
            v-model="filters.university"
            placeholder="大学"
            clearable
            style="width: 160px;"
          />
          <el-select
            v-model="filters.proficient_languages"
            placeholder="精通语言"
            clearable
            style="width: 140px;"
          >
            <el-option
              v-for="l in languageOptions"
              :key="l.value"
              :label="l.label"
              :value="l.value"
            />
          </el-select>
          <el-select
            v-model="filters.english_proficiency"
            placeholder="英语水平"
            clearable
            style="width: 140px;"
          >
            <el-option
              v-for="e in englishOptions"
              :key="e.value"
              :label="e.label"
              :value="e.value"
            />
          </el-select>
          <el-select
            v-model="filters.post_graduation_plan"
            placeholder="毕业后计划"
            clearable
            style="width: 140px;"
          >
            <el-option
              v-for="p in planOptions"
              :key="p.value"
              :label="p.label"
              :value="p.value"
            />
          </el-select>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="action-bar">
        <el-button
          type="success"
          :loading="exporting"
          :disabled="exporting"
          @click="handleExport"
        >
          <el-icon style="margin-right:4px;"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg></el-icon>
          导出 Excel
        </el-button>
        <span class="total-info">共 <strong>{{ total }}</strong> 条记录</span>
      </div>

      <!-- Data Table -->
      <div class="table-wrapper">
        <el-table
          :data="items"
          v-loading="loading"
          stripe
          border
          highlight-current-row
          style="width: 100%;"
          @row-click="showDetail"
          :row-style="{ cursor: 'pointer' }"
        >
          <el-table-column type="index" label="#" width="50" fixed="left" />
          <el-table-column prop="name" label="Name" width="120" fixed="left" show-overflow-tooltip />
          <el-table-column label="Gender" width="80">
            <template #default="{ row }">
              {{ genderLabels[row.gender] || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="nationality" label="Nationality" width="110" show-overflow-tooltip />
          <el-table-column prop="phone" label="Phone" width="130" show-overflow-tooltip />
          <el-table-column prop="email" label="Email" width="180" show-overflow-tooltip />
          <el-table-column label="Birthday" width="110">
            <template #default="{ row }">
              {{ fmtDateOnly(row.birthday) }}
            </template>
          </el-table-column>
          <el-table-column prop="passportNumber" label="Passport No." width="140" show-overflow-tooltip />
          <el-table-column label="Languages" width="140" show-overflow-tooltip>
            <template #default="{ row }">
              {{ Array.isArray(row.proficientLanguages) ? row.proficientLanguages.join(', ') : row.proficientLanguages || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="HSK" width="80">
            <template #default="{ row }">
              <el-tag size="small" type="danger" effect="plain">
                {{ row.hskLevel?.toUpperCase() }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="English" width="90">
            <template #default="{ row }">
              {{ englishLabels[row.englishProficiency] || row.englishProficiency || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="university" label="University" width="160" show-overflow-tooltip />
          <el-table-column prop="major" label="Major" width="140" show-overflow-tooltip />
          <el-table-column label="Degree" width="110">
            <template #default="{ row }">
              {{ degreeLabels[row.highestDegree] || row.highestDegree || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="Year" width="90">
            <template #default="{ row }">
              {{ yearLabels[row.currentAcademicYear] || row.currentAcademicYear || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="Graduation" width="110">
            <template #default="{ row }">
              {{ fmtDateOnly(row.graduationDate) }}
            </template>
          </el-table-column>
          <el-table-column label="Plan" width="110">
            <template #default="{ row }">
              {{ planLabels[row.postGraduationPlan] || row.postGraduationPlan || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="intendedCity" label="Intended City" width="130" show-overflow-tooltip />
          <el-table-column prop="familyBusiness" label="Family Business" width="160" show-overflow-tooltip />
          <el-table-column prop="expectedPosition" label="Expected Position" width="160" show-overflow-tooltip />
          <el-table-column prop="notes" label="Notes" width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <span :style="{ color: row.notes ? '#303133' : '#c0c4cc' }">
                {{ row.notes || 'No notes yet' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="100" fixed="right" align="center">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                link
                @click.stop="openNotesDialog(row)"
              >
                <el-icon style="margin-right:2px;"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></el-icon>
                备注
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="Submitted" width="150" fixed="right">
            <template #default="{ row }">
              {{ fmtDate(row.createdAt) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Pagination -->
      <div class="pagination-wrapper" v-if="total > 0">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          small
        />
      </div>
    </main>

    <!-- ====== Detail Drawer ====== -->
    <el-drawer
      v-model="drawerVisible"
      title="报名详情"
      size="480px"
      :close-on-click-modal="true"
    >
      <template v-if="detailLoading">
        <el-skeleton :rows="10" animated />
      </template>
      <template v-else-if="detail">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="姓名">{{ detail.name }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ detail.gender }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ detail.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ detail.email }}</el-descriptions-item>
          <el-descriptions-item label="国籍">{{ detail.nationality }}</el-descriptions-item>
          <el-descriptions-item label="出生日期">{{ fmtDateOnly(detail.birthday) }}</el-descriptions-item>
          <el-descriptions-item label="护照号码">{{ detail.passportNumber }}</el-descriptions-item>
          <el-descriptions-item label="精通语言">
            <el-tag
              v-for="lang in detail.proficientLanguages"
              :key="lang"
              size="small"
              style="margin-right: 4px;"
            >
              {{ lang }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="HSK 等级">
            <el-tag type="danger" size="small">{{ detail.hskLevel?.toUpperCase() }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="英语水平">
            {{ englishLabels[detail.englishProficiency] || detail.englishProficiency }}
          </el-descriptions-item>
          <el-descriptions-item label="就读大学">{{ detail.university }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ detail.major }}</el-descriptions-item>
          <el-descriptions-item label="最高学历">
            {{ degreeLabels[detail.highestDegree] || detail.highestDegree }}
          </el-descriptions-item>
          <el-descriptions-item label="当前年级">{{ detail.currentAcademicYear }}</el-descriptions-item>
          <el-descriptions-item label="毕业时间">{{ fmtDateOnly(detail.graduationDate) }}</el-descriptions-item>
          <el-descriptions-item label="毕业后计划">
            {{ planLabels[detail.postGraduationPlan] || detail.postGraduationPlan }}
          </el-descriptions-item>
          <el-descriptions-item label="意向城市/公司">{{ detail.intendedCity }}</el-descriptions-item>
          <el-descriptions-item label="家庭经营/意向产品">
            <div style="white-space: pre-wrap; max-width: 380px;">{{ detail.familyBusiness }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="期望职位/服务">{{ detail.expectedPosition || '-' }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ fmtDate(detail.createdAt) }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>

    <!-- ====== Notes Dialog ====== -->
    <el-dialog
      v-model="notesDialogVisible"
      title="填写备注"
      width="520px"
      :close-on-click-modal="false"
      @closed="notesCurrentId = ''"
    >
      <el-input
        v-model="notesContent"
        type="textarea"
        :rows="6"
        placeholder="输入备注内容（如面试评价、匹配意向、沟通记录等）"
        maxlength="2000"
        show-word-limit
      />
      <template #footer>
        <el-button @click="notesDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="notesSaving" @click="handleSaveNotes">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.app-list-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* ===== Top Nav ===== */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-user {
  font-size: 14px;
  color: #606266;
}

/* ===== Main Content ===== */
.main-content {
  padding: 20px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== Filter Bar ===== */
.filter-bar {
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

/* ===== Action Bar ===== */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.total-info {
  font-size: 14px;
  color: #909399;
}

.total-info strong {
  color: var(--color-primary);
}

/* ===== Table ===== */
.table-wrapper {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* ===== Pagination ===== */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
