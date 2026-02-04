<script setup lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
  padding?: boolean;
  hoverable?: boolean;
}

withDefaults(defineProps<Props>(), {
  padding: true,
  hoverable: false,
});
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700"
    :class="{
      'hover:shadow-md transition-shadow cursor-pointer': hoverable,
    }"
  >
    <div
      v-if="title || $slots.header"
      class="px-6 py-4 border-b border-gray-200 dark:border-slate-700"
    >
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ subtitle }}
        </p>
      </slot>
    </div>

    <div :class="{ 'p-6': padding }">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-b-xl"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
