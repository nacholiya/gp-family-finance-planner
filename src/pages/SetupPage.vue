<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useFamilyStore } from '@/stores/familyStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { BaseButton, BaseInput, BaseSelect, BaseCard } from '@/components/ui';
import { CURRENCIES, DEFAULT_CURRENCY } from '@/constants/currencies';

const router = useRouter();
const familyStore = useFamilyStore();
const settingsStore = useSettingsStore();

const isSubmitting = ref(false);
const step = ref(1);

const form = reactive({
  name: '',
  email: '',
  baseCurrency: DEFAULT_CURRENCY,
});

const errors = reactive({
  name: '',
  email: '',
});

const currencyOptions = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.code} - ${c.name}`,
}));

const colors: string[] = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

function validateStep1(): boolean {
  errors.name = '';
  errors.email = '';

  if (!form.name.trim()) {
    errors.name = 'Name is required';
    return false;
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required';
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
    return false;
  }

  return true;
}

function nextStep() {
  if (step.value === 1 && validateStep1()) {
    step.value = 2;
  }
}

function prevStep() {
  if (step.value > 1) {
    step.value -= 1;
  }
}

async function completeSetup() {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    // Create the owner profile
    const randomColor = colors[Math.floor(Math.random() * colors.length)] ?? '#3b82f6';
    const member = await familyStore.createMember({
      name: form.name.trim(),
      email: form.email.trim(),
      role: 'owner',
      color: randomColor,
    });

    if (member) {
      familyStore.setCurrentMember(member.id);
    }

    // Set base currency
    await settingsStore.setBaseCurrency(form.baseCurrency);

    // Navigate to dashboard
    router.replace('/dashboard');
  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-600 dark:text-blue-400">
          GP Family Finance
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Let's get you set up
        </p>
      </div>

      <BaseCard>
        <!-- Step indicator -->
        <div class="flex items-center justify-center mb-8">
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-medium"
              :class="step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'"
            >
              1
            </div>
            <div
              class="w-16 h-1 mx-2"
              :class="step >= 2 ? 'bg-blue-600' : 'bg-gray-200'"
            />
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-medium"
              :class="step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'"
            >
              2
            </div>
          </div>
        </div>

        <!-- Step 1: Personal Info -->
        <div v-if="step === 1" class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Create Your Profile
          </h2>

          <BaseInput
            v-model="form.name"
            label="Your Name"
            placeholder="Enter your name"
            :error="errors.name"
            required
          />

          <BaseInput
            v-model="form.email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            :error="errors.email"
            required
          />

          <div class="pt-4">
            <BaseButton
              class="w-full"
              @click="nextStep"
            >
              Continue
            </BaseButton>
          </div>
        </div>

        <!-- Step 2: Preferences -->
        <div v-if="step === 2" class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Set Your Preferences
          </h2>

          <BaseSelect
            v-model="form.baseCurrency"
            :options="currencyOptions"
            label="Base Currency"
            hint="This will be your primary currency for displaying totals"
          />

          <div class="pt-4 flex gap-3">
            <BaseButton
              variant="secondary"
              class="flex-1"
              @click="prevStep"
            >
              Back
            </BaseButton>
            <BaseButton
              class="flex-1"
              :loading="isSubmitting"
              @click="completeSetup"
            >
              Get Started
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Your data is stored locally and never leaves your device unless you enable sync.
      </p>
    </div>
  </div>
</template>
