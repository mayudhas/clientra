<script setup lang="ts">
import { ref } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps<{
  show: boolean;
  taskData: any;
  projectId: string;
}>();

const emit = defineEmits(['update:show', 'deleted']);

const tasksStore = useTasksStore();
const notificationStore = useNotificationStore();
const loading = ref(false);

function close() {
  emit('update:show', false);
}

async function confirmDelete() {
  if (!props.taskData) return;
  loading.value = true;
  try {
    await tasksStore.deleteTask(props.projectId, props.taskData.id);
    notificationStore.showSuccess('Task deleted successfully');
    emit('deleted');
    close();
  } catch (error: any) {
    notificationStore.showError(error.message || 'Failed to delete task');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="close" max-width="450" persistent>
    <v-card>
      <v-card-title class="pa-4 bg-error">
        <span class="text-h6 text-white">Delete Task</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <p class="text-body-1">
          Are you sure you want to delete the task
          <strong>"{{ taskData?.title }}"</strong>?
        </p>
        <p class="text-body-2 text-medium-emphasis mt-2">
          This action cannot be undone. The project progress will be recalculated automatically.
        </p>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="close" :disabled="loading">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="confirmDelete" :loading="loading" :disabled="loading">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
