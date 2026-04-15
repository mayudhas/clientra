<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import { useNotificationStore } from '@/stores/notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import TaskFormDialog from '../components/TaskFormDialog.vue';
import DeleteTaskDialog from '../components/DeleteTaskDialog.vue';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CircleCheckIcon,
  CircleIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  CurrencyDollarIcon,
} from 'vue-tabler-icons';

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();
const notificationStore = useNotificationStore();

const projectId = computed(() => route.params.id as string);
const project = ref<any>(null);
const loadingProject = ref(true);

// Dialog states
const showTaskFormDialog = ref(false);
const showDeleteTaskDialog = ref(false);
const editTaskMode = ref(false);
const selectedTask = ref<any>(null);

const page = ref({ title: 'Project Detail' });
const breadcrumbs = ref([
  { title: 'CRM', disabled: false, href: '#' },
  { title: 'Projects', disabled: false, href: '/crm/projects' },
  { title: 'Detail', disabled: true, href: '#' },
]);

onMounted(async () => {
  await loadProject();
  await tasksStore.fetchTasks(projectId.value);
});

async function loadProject() {
  loadingProject.value = true;
  try {
    const response = await projectsStore.fetchProjectById(projectId.value);
    project.value = response;
  } catch (err: any) {
    notificationStore.showError('Failed to load project');
    router.push('/crm/projects');
  } finally {
    loadingProject.value = false;
  }
}

async function refreshAll() {
  await tasksStore.fetchTasks(projectId.value);
  await loadProject(); // Refresh project to get updated progress
}

// Task dialog handlers
function openAddTask() {
  editTaskMode.value = false;
  selectedTask.value = null;
  showTaskFormDialog.value = true;
}

function openEditTask(task: any) {
  editTaskMode.value = true;
  selectedTask.value = task;
  showTaskFormDialog.value = true;
}

function confirmDeleteTask(task: any) {
  selectedTask.value = task;
  showDeleteTaskDialog.value = true;
}

async function toggleTask(task: any) {
  try {
    await tasksStore.toggleTaskStatus(projectId.value, task);
    await loadProject(); // Refresh progress
    notificationStore.showSuccess(
      task.status === 'done' ? 'Task marked as todo' : 'Task completed!'
    );
  } catch (err: any) {
    notificationStore.showError('Failed to update task status');
  }
}

// Formatting helpers
function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    planning: 'secondary',
    in_progress: 'info',
    on_hold: 'warning',
    completed: 'success',
    cancelled: 'error',
  };
  return colors[status] || 'default';
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    low: 'success',
    medium: 'info',
    high: 'warning',
    urgent: 'error',
  };
  return colors[priority] || 'default';
}

function getTaskStatusColor(status: string) {
  const colors: Record<string, string> = {
    todo: 'secondary',
    in_progress: 'info',
    done: 'success',
  };
  return colors[status] || 'default';
}

function getTaskPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    low: 'success',
    medium: 'info',
    high: 'error',
  };
  return colors[priority] || 'default';
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatCurrency(value?: number) {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <!-- Loading Skeleton -->
  <v-skeleton-loader v-if="loadingProject" type="card, table" class="mb-4" />

  <template v-else-if="project">
    <!-- ─── Project Header Card ──────────────────────────── -->
    <v-card class="mb-6" variant="outlined" rounded="md">
      <v-card-text class="pa-6">
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center mb-2">
              <v-btn icon size="small" variant="text" @click="router.push('/crm/projects')" class="mr-2">
                <ArrowLeftIcon size="20" />
              </v-btn>
              <h2 class="text-h5 font-weight-bold">{{ project.name }}</h2>
              <v-chip
                :color="getStatusColor(project.status)"
                size="small"
                variant="tonal"
                class="ml-3 text-capitalize"
              >
                {{ formatStatus(project.status) }}
              </v-chip>
              <v-chip
                :color="getPriorityColor(project.priority)"
                size="x-small"
                variant="flat"
                class="ml-2 text-capitalize"
              >
                {{ project.priority }}
              </v-chip>
            </div>
            <p v-if="project.description" class="text-body-2 text-medium-emphasis ml-10">
              {{ project.description }}
            </p>
          </v-col>
          <v-col cols="12" md="4">
            <div class="d-flex flex-column align-md-end gap-1">
              <div class="text-caption text-medium-emphasis">Progress</div>
              <div class="d-flex align-center" style="width: 200px">
                <v-progress-linear
                  :model-value="project.progress"
                  :color="project.progress === 100 ? 'success' : 'primary'"
                  height="10"
                  rounded
                  class="mr-2"
                />
                <span class="text-subtitle-2 font-weight-bold">{{ project.progress }}%</span>
              </div>
              <div class="text-caption text-medium-emphasis mt-1">
                {{ tasksStore.completedCount }} / {{ tasksStore.totalTasks }} tasks completed
              </div>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <!-- Info Grid -->
        <v-row>
          <v-col cols="6" md="3">
            <div class="d-flex align-center gap-2">
              <UserIcon size="18" class="text-medium-emphasis" />
              <div>
                <div class="text-caption text-medium-emphasis">Client</div>
                <div class="text-body-2 font-weight-medium">{{ project.client?.name || '-' }}</div>
              </div>
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex align-center gap-2">
              <CurrencyDollarIcon size="18" class="text-medium-emphasis" />
              <div>
                <div class="text-caption text-medium-emphasis">Budget</div>
                <div class="text-body-2 font-weight-medium">{{ formatCurrency(project.budget) }}</div>
              </div>
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex align-center gap-2">
              <CalendarIcon size="18" class="text-medium-emphasis" />
              <div>
                <div class="text-caption text-medium-emphasis">Start Date</div>
                <div class="text-body-2 font-weight-medium">{{ formatDate(project.startDate) }}</div>
              </div>
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex align-center gap-2">
              <ClockIcon size="18" class="text-medium-emphasis" />
              <div>
                <div class="text-caption text-medium-emphasis">Deadline</div>
                <div class="text-body-2 font-weight-medium">{{ formatDate(project.endDate) }}</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ─── Tasks Section ────────────────────────────────── -->
    <UiParentCard title="Tasks">
      <template v-slot:action>
        <v-btn color="primary" size="small" @click="openAddTask" prepend-icon="mdi-plus">
          Add Task
        </v-btn>
      </template>

      <v-data-table
        :headers="[
          { title: '', key: 'check', sortable: false, width: '50px' },
          { title: 'Task', key: 'title' },
          { title: 'Status', key: 'status' },
          { title: 'Priority', key: 'priority' },
          { title: 'Due Date', key: 'dueDate' },
          { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
        ]"
        :items="tasksStore.tasks"
        :loading="tasksStore.loading"
        class="border rounded-md elevation-0"
        items-per-page="-1"
        hide-default-footer
      >
        <!-- Checkbox Toggle -->
        <template v-slot:item.check="{ item }">
          <v-btn
            icon
            size="x-small"
            variant="text"
            :color="item.status === 'done' ? 'success' : 'grey'"
            @click="toggleTask(item)"
          >
            <CircleCheckIcon v-if="item.status === 'done'" size="22" />
            <CircleIcon v-else size="22" />
          </v-btn>
        </template>

        <!-- Task Title -->
        <template v-slot:item.title="{ item }">
          <div class="d-flex flex-column">
            <span
              class="text-subtitle-2 font-weight-medium"
              :class="{ 'text-decoration-line-through text-medium-emphasis': item.status === 'done' }"
            >
              {{ item.title }}
            </span>
            <span
              v-if="item.description"
              class="text-caption text-medium-emphasis text-truncate"
              style="max-width: 300px"
            >
              {{ item.description }}
            </span>
          </div>
        </template>

        <!-- Status -->
        <template v-slot:item.status="{ item }">
          <v-chip :color="getTaskStatusColor(item.status)" size="small" variant="tonal" class="text-capitalize">
            {{ formatStatus(item.status) }}
          </v-chip>
        </template>

        <!-- Priority -->
        <template v-slot:item.priority="{ item }">
          <v-chip :color="getTaskPriorityColor(item.priority)" size="x-small" variant="flat" class="text-capitalize">
            {{ item.priority }}
          </v-chip>
        </template>

        <!-- Due Date -->
        <template v-slot:item.dueDate="{ item }">
          <span class="text-body-2">{{ formatDate(item.dueDate) }}</span>
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end gap-1">
            <v-btn icon size="x-small" variant="text" color="primary" @click="openEditTask(item)">
              <PencilIcon size="16" />
            </v-btn>
            <v-btn icon size="x-small" variant="text" color="error" @click="confirmDeleteTask(item)">
              <TrashIcon size="16" />
            </v-btn>
          </div>
        </template>

        <!-- Empty State -->
        <template v-slot:no-data>
          <div class="pa-8 text-center">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-checkbox-marked-circle-outline</v-icon>
            <h3 class="text-h6 text-medium-emphasis">No tasks yet</h3>
            <p class="text-body-2 text-disabled mb-4">Add tasks to break down your project into actionable items</p>
            <v-btn color="primary" variant="tonal" @click="openAddTask">Add Task</v-btn>
          </div>
        </template>
      </v-data-table>
    </UiParentCard>
  </template>

  <!-- ─── Dialogs ─────────────────────────────────────── -->
  <TaskFormDialog
    v-model:show="showTaskFormDialog"
    :edit-mode="editTaskMode"
    :task-data="selectedTask"
    :project-id="projectId"
    @saved="refreshAll"
  />

  <DeleteTaskDialog
    v-model:show="showDeleteTaskDialog"
    :task-data="selectedTask"
    :project-id="projectId"
    @deleted="refreshAll"
  />
</template>

<style scoped>
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
</style>
