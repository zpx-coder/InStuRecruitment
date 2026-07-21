import { Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import prisma from '../utils/prisma';
import { encryptPassport, decryptPassport } from '../utils/crypto';
import type { ApplicationInput } from '../validators/application.schema';

// ---- Create ----

export async function createApplication(data: ApplicationInput) {
  const encryptedPassport = encryptPassport(data.passport_number);

  const record = await prisma.application.create({
    data: {
      name: data.name,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      nationality: data.nationality,
      birthday: data.birthday,
      passportNumber: encryptedPassport,
      proficientLanguages: JSON.stringify(data.proficient_languages),
      hskLevel: data.hsk_level,
      englishProficiency: data.english_proficiency,
      university: data.university,
      major: data.major,
      highestDegree: data.highest_degree,
      currentAcademicYear: data.current_academic_year,
      graduationDate: data.graduation_date,
      postGraduationPlan: data.post_graduation_plan,
      intendedCity: data.intended_city,
      familyBusiness: data.family_business,
    },
  });

  return { id: record.id };
}

// ---- List (paginated + filtered) ----

export interface ApplicationQuery {
  page?: number;
  per_page?: number;
  nationality?: string;
  highest_degree?: string;
  hsk_level?: string;
  intended_city?: string;
  name?: string;
  university?: string;
  proficient_languages?: string;
  english_proficiency?: string;
  post_graduation_plan?: string;
}

export async function listApplications(query: ApplicationQuery) {
  const page = Math.max(1, query.page || 1);
  const perPage = Math.min(100, Math.max(1, query.per_page || 20));
  const where: Prisma.ApplicationWhereInput = {};

  // Text fuzzy match filters
  if (query.nationality) {
    where.nationality = { contains: query.nationality };
  }
  if (query.name) {
    where.name = { contains: query.name };
  }
  if (query.university) {
    where.university = { contains: query.university };
  }
  if (query.intended_city) {
    where.intendedCity = { contains: query.intended_city };
  }

  // Exact match filters (support comma-separated multiple values)
  if (query.highest_degree) {
    where.highestDegree = { in: query.highest_degree.split(',') };
  }
  if (query.hsk_level) {
    where.hskLevel = { in: query.hsk_level.split(',') };
  }
  if (query.english_proficiency) {
    where.englishProficiency = { in: query.english_proficiency.split(',') };
  }
  if (query.post_graduation_plan) {
    where.postGraduationPlan = { in: query.post_graduation_plan.split(',') };
  }

  // Language filter — JSON array contains any of the specified languages
  if (query.proficient_languages) {
    const langs = query.proficient_languages.split(',');
    where.OR = langs.map((lang) => ({
      proficientLanguages: { contains: lang },
    }));
  }

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.application.count({ where }),
  ]);

  // Decrypt passport and parse JSON fields in the list
  const mapped = items.map((item) => ({
    ...item,
    passportNumber: decryptPassport(item.passportNumber),
    proficientLanguages: JSON.parse(item.proficientLanguages),
  }));

  return {
    items: mapped,
    pagination: {
      page,
      per_page: perPage,
      total,
      total_pages: Math.ceil(total / perPage),
    },
  };
}

// ---- Detail ----

export async function getApplication(id: string) {
  const item = await prisma.application.findUnique({ where: { id } });
  if (!item) return null;

  return {
    ...item,
    passportNumber: decryptPassport(item.passportNumber),
    proficientLanguages: JSON.parse(item.proficientLanguages),
  };
}

// ---- Export Excel ----

export async function exportApplications(query: ApplicationQuery): Promise<Buffer> {
  // Fetch all matching records (no pagination for export)
  const where: Prisma.ApplicationWhereInput = {};

  if (query.nationality) where.nationality = { contains: query.nationality };
  if (query.name) where.name = { contains: query.name };
  if (query.university) where.university = { contains: query.university };
  if (query.intended_city) where.intendedCity = { contains: query.intended_city };
  if (query.highest_degree) where.highestDegree = { in: query.highest_degree.split(',') };
  if (query.hsk_level) where.hskLevel = { in: query.hsk_level.split(',') };
  if (query.english_proficiency) where.englishProficiency = { in: query.english_proficiency.split(',') };
  if (query.post_graduation_plan) where.postGraduationPlan = { in: query.post_graduation_plan.split(',') };
  if (query.proficient_languages) {
    const langs = query.proficient_languages.split(',');
    where.OR = langs.map((lang) => ({ proficientLanguages: { contains: lang } }));
  }

  const items = await prisma.application.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Build Excel
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('留学生报名数据');

  sheet.columns = [
    { header: 'ID', key: 'id', width: 36 },
    { header: '姓名', key: 'name', width: 16 },
    { header: '性别', key: 'gender', width: 8 },
    { header: '手机号', key: 'phone', width: 16 },
    { header: '邮箱', key: 'email', width: 26 },
    { header: '国籍', key: 'nationality', width: 14 },
    { header: '出生日期', key: 'birthday', width: 14 },
    { header: '护照号码', key: 'passportNumber', width: 18 },
    { header: '精通语言', key: 'proficientLanguages', width: 24 },
    { header: 'HSK 等级', key: 'hskLevel', width: 10 },
    { header: '英语水平', key: 'englishProficiency', width: 14 },
    { header: '就读大学', key: 'university', width: 26 },
    { header: '专业', key: 'major', width: 22 },
    { header: '最高学历', key: 'highestDegree', width: 12 },
    { header: '当前年级', key: 'currentAcademicYear', width: 14 },
    { header: '毕业时间', key: 'graduationDate', width: 14 },
    { header: '毕业后计划', key: 'postGraduationPlan', width: 16 },
    { header: '意向城市/公司', key: 'intendedCity', width: 20 },
    { header: '家庭经营行业/意向产品', key: 'familyBusiness', width: 40 },
    { header: '提交时间', key: 'createdAt', width: 20 },
  ];

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD00000' },
  };
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };

  for (const item of items) {
    const languages = JSON.parse(item.proficientLanguages).join(', ');
    sheet.addRow({
      ...item,
      passportNumber: decryptPassport(item.passportNumber),
      proficientLanguages: languages,
      birthday: item.birthday.toISOString().split('T')[0],
      graduationDate: item.graduationDate.toISOString().split('T')[0],
      createdAt: item.createdAt.toISOString(),
    });
  }

  return Buffer.from(await workbook.xlsx.writeBuffer());
}
