import type { Category } from '@/types/models';

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'briefcase', type: 'income', color: '#22c55e' },
  { id: 'freelance', name: 'Freelance', icon: 'code', type: 'income', color: '#10b981' },
  { id: 'investments', name: 'Investment Returns', icon: 'trending-up', type: 'income', color: '#14b8a6' },
  { id: 'rental', name: 'Rental Income', icon: 'home', type: 'income', color: '#06b6d4' },
  { id: 'dividends', name: 'Dividends', icon: 'dollar-sign', type: 'income', color: '#0891b2' },
  { id: 'gifts', name: 'Gifts', icon: 'gift', type: 'income', color: '#0284c7' },
  { id: 'refunds', name: 'Refunds', icon: 'refresh', type: 'income', color: '#0369a1' },
  { id: 'other_income', name: 'Other Income', icon: 'plus-circle', type: 'income', color: '#059669' },
];

export const EXPENSE_CATEGORIES: Category[] = [
  // Housing
  { id: 'rent', name: 'Rent/Mortgage', icon: 'home', type: 'expense', color: '#ef4444' },
  { id: 'utilities', name: 'Utilities', icon: 'zap', type: 'expense', color: '#f97316' },
  { id: 'home_maintenance', name: 'Home Maintenance', icon: 'tool', type: 'expense', color: '#f59e0b' },

  // Transportation
  { id: 'car_payment', name: 'Car Payment', icon: 'car', type: 'expense', color: '#eab308' },
  { id: 'gas', name: 'Gas/Fuel', icon: 'fuel', type: 'expense', color: '#84cc16' },
  { id: 'public_transit', name: 'Public Transit', icon: 'train', type: 'expense', color: '#22c55e' },
  { id: 'car_maintenance', name: 'Car Maintenance', icon: 'settings', type: 'expense', color: '#10b981' },

  // Food
  { id: 'groceries', name: 'Groceries', icon: 'shopping-cart', type: 'expense', color: '#14b8a6' },
  { id: 'dining_out', name: 'Dining Out', icon: 'utensils', type: 'expense', color: '#06b6d4' },
  { id: 'coffee', name: 'Coffee/Snacks', icon: 'coffee', type: 'expense', color: '#0891b2' },

  // Personal
  { id: 'clothing', name: 'Clothing', icon: 'shirt', type: 'expense', color: '#0284c7' },
  { id: 'personal_care', name: 'Personal Care', icon: 'heart', type: 'expense', color: '#0369a1' },
  { id: 'healthcare', name: 'Healthcare', icon: 'activity', type: 'expense', color: '#1d4ed8' },

  // Entertainment
  { id: 'entertainment', name: 'Entertainment', icon: 'film', type: 'expense', color: '#4f46e5' },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'repeat', type: 'expense', color: '#7c3aed' },
  { id: 'hobbies', name: 'Hobbies', icon: 'palette', type: 'expense', color: '#9333ea' },

  // Financial
  { id: 'insurance', name: 'Insurance', icon: 'shield', type: 'expense', color: '#c026d3' },
  { id: 'taxes', name: 'Taxes', icon: 'file-text', type: 'expense', color: '#db2777' },
  { id: 'debt_payment', name: 'Debt Payment', icon: 'credit-card', type: 'expense', color: '#e11d48' },

  // Family
  { id: 'childcare', name: 'Childcare', icon: 'users', type: 'expense', color: '#be123c' },
  { id: 'education', name: 'Education', icon: 'book', type: 'expense', color: '#9f1239' },
  { id: 'pets', name: 'Pets', icon: 'paw', type: 'expense', color: '#881337' },

  // Other
  { id: 'gifts_given', name: 'Gifts Given', icon: 'gift', type: 'expense', color: '#64748b' },
  { id: 'donations', name: 'Donations', icon: 'heart-handshake', type: 'expense', color: '#475569' },
  { id: 'other_expense', name: 'Other', icon: 'more-horizontal', type: 'expense', color: '#334155' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export function getCategoryById(id: string): Category | undefined {
  return ALL_CATEGORIES.find(cat => cat.id === id);
}

export function getCategoriesByType(type: 'income' | 'expense'): Category[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
