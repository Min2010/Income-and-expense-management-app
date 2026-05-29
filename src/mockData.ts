import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from './types';
import { format, startOfYear, endOfYear, eachDayOfInterval, addDays, isSameDay } from 'date-fns';

export const generateMockData = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const start = startOfYear(new Date(2024, 0, 1));
  const end = endOfYear(new Date(2026, 11, 31));

  const days = eachDayOfInterval({ start, end });

  days.forEach((day) => {
    // Randomly decide if there's an income today (less frequent)
    if (Math.random() > 0.95) {
      const category = INCOME_CATEGORIES[Math.floor(Math.random() * INCOME_CATEGORIES.length)];
      transactions.push({
        id: Math.random().toString(36).substr(2, 9),
        date: format(day, 'yyyy-MM-dd'),
        amount: Math.floor(Math.random() * 20000) + 5000,
        category: category.value,
        type: 'income',
        note: `Income from ${category.label}`,
      });
    }

    // Daily expenses (more frequent)
    const numExpenses = Math.floor(Math.random() * 3); // 0 to 2 expenses per day
    for (let i = 0; i < numExpenses; i++) {
      const category = EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)];
      transactions.push({
        id: Math.random().toString(36).substr(2, 9),
        date: format(day, 'yyyy-MM-dd'),
        amount: Math.floor(Math.random() * 500) + 50,
        category: category.value,
        type: 'expense',
        note: `Spent on ${category.label}`,
      });
    }
  });

  return transactions;
};
