<script setup lang="ts">
import { ref } from 'vue';
import { useClientsStore } from '@/stores/clients';
import { useNotificationStore } from '@/stores/notification';
import { AlertCircleIcon, TrashIcon } from 'vue-tabler-icons';

const props = defineProps({
  show: Boolean,
  client: Object,
});

const emit = defineEmits(['update:show', 'deleted']);

const clientsStore = useClientsStore();
const notificationStore = useNotificationStore();
const loading = ref(false);

function close() {
  emit('update:show', false);
}

async function remove() {
  if (!props.client) return;

  loading.value = true;
  try {
    await clientsStore.deleteClient(props.client.id);
    notificationStore.showSuccess(`Client "${props.client.name}" deleted successfully`);
    emit('deleted');
    close();
  } catch (error: any) {
    notificationStore.showError(error.message || 'Failed to delete client');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="close" max-width="400px">
    <v-card>
      <v-card-text class="pa-6 text-center">
        <v-avatar color="lighterror" size="70" class="mb-4">
          <AlertCircleIcon size="40" class="text-error" />
        </v-avatar>
        
        <h3 class="text-h4 mb-2">Delete Client?</h3>
        <p class="text-body-1 text-medium-emphasis mb-6">
          Are you sure you want to delete <strong>{{ client?.name }}</strong>? This action cannot be undone.
        </p>

        <div class="d-flex gap-3 justify-center">
          <v-btn variant="tonal" color="secondary" @click="close" :disabled="loading">
            Cancel
          </v-btn>
          <v-btn color="error" @click="remove" :loading="loading">
            <TrashIcon size="18" class="mr-1" />
            Delete
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>
