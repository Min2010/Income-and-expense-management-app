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
  { label: 'เงินเดือน 💼', value: 'Salary' },
  { label: 'งานเสริม 🎨', value: 'Freelance' },
  { label: 'ของขวัญ 🎁', value: 'Gift' },
  { label: 'ธุรกิจ 📈', value: 'Business' },
];

export const EXPENSE_CATEGORIES = [
  { label: 'อาหาร 🍔', value: 'Food' },
  { label: 'เดินทาง 🚗', value: 'Travel' },
  { label: 'ช้อปปิ้ง 🛍️', value: 'Shopping' },
  { label: 'ของใช้ส่วนตัว 💅', value: 'Personal' },
  { label: 'ความบันเทิง 🎬', value: 'Entertainment' },
];

export const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const YEARS = [2024, 2025, 2026];
