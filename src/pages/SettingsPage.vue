<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore';
import { BaseCard, BaseSelect } from '@/components/ui';
import { CURRENCIES } from '@/constants/currencies';

const settingsStore = useSettingsStore();

const currencyOptions = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.code} - ${c.name}`,
}));

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

async function updateCurrency(value: string | number) {
  await settingsStore.setBaseCurrency(value as string);
}

async function updateTheme(value: string | number) {
  await settingsStore.setTheme(value as 'light' | 'dark' | 'system');
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
      <p class="text-gray-500 dark:text-gray-400">Configure your app preferences</p>
    </div>

    <!-- General Settings -->
    <BaseCard title="General">
      <div class="space-y-6">
        <BaseSelect
          :model-value="settingsStore.baseCurrency"
          :options="currencyOptions"
          label="Base Currency"
          hint="Your primary currency for displaying totals and conversions"
          @update:model-value="updateCurrency"
        />

        <BaseSelect
          :model-value="settingsStore.theme"
          :options="themeOptions"
          label="Theme"
          hint="Choose your preferred color scheme"
          @update:model-value="updateTheme"
        />
      </div>
    </BaseCard>

    <!-- Sync Settings -->
    <BaseCard title="Cloud Sync">
      <div class="text-center py-8 text-gray-500 dark:text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="font-medium">Google Drive Sync</p>
        <p class="mt-1 text-sm">Coming soon - Securely backup your data to Google Drive</p>
      </div>
    </BaseCard>

    <!-- AI Settings -->
    <BaseCard title="AI Insights">
      <div class="text-center py-8 text-gray-500 dark:text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p class="font-medium">AI-Powered Insights</p>
        <p class="mt-1 text-sm">Coming soon - Get personalized financial advice powered by AI</p>
      </div>
    </BaseCard>

    <!-- Data Management -->
    <BaseCard title="Data Management">
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
          <div>
            <p class="font-medium text-gray-900 dark:text-gray-100">Export Data</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Download all your data as a JSON file</p>
          </div>
          <button
            class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Export
          </button>
        </div>
        <div class="flex items-center justify-between py-3">
          <div>
            <p class="font-medium text-gray-900 dark:text-gray-100">Clear All Data</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Permanently delete all your data</p>
          </div>
          <button
            class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Clear Data
          </button>
        </div>
      </div>
    </BaseCard>

    <!-- About -->
    <BaseCard title="About">
      <div class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <p><strong class="text-gray-900 dark:text-gray-100">GP Family Financial Planner</strong></p>
        <p>Version 1.0.0 (MVP)</p>
        <p>A local-first, privacy-focused family finance application.</p>
        <p class="pt-2">
          Your data is stored locally in your browser and never leaves your device unless you enable cloud sync.
        </p>
      </div>
    </BaseCard>
  </div>
</template>
