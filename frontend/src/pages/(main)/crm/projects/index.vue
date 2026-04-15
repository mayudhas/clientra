<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ProjectFormDialog from '../components/ProjectFormDialog.vue';
import DeleteProjectDialog from '../components/DeleteProjectDialog.vue';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, EyeIcon } from 'vue-tabler-icons';

const router = useRouter();

const page = ref({ title: 'Projects' });
const breadcrumbs = ref([
  { title: 'CRM', disabled: false, href: '#' },
  { title: 'Projects', disabled: true, href: '#' }
]);

const projectsStore = useProjectsStore();
const search = ref('');

// Dialog states
const showFormDialog = ref(false);
const showDeleteDialog = ref(false);
const editMode = ref(false);
const selectedProject = ref<any>(null);

const headers = [
  { title: 'Project Name', key: 'name' },
  { title: 'Client', key: 'client.name' },
  { title: 'Status', key: 'status' },
  { title: 'Priority', key: 'priority' },
  { title: 'Deadline', key: 'endDate' },
  { title: 'Progress', key: 'progress' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
];

const projects = computed(() => projectsStore.projects);
const loading = computed(() => projectsStore.loading);

onMounted(() => {
  projectsStore.fetchProjects();
});

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'planning': 'secondary',
    'in_progress': 'info',
    'on_hold': 'warning',
    'completed': 'success',
    'cancelled': 'error'
  };
  return colors[status] || 'default';
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    'low': 'success',
    'medium': 'info',
    'high': 'warning',
    'urgent': 'error'
  };
  return colors[priority] || 'default';
}

function formatStatus(status: string) {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function openCreate() {
  editMode.value = false;
  selectedProject.value = null;
  showFormDialog.value = true;
}

function openEdit(item: any) {
  editMode.value = true;
  selectedProject.value = item;
  showFormDialog.value = true;
}

function confirmDelete(item: any) {
  selectedProject.value = item;
  showDeleteDialog.value = true;
}

function formatCurrency(value?: number) {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <UiParentCard title="Project List">
    <v-row class="mb-4 align-center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          variant="outlined"
          label="Search Projects..."
          hide-details
          density="compact"
          color="primary"
        >
          <template v-slot:prepend-inner>
            <SearchIcon size="18" class="text-medium-emphasis" />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn color="primary" @click="openCreate" prepend-icon="mdi-plus">
          Add Project
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table 
      :headers="headers" 
      :items="projects" 
      :search="search" 
      :loading="loading"
      class="border rounded-md elevation-0"
    >
      <!-- Project Name & Description -->
      <template v-slot:item.name="{ item }">
        <div class="d-flex flex-column">
          <span class="text-subtitle-1 font-weight-semibold">{{ item.name }}</span>
          <span class="text-caption text-medium-emphasis text-truncate" style="max-width: 200px">
            {{ formatCurrency(item.budget) }}
          </span>
        </div>
      </template>

      <!-- Status -->
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal" class="text-capitalize">
          {{ formatStatus(item.status) }}
        </v-chip>
      </template>

      <!-- Priority -->
      <template v-slot:item.priority="{ item }">
        <v-chip :color="getPriorityColor(item.priority)" size="x-small" variant="flat" class="text-capitalize">
          {{ item.priority }}
        </v-chip>
      </template>

      <!-- Deadline -->
      <template v-slot:item.endDate="{ item }">
        <span class="text-body-2">{{ item.endDate || '-' }}</span>
      </template>

      <!-- Progress -->
      <template v-slot:item.progress="{ item }">
        <div class="d-flex align-center" style="min-width: 120px">
          <v-progress-linear
            :model-value="item.progress"
            :color="item.progress === 100 ? 'success' : 'primary'"
            height="6"
            rounded
            class="mr-2"
          />
          <span class="text-caption font-weight-bold">{{ item.progress }}%</span>
        </div>
      </template>

      <!-- Actions -->
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-end gap-2">
          <v-btn icon size="small" variant="text" color="info" @click="router.push(`/crm/projects/${item.id}`)">
            <EyeIcon size="18" />
          </v-btn>
          <v-btn icon size="small" variant="text" color="primary" @click="openEdit(item)">
            <PencilIcon size="18" />
          </v-btn>
          <v-btn icon size="small" variant="text" color="error" @click="confirmDelete(item)">
            <TrashIcon size="18" />
          </v-btn>
        </div>
      </template>

      <!-- Empty State -->
      <template v-slot:no-data>
        <div class="pa-8 text-center">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-briefcase-variant-outline</v-icon>
          <h3 class="text-h6 text-medium-emphasis">No projects found</h3>
          <p class="text-body-2 text-disabled mb-4">Get started by creating your first project</p>
          <v-btn color="primary" variant="tonal" @click="openCreate">Add Project</v-btn>
        </div>
      </template>
    </v-data-table>
  </UiParentCard>

  <!-- Dialogs -->
  <ProjectFormDialog 
    v-model:show="showFormDialog"
    :edit-mode="editMode"
    :project-data="selectedProject"
    @saved="projectsStore.fetchProjects"
  />

  <DeleteProjectDialog
    v-model:show="showDeleteDialog"
    :project-data="selectedProject"
    @deleted="projectsStore.fetchProjects"
  />
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
