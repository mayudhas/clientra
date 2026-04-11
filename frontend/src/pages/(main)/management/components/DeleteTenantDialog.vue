<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTenantsStore } from '@/stores/tenants';
import { useNotificationStore } from '@/stores/notification';
import { AlertTriangleIcon, TrashIcon, UsersIcon, UsersGroupIcon, BriefcaseIcon, FileInvoiceIcon } from 'vue-tabler-icons';

const props = defineProps({
  show: Boolean,
  tenant: Object,
});

const emit = defineEmits(['update:show', 'deleted']);

const tenantsStore = useTenantsStore();
const notificationStore = useNotificationStore();
const loading = ref(false);
const stats = ref<any>(null);

watch(() => props.show, async (newVal) => {
  if (newVal && props.tenant) {
    stats.value = await tenantsStore.fetchTenantStats(props.tenant.id);
  } else {
    stats.value = null;
  }
});

function close() {
  emit('update:show', false);
}

async function confirmDelete() {
  if (!props.tenant) return;

  if (stats.value && stats.value.users > 0) {
    notificationStore.showError('Cannot delete tenant with active users. Please remove users first.');
    return;
  }

  loading.value = true;
  try {
    await tenantsStore.deleteTenant(props.tenant.id);
    notificationStore.showSuccess('Tenant deleted successfully');
    emit('deleted');
    close();
  } catch (error: any) {
    notificationStore.showError(error.message || 'Failed to delete tenant');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="close" max-width="500px">
    <v-card>
      <v-card-text class="pa-6 text-center">
        <v-avatar color="error" variant="tonal" size="70" class="mb-4">
          <AlertTriangleIcon size="40" class="text-error" />
        </v-avatar>
        
        <h3 class="text-h4 mb-2">Are you sure?</h3>
        <p class="text-body-1 text-secondary mb-6">
          You are about to delete <strong>{{ tenant?.name }}</strong>. 
          This action will permanently remove all associated data and cannot be undone.
        </p>

        <!-- Stats Display -->
        <v-row v-if="stats" class="bg-lightprimary rounded pa-4 mb-6 mx-0">
          <v-col cols="6" class="text-left border-right border-bottom pb-3">
            <div class="d-flex align-center text-subtitle-2 text-medium-emphasis">
              <UsersIcon size="16" class="mr-2" /> Users
            </div>
            <div class="text-h6" :class="stats.users > 0 ? 'text-error font-weight-bold' : ''">{{ stats.users }}</div>
          </v-col>
          <v-col cols="6" class="text-left border-bottom pb-3 pl-4">
            <div class="d-flex align-center text-subtitle-2 text-medium-emphasis">
              <UsersGroupIcon size="16" class="mr-2" /> Clients
            </div>
            <div class="text-h6">{{ stats.clients }}</div>
          </v-col>
          <v-col cols="6" class="text-left pt-3 border-right">
            <div class="d-flex align-center text-subtitle-2 text-medium-emphasis">
              <BriefcaseIcon size="16" class="mr-2" /> Projects
            </div>
            <div class="text-h6">{{ stats.projects }}</div>
          </v-col>
          <v-col cols="6" class="text-left pt-3 pl-4">
            <div class="d-flex align-center text-subtitle-2 text-medium-emphasis">
              <FileInvoiceIcon size="16" class="mr-2" /> Invoices
            </div>
            <div class="text-h6">{{ stats.invoices }}</div>
          </v-col>
        </v-row>

        <v-alert
          v-if="stats && stats.users > 0"
          type="error"
          variant="tonal"
          density="compact"
          class="text-left mb-6"
        >
          Tenant has active users. Deletion is restricted.
        </v-alert>

        <v-row class="ma-0">
          <v-col cols="6" class="pa-1">
            <v-btn
              block
              color="secondary"
              variant="tonal"
              @click="close"
              :disabled="loading"
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6" class="pa-1">
            <v-btn
              block
              color="error"
              variant="elevated"
              @click="confirmDelete"
              :loading="loading"
              :disabled="stats && stats.users > 0"
            >
              <TrashIcon size="18" class="mr-1" />
              Delete
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.gap-3 {
  gap: 12px;
}
.border-right {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.border-bottom {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
