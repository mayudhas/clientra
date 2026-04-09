<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const page = ref({ title: 'Projects' });
const breadcrumbs = ref([
  { title: 'CRM', disabled: false, href: '#' },
  { title: 'Projects', disabled: true, href: '#' }
]);

const search = ref('');

const headers = [
  { title: 'Project Name', key: 'name' },
  { title: 'Client', key: 'client' },
  { title: 'Status', key: 'status' },
  { title: 'Deadline', key: 'deadline' },
  { title: 'Progress', key: 'progress' },
  { title: 'Actions', key: 'actions', sortable: false }
];

const items = ref([
  { name: 'Website Redesign', client: 'PT Maju Jaya', status: 'In Progress', deadline: '2026-05-15', progress: 65 },
  { name: 'Mobile App Development', client: 'CV Berkah Sentosa', status: 'In Progress', deadline: '2026-06-30', progress: 30 },
  { name: 'ERP Implementation', client: 'Global Tech Indonesia', status: 'On Hold', deadline: '2026-08-01', progress: 15 },
  { name: 'Brand Identity Package', client: 'Nusantara Digital', status: 'Completed', deadline: '2026-03-20', progress: 100 },
  { name: 'SEO Optimization', client: 'Toko Sejahtera', status: 'In Progress', deadline: '2026-04-30', progress: 80 },
]);

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'In Progress': 'info',
    'Completed': 'success',
    'On Hold': 'warning',
    'Cancelled': 'error'
  };
  return colors[status] || 'default';
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <UiParentCard title="Project List">
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Search Projects..."
          hide-details
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn color="primary">
          <v-icon start>mdi-plus</v-icon> Add Project
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table :headers="headers" :items="items" :search="search" class="elevation-0">
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.progress="{ item }">
        <v-progress-linear
          :model-value="item.progress"
          :color="item.progress === 100 ? 'success' : 'primary'"
          height="8"
          rounded
        />
        <span class="text-caption text-medium-emphasis">{{ item.progress }}%</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon size="small" variant="text" color="primary"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon size="small" variant="text" color="error"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
  </UiParentCard>
</template>
