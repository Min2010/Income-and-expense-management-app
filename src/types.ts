export type Category = string;

export interface Transaction {
  id: string;
  date: string; // ISO format
  amount: number;
  category: Category;
  type: 'income' | 'expense';
  note: string;
}

export const INCOME_CATEGORIES = [
  { label: 'Salary 💼', value: 'Salary' },
  { label: 'Freelance 🎨', value: 'Freelance' },
  { label: 'Gift 🎁', value: 'Gift' },
  { label: 'Business 📈', value: 'Business' },
];

export const EXPENSE_CATEGORIES = [
  { label: 'Food 🍔', value: 'Food' },
  { label: 'Travel 🚗', value: 'Travel' },
  { label: 'Shopping 🛍️', value: 'Shopping' },
  { label: 'Personal 💅', value: 'Personal' },
  { label: 'Entertainment 🎬', value: 'Entertainment' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const YEARS = [2024, 2025, 2026];
