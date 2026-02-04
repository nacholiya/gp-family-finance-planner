import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type {
  FamilyMember,
  Account,
  Transaction,
  Asset,
  Goal,
  Settings,
  SyncQueueItem,
} from '@/types/models';

const DB_NAME = 'gp-family-finance';
const DB_VERSION = 1;

export interface FinanceDB extends DBSchema {
  familyMembers: {
    key: string;
    value: FamilyMember;
    indexes: { 'by-email': string };
  };
  accounts: {
    key: string;
    value: Account;
    indexes: { 'by-memberId': string; 'by-type': string };
  };
  transactions: {
    key: string;
    value: Transaction;
    indexes: { 'by-accountId': string; 'by-date': string; 'by-category': string };
  };
  assets: {
    key: string;
    value: Asset;
    indexes: { 'by-memberId': string; 'by-type': string };
  };
  goals: {
    key: string;
    value: Goal;
    indexes: { 'by-memberId': string };
  };
  settings: {
    key: string;
    value: Settings;
  };
  syncQueue: {
    key: string;
    value: SyncQueueItem;
    indexes: { 'by-synced': number; 'by-timestamp': string };
  };
}

let dbInstance: IDBPDatabase<FinanceDB> | null = null;

export async function getDatabase(): Promise<IDBPDatabase<FinanceDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<FinanceDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // FamilyMembers store
      if (!db.objectStoreNames.contains('familyMembers')) {
        const familyStore = db.createObjectStore('familyMembers', { keyPath: 'id' });
        familyStore.createIndex('by-email', 'email', { unique: true });
      }

      // Accounts store
      if (!db.objectStoreNames.contains('accounts')) {
        const accountsStore = db.createObjectStore('accounts', { keyPath: 'id' });
        accountsStore.createIndex('by-memberId', 'memberId', { unique: false });
        accountsStore.createIndex('by-type', 'type', { unique: false });
      }

      // Transactions store
      if (!db.objectStoreNames.contains('transactions')) {
        const transactionsStore = db.createObjectStore('transactions', { keyPath: 'id' });
        transactionsStore.createIndex('by-accountId', 'accountId', { unique: false });
        transactionsStore.createIndex('by-date', 'date', { unique: false });
        transactionsStore.createIndex('by-category', 'category', { unique: false });
      }

      // Assets store
      if (!db.objectStoreNames.contains('assets')) {
        const assetsStore = db.createObjectStore('assets', { keyPath: 'id' });
        assetsStore.createIndex('by-memberId', 'memberId', { unique: false });
        assetsStore.createIndex('by-type', 'type', { unique: false });
      }

      // Goals store
      if (!db.objectStoreNames.contains('goals')) {
        const goalsStore = db.createObjectStore('goals', { keyPath: 'id' });
        goalsStore.createIndex('by-memberId', 'memberId', { unique: false });
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }

      // SyncQueue store
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        syncStore.createIndex('by-synced', 'synced', { unique: false });
        syncStore.createIndex('by-timestamp', 'timestamp', { unique: false });
      }
    },
  });

  return dbInstance;
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

export async function clearAllData(): Promise<void> {
  const db = await getDatabase();
  const tx = db.transaction(
    ['familyMembers', 'accounts', 'transactions', 'assets', 'goals', 'settings', 'syncQueue'],
    'readwrite'
  );

  await Promise.all([
    tx.objectStore('familyMembers').clear(),
    tx.objectStore('accounts').clear(),
    tx.objectStore('transactions').clear(),
    tx.objectStore('assets').clear(),
    tx.objectStore('goals').clear(),
    tx.objectStore('settings').clear(),
    tx.objectStore('syncQueue').clear(),
    tx.done,
  ]);
}

export async function exportAllData(): Promise<{
  familyMembers: FamilyMember[];
  accounts: Account[];
  transactions: Transaction[];
  assets: Asset[];
  goals: Goal[];
  settings: Settings | null;
}> {
  const db = await getDatabase();

  const [familyMembers, accounts, transactions, assets, goals, settings] = await Promise.all([
    db.getAll('familyMembers'),
    db.getAll('accounts'),
    db.getAll('transactions'),
    db.getAll('assets'),
    db.getAll('goals'),
    db.get('settings', 'app_settings'),
  ]);

  return {
    familyMembers,
    accounts,
    transactions,
    assets,
    goals,
    settings: settings ?? null,
  };
}
