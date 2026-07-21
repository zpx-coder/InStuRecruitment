import { z } from 'zod';

// Enums
const genderEnum = z.enum(['male', 'female', 'prefer_not_to_say']);

const languageEnum = z.enum([
  'chinese', 'english', 'korean', 'japanese',
  'french', 'german', 'spanish', 'arabic', 'russian', 'other',
]);

const hskLevelEnum = z.enum([
  'hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5',
  'hsk6', 'hsk7', 'hsk8', 'hsk9',
]);

const englishProficiencyEnum = z.enum([
  'zero', 'basic', 'fluent', 'business',
]);

const highestDegreeEnum = z.enum([
  'high_school', 'associate', 'bachelor', 'master', 'phd', 'other',
]);

const academicYearEnum = z.enum([
  'year_1', 'year_2', 'year_3', 'year_4', 'year_5',
  'master_year_1', 'master_year_2', 'master_year_3',
  'phd_year_1', 'phd_year_2', 'phd_year_3', 'phd_year_4_plus',
  'other',
]);

const postGraduationPlanEnum = z.enum([
  'further_studies', 'internship', 'full_time', 'set_company',
]);

// Age validation: 16-60 years old
const minAge = 16;
const maxAge = 60;
const today = new Date();
const maxBirthday = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
const minBirthday = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());

export const applicationSchema = z.object({
  // Personal Info
  name: z.string().min(2).max(60),
  gender: genderEnum,
  phone: z.string()
    .min(7, 'Phone number must be at least 7 digits')
    .max(20)
    .regex(/^\+?[0-9\s\-()]+$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email format').max(100),
  nationality: z.string().min(2).max(50),
  birthday: z.string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .transform((val) => new Date(val))
    .refine((d) => d <= maxBirthday, `Must be at least ${minAge} years old`)
    .refine((d) => d >= minBirthday, `Must be at most ${maxAge} years old`),
  passport_number: z.string()
    .min(6).max(20)
    .regex(/^[a-zA-Z0-9]+$/, 'Passport number must be alphanumeric'),

  // Languages
  proficient_languages: z.array(languageEnum).min(1, 'Select at least one language'),
  hsk_level: hskLevelEnum,
  english_proficiency: englishProficiencyEnum,

  // Education
  university: z.string().min(2).max(100),
  major: z.string().min(2).max(80),
  highest_degree: highestDegreeEnum,
  current_academic_year: academicYearEnum,
  graduation_date: z.string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .transform((val) => new Date(val)),

  // Career & Background
  post_graduation_plan: postGraduationPlanEnum,
  intended_city: z.string().min(2).max(80),
  family_business: z.string().min(5).max(500),
  expected_position: z.string().min(2).max(100),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// Partial update schema — only notes can be updated post-submission
export const applicationUpdateSchema = z.object({
  notes: z.string().max(2000).optional(),
});

export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>;
