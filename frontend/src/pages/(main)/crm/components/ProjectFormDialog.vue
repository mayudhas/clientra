<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { useProjectsStore } from '@/stores/projects';
import { useClientsStore } from '@/stores/clients';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import { XIcon, CheckIcon, BriefcaseIcon, UserIcon, CalendarIcon, LoaderIcon } from 'vue-tabler-icons';

const props = defineProps({
  show: Boolean,
  editMode: Boolean,
  projectData: Object,
});

const emit = defineEmits(['update:show', 'saved']);

const projectsStore = useProjectsStore();
const clientsStore = useClientsStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const loading = ref(false);
const formRef = ref<any>(null);

const clients = computed(() => clientsStore.clients);
const loadingClients = ref(false);

const formData = reactive({
  name: '',
  description: '',
  status: 'planning',
  priority: 'medium',
  budget: 0,
  startDate: '',
  endDate: '',
  progress: 0,
  clientId: null as string | null,
});

const rules = {
  name: [
    (v: string) => !!v || 'Name is required',
    (v: string) => v.length >= 2 || 'Name must be at least 2 characters',
  ],
  clientId: [
    (v: any) => !!v || 'Client is required',
  ],
};

const statusOptions = [
  { title: 'Planning', value: 'planning' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'On Hold', value: 'on_hold' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' },
];

const priorityOptions = [
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
  { title: 'Urgent', value: 'urgent' },
];

async function loadClients() {
  loadingClients.value = true;
  try {
    await clientsStore.fetchClients();
  } catch (err) {
    console.error('Failed to load clients', err);
  } finally {
    loadingClients.value = false;
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    loadClients();
    
    if (props.editMode && props.projectData) {
      formData.name = props.projectData.name || '';
      formData.description = props.projectData.description || '';
      formData.status = props.projectData.status || 'planning';
      formData.priority = props.projectData.priority || 'medium';
      formData.budget = props.projectData.budget ? Number(props.projectData.budget) : 0;
      formData.startDate = props.projectData.startDate || '';
      formData.endDate = props.projectData.endDate || '';
      formData.progress = props.projectData.progress ? Number(props.projectData.progress) : 0;
      formData.clientId = props.projectData.clientId || null;
    } else {
      formData.name = '';
      formData.description = '';
      formData.status = 'planning';
      formData.priority = 'medium';
      formData.budget = 0;
      formData.startDate = '';
      formData.endDate = '';
      formData.progress = 0;
      formData.clientId = null;
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
    
    // Ensure numeric fields are actually numbers
    payload.budget = Number(payload.budget) || 0;
    payload.progress = Number(payload.progress) || 0;
    
    // Clean up empty strings for optional fields and dates
    if (!payload.startDate) payload.startDate = null;
    if (!payload.endDate) payload.endDate = null;
    if (!payload.description) payload.description = null;

    if (props.editMode && props.projectData) {
      await projectsStore.updateProject(props.projectData.id, payload);
      notificationStore.showSuccess('Project updated successfully');
    } else {
      await projectsStore.createProject(payload as any);
      notificationStore.showSuccess('Project created successfully');
    }
    emit('saved');
    close();
  } catch (error: any) {
    notificationStore.showError(error.message || 'Failed to save project');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="close" max-width="700px" persistent>
    <v-card>
      <v-card-title class="pa-4 bg-primary text-white d-flex align-center">
        <BriefcaseIcon size="24" class="mr-2" />
        <span class="text-h5">{{ editMode ? 'Edit Project' : 'New Project' }}</span>
        <v-spacer />
        <v-btn icon color="white" variant="text" @click="close">
          <XIcon size="20" />
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" @submit.prevent="save">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.name"
                label="Project Name*"
                variant="outlined"
                color="primary"
                :rules="rules.name"
                required
                prepend-inner-icon="mdi-briefcase-outline"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="formData.clientId"
                :items="clients"
                item-title="name"
                item-value="id"
                label="Client*"
                variant="outlined"
                color="primary"
                :rules="rules.clientId"
                required
                :loading="loadingClients"
              >
                <template v-slot:prepend-inner>
                   <UserIcon size="20" class="text-secondary" />
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formData.status"
                :items="statusOptions"
                label="Status"
                variant="outlined"
                color="primary"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="formData.priority"
                :items="priorityOptions"
                label="Priority"
                variant="outlined"
                color="primary"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.budget"
                label="Budget"
                type="number"
                variant="outlined"
                color="primary"
                prefix="IDR"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                color="primary"
              >
                <template v-slot:prepend-inner>
                   <CalendarIcon size="20" class="text-secondary" />
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.endDate"
                label="Deadline"
                type="date"
                variant="outlined"
                color="primary"
              >
                <template v-slot:prepend-inner>
                   <CalendarIcon size="20" class="text-secondary" />
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <div class="d-flex align-center mb-1">
                <span class="text-subtitle-2 text-medium-emphasis">Progress: {{ formData.progress }}%</span>
              </div>
              <v-slider
                v-model="formData.progress"
                color="primary"
                track-color="info"
                min="0"
                max="100"
                step="5"
                class="mt-2"
                hide-details
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Project Description"
                variant="outlined"
                color="primary"
                rows="3"
                hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="error" variant="text" @click="close" :disabled="loading">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="save"
          :loading="loading"
        >
          <CheckIcon size="18" class="mr-1" />
          {{ editMode ? 'Update Project' : 'Create Project' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
