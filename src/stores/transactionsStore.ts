import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  ISODateString,
} from '@/types/models';
import * as transactionRepo from '@/services/indexeddb/repositories/transactionRepository';
import { getStartOfMonth, getEndOfMonth, toISODateString, isDateBetween } from '@/utils/date';

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const transactions = ref<Transaction[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const sortedTransactions = computed(() =>
    [...transactions.value].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );

  const recentTransactions = computed(() => sortedTransactions.value.slice(0, 10));

  const thisMonthTransactions = computed(() => {
    const now = new Date();
    const start = toISODateString(getStartOfMonth(now));
    const end = toISODateString(getEndOfMonth(now));
    return transactions.value.filter((t) => isDateBetween(t.date, start, end));
  });

  const thisMonthIncome = computed(() =>
    thisMonthTransactions.value
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const thisMonthExpenses = computed(() =>
    thisMonthTransactions.value
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const thisMonthNetCashFlow = computed(() => thisMonthIncome.value - thisMonthExpenses.value);

  const expensesByCategory = computed(() => {
    const categoryTotals = new Map<string, number>();
    for (const t of thisMonthTransactions.value.filter((t) => t.type === 'expense')) {
      const current = categoryTotals.get(t.category) || 0;
      categoryTotals.set(t.category, current + t.amount);
    }
    return categoryTotals;
  });

  // Actions
  async function loadTransactions() {
    isLoading.value = true;
    error.value = null;
    try {
      transactions.value = await transactionRepo.getAllTransactions();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load transactions';
    } finally {
      isLoading.value = false;
    }
  }

  async function createTransaction(input: CreateTransactionInput): Promise<Transaction | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const transaction = await transactionRepo.createTransaction(input);
      transactions.value.push(transaction);
      return transaction;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create transaction';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTransaction(
    id: string,
    input: UpdateTransactionInput
  ): Promise<Transaction | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await transactionRepo.updateTransaction(id, input);
      if (updated) {
        const index = transactions.value.findIndex((t) => t.id === id);
        if (index !== -1) {
          transactions.value[index] = updated;
        }
      }
      return updated ?? null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update transaction';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTransaction(id: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;
    try {
      const success = await transactionRepo.deleteTransaction(id);
      if (success) {
        transactions.value = transactions.value.filter((t) => t.id !== id);
      }
      return success;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete transaction';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function getTransactionById(id: string): Transaction | undefined {
    return transactions.value.find((t) => t.id === id);
  }

  function getTransactionsByAccountId(accountId: string): Transaction[] {
    return transactions.value.filter((t) => t.accountId === accountId);
  }

  function getTransactionsByDateRange(start: ISODateString, end: ISODateString): Transaction[] {
    return transactions.value.filter((t) => isDateBetween(t.date, start, end));
  }

  return {
    // State
    transactions,
    isLoading,
    error,
    // Getters
    sortedTransactions,
    recentTransactions,
    thisMonthTransactions,
    thisMonthIncome,
    thisMonthExpenses,
    thisMonthNetCashFlow,
    expensesByCategory,
    // Actions
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    getTransactionsByAccountId,
    getTransactionsByDateRange,
  };
});
