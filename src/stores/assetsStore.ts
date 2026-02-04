import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Asset, CreateAssetInput, UpdateAssetInput } from '@/types/models';
import * as assetRepo from '@/services/indexeddb/repositories/assetRepository';

export const useAssetsStore = defineStore('assets', () => {
  // State
  const assets = ref<Asset[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalAssetValue = computed(() =>
    assets.value
      .filter((a) => a.includeInNetWorth)
      .reduce((sum, a) => sum + a.currentValue, 0)
  );

  const totalPurchaseValue = computed(() =>
    assets.value.reduce((sum, a) => sum + a.purchaseValue, 0)
  );

  const totalAppreciation = computed(() => totalAssetValue.value - totalPurchaseValue.value);

  const assetsByType = computed(() => {
    const grouped = new Map<string, Asset[]>();
    for (const asset of assets.value) {
      const typeAssets = grouped.get(asset.type) || [];
      typeAssets.push(asset);
      grouped.set(asset.type, typeAssets);
    }
    return grouped;
  });

  const assetsByMember = computed(() => {
    const grouped = new Map<string, Asset[]>();
    for (const asset of assets.value) {
      const memberAssets = grouped.get(asset.memberId) || [];
      memberAssets.push(asset);
      grouped.set(asset.memberId, memberAssets);
    }
    return grouped;
  });

  // Actions
  async function loadAssets() {
    isLoading.value = true;
    error.value = null;
    try {
      assets.value = await assetRepo.getAllAssets();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load assets';
    } finally {
      isLoading.value = false;
    }
  }

  async function createAsset(input: CreateAssetInput): Promise<Asset | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const asset = await assetRepo.createAsset(input);
      assets.value.push(asset);
      return asset;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create asset';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAsset(id: string, input: UpdateAssetInput): Promise<Asset | null> {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await assetRepo.updateAsset(id, input);
      if (updated) {
        const index = assets.value.findIndex((a) => a.id === id);
        if (index !== -1) {
          assets.value[index] = updated;
        }
      }
      return updated ?? null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update asset';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAsset(id: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;
    try {
      const success = await assetRepo.deleteAsset(id);
      if (success) {
        assets.value = assets.value.filter((a) => a.id !== id);
      }
      return success;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete asset';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function getAssetById(id: string): Asset | undefined {
    return assets.value.find((a) => a.id === id);
  }

  function getAssetsByMemberId(memberId: string): Asset[] {
    return assets.value.filter((a) => a.memberId === memberId);
  }

  return {
    // State
    assets,
    isLoading,
    error,
    // Getters
    totalAssetValue,
    totalPurchaseValue,
    totalAppreciation,
    assetsByType,
    assetsByMember,
    // Actions
    loadAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    getAssetById,
    getAssetsByMemberId,
  };
});
