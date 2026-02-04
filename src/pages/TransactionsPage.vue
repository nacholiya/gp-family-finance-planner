<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useAccountsStore } from '@/stores/accountsStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { BaseCard, BaseButton, BaseInput, BaseSelect, BaseModal } from '@/components/ui';
import { formatCurrency } from '@/constants/currencies';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants/categories';
import { formatDate, toISODateString } from '@/utils/date';
import type { CreateTransactionInput, TransactionType } from '@/types/models';

const transactionsStore = useTransactionsStore();
const accountsStore = useAccountsStore();
const settingsStore = useSettingsStore();

const showAddModal = ref(false);
const isSubmitting = ref(false);

const transactionTypes: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfer' },
];

const accountOptions = computed(() =>
  accountsStore.accounts.map((a) => ({ value: a.id, label: a.name }))
);

const categoryOptions = computed(() => {
  const categories = newTransaction.value.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return categories.map((c) => ({ value: c.id, label: c.name }));
});

const newTransaction = ref<CreateTransactionInput>({
  accountId: '',
  type: 'expense',
  amount: 0,
  currency: settingsStore.baseCurrency,
  category: '',
  date: toISODateString(new Date()),
  description: '',
  isReconciled: false,
});

const transactions = computed(() => transactionsStore.sortedTransactions);

function formatMoney(amount: number): string {
  return formatCurrency(amount, settingsStore.baseCurrency);
}

function openAddModal() {
  newTransaction.value = {
    accountId: accountsStore.accounts[0]?.id || '',
    type: 'expense',
    amount: 0,
    currency: settingsStore.baseCurrency,
    category: EXPENSE_CATEGORIES[0]?.id || '',
    date: toISODateString(new Date()),
    description: '',
    isReconciled: false,
  };
  showAddModal.value = true;
}

async function createTransaction() {
  if (!newTransaction.value.description.trim() || !newTransaction.value.accountId) return;

  isSubmitting.value = true;
  try {
    await transactionsStore.createTransaction(newTransaction.value);
    showAddModal.value = false;
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteTransaction(id: string) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    await transactionsStore.deleteTransaction(id);
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
        <p class="text-gray-500 dark:text-gray-400">Track your income and expenses</p>
      </div>
      <BaseButton @click="openAddModal">
        Add Transaction
      </BaseButton>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BaseCard>
        <p class="text-sm text-gray-500 dark:text-gray-400">This Month Income</p>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
          {{ formatMoney(transactionsStore.thisMonthIncome) }}
        </p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-gray-500 dark:text-gray-400">This Month Expenses</p>
        <p class="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
          {{ formatMoney(transactionsStore.thisMonthExpenses) }}
        </p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-gray-500 dark:text-gray-400">Net Cash Flow</p>
        <p
          class="text-2xl font-bold mt-1"
          :class="transactionsStore.thisMonthNetCashFlow >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ formatMoney(transactionsStore.thisMonthNetCashFlow) }}
        </p>
      </BaseCard>
    </div>

    <!-- Transactions List -->
    <BaseCard title="All Transactions">
      <div v-if="transactions.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No transactions recorded yet.</p>
        <p class="mt-2">Click "Add Transaction" to get started.</p>
      </div>
      <div v-else class="divide-y divide-gray-200 dark:divide-slate-700">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="py-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'"
            >
              <svg
                class="w-5 h-5"
                :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="transaction.type === 'income'"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 13l-5 5m0 0l-5-5m5 5V6"
                />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ transaction.description }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ transaction.category }} - {{ formatDate(transaction.date) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span
              class="text-lg font-semibold"
              :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
            >
              {{ transaction.type === 'income' ? '+' : '-' }}{{ formatMoney(transaction.amount) }}
            </span>
            <button
              class="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              @click="deleteTransaction(transaction.id)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Add Transaction Modal -->
    <BaseModal
      :open="showAddModal"
      title="Add Transaction"
      @close="showAddModal = false"
    >
      <form class="space-y-4" @submit.prevent="createTransaction">
        <BaseSelect
          v-model="newTransaction.type"
          :options="transactionTypes"
          label="Type"
        />

        <BaseSelect
          v-model="newTransaction.accountId"
          :options="accountOptions"
          label="Account"
          placeholder="Select an account"
        />

        <BaseInput
          v-model="newTransaction.description"
          label="Description"
          placeholder="e.g., Grocery shopping"
          required
        />

        <BaseSelect
          v-model="newTransaction.category"
          :options="categoryOptions"
          label="Category"
        />

        <BaseInput
          v-model="newTransaction.amount"
          type="number"
          label="Amount"
          placeholder="0.00"
        />

        <BaseInput
          v-model="newTransaction.date"
          type="date"
          label="Date"
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="showAddModal = false">
            Cancel
          </BaseButton>
          <BaseButton :loading="isSubmitting" @click="createTransaction">
            Add Transaction
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
