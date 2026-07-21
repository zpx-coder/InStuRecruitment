import { Request, Response } from 'express';

const DICT_OPTIONS = {
  gender: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ],
  highest_degree: [
    { value: 'high_school', label: 'High School' },
    { value: 'associate', label: 'Associate' },
    { value: 'bachelor', label: "Bachelor's" },
    { value: 'master', label: "Master's" },
    { value: 'phd', label: 'PhD' },
    { value: 'other', label: 'Other' },
  ],
  hsk_level: [
    { value: 'hsk1', label: 'HSK 1' },
    { value: 'hsk2', label: 'HSK 2' },
    { value: 'hsk3', label: 'HSK 3' },
    { value: 'hsk4', label: 'HSK 4' },
    { value: 'hsk5', label: 'HSK 5' },
    { value: 'hsk6', label: 'HSK 6' },
    { value: 'hsk7', label: 'HSK 7' },
    { value: 'hsk8', label: 'HSK 8' },
    { value: 'hsk9', label: 'HSK 9' },
  ],
  english_proficiency: [
    { value: 'zero', label: 'Zero foundation' },
    { value: 'basic', label: 'Basic daily conversation' },
    { value: 'fluent', label: 'Fluent communication' },
    { value: 'business', label: 'Business proficient' },
  ],
  proficient_languages: [
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
  ],
  current_academic_year: [
    { value: 'year_1', label: 'Year 1' },
    { value: 'year_2', label: 'Year 2' },
    { value: 'year_3', label: 'Year 3' },
    { value: 'year_4', label: 'Year 4' },
    { value: 'year_5', label: 'Year 5' },
    { value: 'master_year_1', label: 'Master Year 1' },
    { value: 'master_year_2', label: 'Master Year 2' },
    { value: 'master_year_3', label: 'Master Year 3' },
    { value: 'phd_year_1', label: 'PhD Year 1' },
    { value: 'phd_year_2', label: 'PhD Year 2' },
    { value: 'phd_year_3', label: 'PhD Year 3' },
    { value: 'phd_year_4_plus', label: 'PhD Year 4+' },
    { value: 'other', label: 'Other' },
  ],
  post_graduation_plan: [
    { value: 'further_studies', label: 'Pursue further studies' },
    { value: 'internship', label: 'Internship & Part-time job' },
    { value: 'full_time', label: 'Full-time job' },
    { value: 'set_company', label: 'Set a company' },
  ],
};

export function getOptions(_req: Request, res: Response) {
  res.json({ success: true, data: DICT_OPTIONS });
}
