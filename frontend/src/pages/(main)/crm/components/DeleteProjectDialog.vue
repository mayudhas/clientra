<script setup lang="ts">
import { ref } from 'vue';
import { useProjectsStore } from '@/stores/projects';
import { useNotificationStore } from '@/stores/notification';
import { AlertTriangleIcon, TrashIcon, XIcon } from 'vue-tabler-icons';

const props = defineProps({
  show: Boolean,
  projectData: Object,
});

const emit = defineEmits(['update:show', 'deleted']);

const projectsStore = useProjectsStore();
const notificationStore = useNotificationStore();
const loading = ref(false);

function close() {
  emit('update:show', false);
}

async function confirmDelete() {
  if (!props.projectData?.id) return;

  loading.value = true;
  try {
    await projectsStore.deleteProject(props.projectData.id);
    notificationStore.showSuccess('Project deleted successfully');
    emit('deleted');
    close();
  } catch (error: any) {
    notificationStore.showError(error.message || 'Failed to delete project');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="close" max-width="450px" persistent>
    <v-card>
      <v-card-text class="pa-6 text-center">
        <v-avatar color="error-lighten-5" size="72" class="mb-4">
          <AlertTriangleIcon size="40" class="text-error" />
        </v-avatar>
        
        <h3 class="text-h4 mb-2">Delete Project?</h3>
        <p class="text-body-1 text-medium-emphasis mb-6">
          Are you sure you want to delete <strong>{{ projectData?.name }}</strong>? This action cannot be undone.
        </p>

        <div class="d-flex gap-3 justify-center">
          <v-btn
            color="secondary"
            variant="tonal"
            @click="close"
            :disabled="loading"
            class="px-6"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="confirmDelete"
            :loading="loading"
            class="px-6"
          >
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
