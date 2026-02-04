<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAccountsStore } from '@/stores/accountsStore';
import { useFamilyStore } from '@/stores/familyStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { BaseCard, BaseButton, BaseInput, BaseSelect, BaseModal } from '@/components/ui';
import { formatCurrency, CURRENCIES } from '@/constants/currencies';
import type { AccountType, CreateAccountInput } from '@/types/models';

const accountsStore = useAccountsStore();
const familyStore = useFamilyStore();
const settingsStore = useSettingsStore();

const showAddModal = ref(false);
const isSubmitting = ref(false);

const accountTypes: { value: AccountType; label: string }[] = [
  { value: 'checking', label: 'Checking Account' },
  { value: 'savings', label: 'Savings Account' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'investment', label: 'Investment Account' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'cash', label: 'Cash' },
  { value: 'loan', label: 'Loan' },
  { value: 'other', label: 'Other' },
];

const currencyOptions = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.code} - ${c.name}`,
}));

const newAccount = ref<CreateAccountInput>({
  memberId: familyStore.currentMemberId || '',
  name: '',
  type: 'checking',
  currency: settingsStore.baseCurrency,
  balance: 0,
  institution: '',
  isActive: true,
  includeInNetWorth: true,
});

const accounts = computed(() => accountsStore.accounts);

function formatMoney(amount: number, currency?: string): string {
  return formatCurrency(amount, currency || settingsStore.baseCurrency);
}

function getAccountTypeLabel(type: AccountType): string {
  return accountTypes.find((t) => t.value === type)?.label || type;
}

function openAddModal() {
  newAccount.value = {
    memberId: familyStore.currentMemberId || '',
    name: '',
    type: 'checking',
    currency: settingsStore.baseCurrency,
    balance: 0,
    institution: '',
    isActive: true,
    includeInNetWorth: true,
  };
  showAddModal.value = true;
}

async function createAccount() {
  if (!newAccount.value.name.trim()) return;

  isSubmitting.value = true;
  try {
    await accountsStore.createAccount(newAccount.value);
    showAddModal.value = false;
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteAccount(id: string) {
  if (confirm('Are you sure you want to delete this account?')) {
    await accountsStore.deleteAccount(id);
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Accounts</h1>
        <p class="text-gray-500 dark:text-gray-400">Manage your bank accounts and credit cards</p>
      </div>
      <BaseButton @click="openAddModal">
        Add Account
      </BaseButton>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BaseCard>
        <p class="text-sm text-gray-500 dark:text-gray-400">Total Assets</p>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
          {{ formatMoney(accountsStore.totalAssets) }}
        </p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-gray-500 dark:text-gray-400">Total Liabilities</p>
        <p class="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
          {{ formatMoney(accountsStore.totalLiabilities) }}
        </p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-gray-500 dark:text-gray-400">Net Worth</p>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
          {{ formatMoney(accountsStore.totalBalance) }}
        </p>
      </BaseCard>
    </div>

    <!-- Accounts List -->
    <BaseCard title="All Accounts">
      <div v-if="accounts.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No accounts added yet.</p>
        <p class="mt-2">Click "Add Account" to get started.</p>
      </div>
      <div v-else class="divide-y divide-gray-200 dark:divide-slate-700">
        <div
          v-for="account in accounts"
          :key="account.id"
          class="py-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ account.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ getAccountTypeLabel(account.type) }}
                <span v-if="account.institution"> - {{ account.institution }}</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span
              class="text-lg font-semibold"
              :class="account.type === 'credit_card' || account.type === 'loan' ? 'text-red-600' : 'text-green-600'"
            >
              {{ formatMoney(account.balance, account.currency) }}
            </span>
            <button
              class="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              @click="deleteAccount(account.id)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Add Account Modal -->
    <BaseModal
      :open="showAddModal"
      title="Add Account"
      @close="showAddModal = false"
    >
      <form class="space-y-4" @submit.prevent="createAccount">
        <BaseInput
          v-model="newAccount.name"
          label="Account Name"
          placeholder="e.g., Main Checking"
          required
        />

        <BaseSelect
          v-model="newAccount.type"
          :options="accountTypes"
          label="Account Type"
        />

        <BaseInput
          v-model="newAccount.institution"
          label="Institution"
          placeholder="e.g., Bank of America"
        />

        <BaseSelect
          v-model="newAccount.currency"
          :options="currencyOptions"
          label="Currency"
        />

        <BaseInput
          v-model="newAccount.balance"
          type="number"
          label="Current Balance"
          placeholder="0.00"
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="showAddModal = false">
            Cancel
          </BaseButton>
          <BaseButton :loading="isSubmitting" @click="createAccount">
            Add Account
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
