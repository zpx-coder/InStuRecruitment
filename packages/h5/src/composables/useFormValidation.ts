import { reactive, computed } from 'vue';

export interface FormData {
  name: string;
  gender: string;
  phone: string;
  email: string;
  nationality: string;
  birthday: string;
  passport_number: string;
  proficient_languages: string[];
  hsk_level: string;
  english_proficiency: string;
  university: string;
  major: string;
  highest_degree: string;
  current_academic_year: string;
  graduation_date: string;
  post_graduation_plan: string;
  intended_city: string;
  family_business: string;
  expected_position: string;
}

export interface FormErrors {
  [key: string]: string;
}

const MIN_AGE = 16;
const MAX_AGE = 60;

function getMinBirthday(): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() - MAX_AGE);
  return d;
}

function getMaxBirthday(): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() - MIN_AGE);
  return d;
}

export function useFormValidation() {
  const errors = reactive<FormErrors>({});

  const hasErrors = computed(() => Object.keys(errors).length > 0);

  function clearErrors() {
    Object.keys(errors).forEach((k) => delete errors[k]);
  }

  function setError(field: string, message: string) {
    errors[field] = message;
  }

  function validate(data: FormData): boolean {
    clearErrors();

    // 1. Name
    if (!data.name || data.name.length < 2) {
      setError('name', 'Name must be at least 2 characters');
    } else if (data.name.length > 60) {
      setError('name', 'Name must be at most 60 characters');
    }

    // 2. Gender
    if (!data.gender) {
      setError('gender', 'Please select gender');
    }

    // 3. Phone
    if (!data.phone || data.phone.length < 7) {
      setError('phone', 'Phone number must be at least 7 digits');
    } else if (!/^\+?[0-9\s\-()]+$/.test(data.phone)) {
      setError('phone', 'Invalid phone number format');
    }

    // 4. Email
    if (!data.email) {
      setError('email', 'Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError('email', 'Invalid email format');
    }

    // 5. Nationality
    if (!data.nationality || data.nationality.length < 2) {
      setError('nationality', 'Nationality must be at least 2 characters');
    }

    // 6. Birthday
    if (!data.birthday) {
      setError('birthday', 'Birthday is required');
    } else {
      const d = new Date(data.birthday);
      if (isNaN(d.getTime())) {
        setError('birthday', 'Invalid date');
      } else if (d > getMaxBirthday()) {
        setError('birthday', `Must be at least ${MIN_AGE} years old`);
      } else if (d < getMinBirthday()) {
        setError('birthday', `Must be at most ${MAX_AGE} years old`);
      }
    }

    // 7. Passport Number
    if (!data.passport_number || data.passport_number.length < 6) {
      setError('passport_number', 'Passport number must be at least 6 characters');
    } else if (!/^[a-zA-Z0-9]+$/.test(data.passport_number)) {
      setError('passport_number', 'Passport number must be alphanumeric');
    }

    // 8. Proficient Languages
    if (!data.proficient_languages || data.proficient_languages.length === 0) {
      setError('proficient_languages', 'Select at least one language');
    }

    // 9. HSK Level
    if (!data.hsk_level) {
      setError('hsk_level', 'Please select HSK level');
    }

    // 10. English Proficiency
    if (!data.english_proficiency) {
      setError('english_proficiency', 'Please select English proficiency');
    }

    // 11. University
    if (!data.university || data.university.length < 2) {
      setError('university', 'University must be at least 2 characters');
    }

    // 12. Major
    if (!data.major || data.major.length < 2) {
      setError('major', 'Major must be at least 2 characters');
    }

    // 13. Highest Degree
    if (!data.highest_degree) {
      setError('highest_degree', 'Please select highest degree');
    }

    // 14. Current Academic Year
    if (!data.current_academic_year) {
      setError('current_academic_year', 'Please select academic year');
    }

    // 15. Graduation Date
    if (!data.graduation_date) {
      setError('graduation_date', 'Graduation date is required');
    } else if (isNaN(Date.parse(data.graduation_date))) {
      setError('graduation_date', 'Invalid date');
    }

    // 16. Post-graduation Plan
    if (!data.post_graduation_plan) {
      setError('post_graduation_plan', 'Please select post-graduation plan');
    }

    // 17. Intended City
    if (!data.intended_city || data.intended_city.length < 2) {
      setError('intended_city', 'Intended city must be at least 2 characters');
    }

    // 18. Family Business
    if (!data.family_business || data.family_business.length < 5) {
      setError('family_business', 'Must be at least 5 characters');
    } else if (data.family_business.length > 500) {
      setError('family_business', 'Must be at most 500 characters');
    }

    // 19. Expected Position
    if (!data.expected_position || data.expected_position.length < 2) {
      setError('expected_position', 'Expected position must be at least 2 characters');
    } else if (data.expected_position.length > 100) {
      setError('expected_position', 'Must be at most 100 characters');
    }

    return !hasErrors.value;
  }

  /** Get the first field with an error for scroll-to */
  function firstErrorField(): string | null {
    const keys = Object.keys(errors);
    return keys.length > 0 ? keys[0] : null;
  }

  return {
    errors,
    hasErrors,
    validate,
    clearErrors,
    setError,
    firstErrorField,
  };
}
