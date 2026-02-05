import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  RecurringItem,
  CreateRecurringItemInput,
  UpdateRecurringItemInput,
} from '@/types/models';
import * as recurringRepo from '@/services/indexeddb/repositories/recurringItemRepository';

export const useRecurringStore = defineStore('recurring', () => {
  // State
  const recurringItems = ref<RecurringItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeItems = computed(() =>
    recurringItems.value.filter((item) => item.isActive)
  );

  const incomeItems = computed(() =>
    recurringItems.value.filter((item) => item.type === 'income')
  );

  const expenseItems = computed(() =>
    recurringItems.value.filter((item) => item.type === 'expense')
  );

  const activeIncomeItems = computed(() =>
    activeItems.value.filter((item) => item.type === 'income')
  );

  const activeExpenseItems = computed(() =>
    activeItems.value.filter((item) => item.type === 'expense')
  );

  // Normalize amount to monthly equivalent
  function normalizeToMonthly(amount: number, frequency: string): number {
    switch (frequency) {
      case 'daily':
        return amount * 30;
      case 'monthly':
        return amount;
      case 'yearly':
        return amount / 12;
      default:
        return amount;
    }
  }

  const totalMonthlyRecurringIncome = computed(() =>
    activeIncomeItems.value.reduce(
      (sum, item) => sum + normalizeToMonthly(item.amount, item.frequency),
      0
    )
  );

  const totalMonthlyRecurringExpenses = computed(() =>
    activeExpenseItems.value.reduce(
      (sum, item) => sum + normalizeToMonthly(item.amount, item.frequency),
      0
    )
  );

  const netMonthlyRecurring = computed(() =>
    totalMonthlyRecurringIncome.value - totalMonthlyRecurringExpenses.value
  );

  const sortedByDescription = computed(() =>
    [...recurringItems.value].sort((a, b) =>
      a.description.localeCompare(b.description)
    )
  );

  // Actions
  async function loadRecurringItems(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      recurringItems.value = await recurringRepo.getAllRecurringItems();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load recurring items';
    } finally {
      isLoading.value = false;
    }
  }

  async function createRecurringItem(
    input: CreateRecurringItemInput
  ): Promise<RecurringItem | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const item = await recurringRepo.createRecurringItem(input);
      recurringItems.value.push(item);
      return item;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create recurring item';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateRecurringItem(
    id: string,
    input: UpdateRecurringItemInput
  ): Promise<RecurringItem | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await recurringRepo.updateRecurringItem(id, input);
      if (updated) {
        const index = recurringItems.value.findIndex((item) => item.id === id);
        if (index !== -1) {
          recurringItems.value[index] = updated;
        }
      }
      return updated ?? null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update recurring item';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteRecurringItem(id: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;
    try {
      const success = await recurringRepo.deleteRecurringItem(id);
      if (success) {
        recurringItems.value = recurringItems.value.filter((item) => item.id !== id);
      }
      return success;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete recurring item';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function toggleActive(id: string): Promise<boolean> {
    const item = recurringItems.value.find((i) => i.id === id);
    if (!item) return false;
    const updated = await updateRecurringItem(id, { isActive: !item.isActive });
    return !!updated;
  }

  function getRecurringItemById(id: string): RecurringItem | undefined {
    return recurringItems.value.find((item) => item.id === id);
  }

  function getItemsByAccountId(accountId: string): RecurringItem[] {
    return recurringItems.value.filter((item) => item.accountId === accountId);
  }

  return {
    // State
    recurringItems,
    isLoading,
    error,
    // Getters
    activeItems,
    incomeItems,
    expenseItems,
    activeIncomeItems,
    activeExpenseItems,
    totalMonthlyRecurringIncome,
    totalMonthlyRecurringExpenses,
    netMonthlyRecurring,
    sortedByDescription,
    // Actions
    loadRecurringItems,
    createRecurringItem,
    updateRecurringItem,
    deleteRecurringItem,
    toggleActive,
    getRecurringItemById,
    getItemsByAccountId,
  };
});
