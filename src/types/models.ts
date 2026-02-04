// Type aliases for clarity
export type UUID = string;
export type ISODateString = string;
export type CurrencyCode = string; // ISO 4217 codes (e.g., 'USD', 'EUR', 'GBP')

// FamilyMember - Each family member has their own profile
export interface FamilyMember {
  id: UUID;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  color: string; // UI differentiation
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Account - Bank accounts, credit cards, investments
export type AccountType =
  | 'checking'
  | 'savings'
  | 'credit_card'
  | 'investment'
  | 'crypto'
  | 'cash'
  | 'loan'
  | 'other';

export interface Account {
  id: UUID;
  memberId: UUID;
  name: string;
  type: AccountType;
  currency: CurrencyCode;
  balance: number;
  institution?: string;
  isActive: boolean;
  includeInNetWorth: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Transaction - Income and expenses
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  interval: number; // e.g., every 2 weeks
  startDate: ISODateString;
  endDate?: ISODateString;
  lastProcessed?: ISODateString;
}

export interface Transaction {
  id: UUID;
  accountId: UUID;
  toAccountId?: UUID; // For transfers
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  category: string;
  date: ISODateString;
  description: string;
  recurring?: RecurringConfig;
  isReconciled: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Asset - Property, vehicles, valuables
export type AssetType =
  | 'real_estate'
  | 'vehicle'
  | 'investment'
  | 'crypto'
  | 'collectible'
  | 'other';

export interface Asset {
  id: UUID;
  memberId: UUID;
  type: AssetType;
  name: string;
  purchaseValue: number;
  currentValue: number;
  purchaseDate?: ISODateString;
  currency: CurrencyCode;
  notes?: string;
  includeInNetWorth: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Goal - Savings targets
export type GoalType = 'savings' | 'debt_payoff' | 'investment' | 'purchase';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Goal {
  id: UUID;
  memberId?: UUID; // null = family-wide goal
  name: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  currency: CurrencyCode;
  deadline?: ISODateString;
  priority: GoalPriority;
  isCompleted: boolean;
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Exchange rate for currency conversion
export interface ExchangeRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  updatedAt: ISODateString;
}

// AI Provider configuration
export type AIProvider = 'claude' | 'openai' | 'gemini' | 'none';

export interface AIApiKeys {
  claude?: string;
  openai?: string;
  gemini?: string;
}

// Settings - App configuration
export interface Settings {
  id: 'app_settings';
  baseCurrency: CurrencyCode;
  exchangeRates: ExchangeRate[];
  theme: 'light' | 'dark' | 'system';
  syncEnabled: boolean;
  aiProvider: AIProvider;
  aiApiKeys: AIApiKeys;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Sync queue item for tracking changes
export type SyncOperation = 'create' | 'update' | 'delete';
export type EntityType = 'familyMember' | 'account' | 'transaction' | 'asset' | 'goal' | 'settings';

export interface SyncQueueItem {
  id: UUID;
  entityType: EntityType;
  entityId: UUID;
  operation: SyncOperation;
  data?: Record<string, unknown>;
  timestamp: ISODateString;
  synced: boolean;
}

// Google Auth state
export interface GoogleAuthState {
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: ISODateString;
  userEmail?: string;
}

// Category definitions for income and expenses
export interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'income' | 'expense' | 'both';
  color: string;
}

// Form types for creating/updating entities
export type CreateFamilyMemberInput = Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFamilyMemberInput = Partial<Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateAccountInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAccountInput = Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateTransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTransactionInput = Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateAssetInput = Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAssetInput = Partial<Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateGoalInput = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGoalInput = Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>;
