<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps<{
  show: boolean;
  editMode: boolean;
  taskData?: any;
  projectId: string;
}>();

const emit = defineEmits(['update:show', 'saved']);

const tasksStore = useTasksStore();
const notificationStore = useNotificationStore();
const formRef = ref();
const loading = ref(false);

const formData = reactive({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
});

const statusOptions = [
  { title: 'To Do', value: 'todo' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Done', value: 'done' },
];

const priorityOptions = [
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
];

const dialogTitle = computed(() => (props.editMode ? 'Edit Task' : 'Add New Task'));
const submitLabel = computed(() => (props.editMode ? 'Update Task' : 'Create Task'));

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.editMode && props.taskData) {
      formData.title = props.taskData.title || '';
      formData.description = props.taskData.description || '';
      formData.status = props.taskData.status || 'todo';
      formData.priority = props.taskData.priority || 'medium';
      formData.dueDate = props.taskData.dueDate || '';
    } else {
      formData.title = '';
      formData.description = '';
      formData.status = 'todo';
      formData.priority = 'medium';
      formData.dueDate = '';
    }
    if (formRef.value) formRef.value.resetValidation();
  }
});

function close() {
  emit('update:show', false);
}

async function save() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const payload: any = { ...formData };

    // Clean up empty optional fields
    if (!payload.dueDate) payload.dueDate = null;
    if (!payload.description) payload.description = null;

    if (props.editMode && props.taskData) {
      await tasksStore.updateTask(props.projectId, props.taskData.id, payload);
      notificationStore.showSuccess('Task updated successfully');
    } else {
      await tasksStore.createTask(props.projectId, payload);
      notificationStore.showSuccess('Task created successfully');
    }
    emit('saved');
    close();
  } catch (error: any) {
    notificationStore.showError(error.message || 'Failed to save task');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="close" max-width="550" persistent>
    <v-card>
      <v-card-title class="pa-4 bg-primary">
        <span class="text-h6 text-white">{{ dialogTitle }}</span>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form ref="formRef" @submit.prevent="save">
          <v-text-field
            v-model="formData.title"
            label="Task Title*"
            :rules="[(v: string) => !!v || 'Title is required']"
            variant="outlined"
            color="primary"
            class="mb-3"
          />

          <v-textarea
            v-model="formData.description"
            label="Description"
            variant="outlined"
            color="primary"
            rows="3"
            class="mb-3"
          />

          <v-row>
            <v-col cols="6">
              <v-select
                v-model="formData.status"
                :items="statusOptions"
                item-title="title"
                item-value="value"
                label="Status"
                variant="outlined"
                color="primary"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="formData.priority"
                :items="priorityOptions"
                item-title="title"
                item-value="value"
                label="Priority"
                variant="outlined"
                color="primary"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="formData.dueDate"
            label="Due Date"
            type="date"
            variant="outlined"
            color="primary"
            class="mb-3"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="close" :disabled="loading">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="save" :loading="loading" :disabled="loading">
          {{ submitLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
