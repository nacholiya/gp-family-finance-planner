import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Account, CreateAccountInput, UpdateAccountInput } from '@/types/models';
import * as accountRepo from '@/services/indexeddb/repositories/accountRepository';

export const useAccountsStore = defineStore('accounts', () => {
  // State
  const accounts = ref<Account[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeAccounts = computed(() => accounts.value.filter((a) => a.isActive));

  const accountsByMember = computed(() => {
    const grouped = new Map<string, Account[]>();
    for (const account of accounts.value) {
      const memberAccounts = grouped.get(account.memberId) || [];
      memberAccounts.push(account);
      grouped.set(account.memberId, memberAccounts);
    }
    return grouped;
  });

  const totalBalance = computed(() => {
    return accounts.value
      .filter((a) => a.isActive && a.includeInNetWorth)
      .reduce((sum, account) => {
        const multiplier = account.type === 'credit_card' || account.type === 'loan' ? -1 : 1;
        return sum + account.balance * multiplier;
      }, 0);
  });

  const totalAssets = computed(() => {
    return accounts.value
      .filter(
        (a) =>
          a.isActive &&
          a.includeInNetWorth &&
          a.type !== 'credit_card' &&
          a.type !== 'loan'
      )
      .reduce((sum, a) => sum + a.balance, 0);
  });

  const totalLiabilities = computed(() => {
    return accounts.value
      .filter(
        (a) =>
          a.isActive &&
          a.includeInNetWorth &&
          (a.type === 'credit_card' || a.type === 'loan')
      )
      .reduce((sum, a) => sum + a.balance, 0);
  });

  // Actions
  async function loadAccounts() {
    isLoading.value = true;
    error.value = null;
    try {
      accounts.value = await accountRepo.getAllAccounts();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load accounts';
    } finally {
      isLoading.value = false;
    }
  }

  async function createAccount(input: CreateAccountInput): Promise<Account | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const account = await accountRepo.createAccount(input);
      accounts.value.push(account);
      return account;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create account';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAccount(
    id: string,
    input: UpdateAccountInput
  ): Promise<Account | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await accountRepo.updateAccount(id, input);
      if (updated) {
        const index = accounts.value.findIndex((a) => a.id === id);
        if (index !== -1) {
          accounts.value[index] = updated;
        }
      }
      return updated ?? null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update account';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAccount(id: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;
    try {
      const success = await accountRepo.deleteAccount(id);
      if (success) {
        accounts.value = accounts.value.filter((a) => a.id !== id);
      }
      return success;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete account';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function getAccountById(id: string): Account | undefined {
    return accounts.value.find((a) => a.id === id);
  }

  function getAccountsByMemberId(memberId: string): Account[] {
    return accounts.value.filter((a) => a.memberId === memberId);
  }

  return {
    // State
    accounts,
    isLoading,
    error,
    // Getters
    activeAccounts,
    accountsByMember,
    totalBalance,
    totalAssets,
    totalLiabilities,
    // Actions
    loadAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    getAccountsByMemberId,
  };
});
