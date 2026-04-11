<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const page = ref({ title: 'Tenants' });
const breadcrumbs = ref([
  { title: 'Management', disabled: false, href: '#' },
  { title: 'Tenants', disabled: true, href: '#' }
]);

const search = ref('');

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Owner', key: 'owner' },
  { title: 'Members', key: 'members' },
  { title: 'Plan', key: 'plan' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false }
];

const items = ref([
  { name: 'Tenant Alpha', owner: 'Admin Alpha', members: 5, plan: 'Professional', createdAt: '2026-01-15' },
  { name: 'Tenant Beta', owner: 'Admin Beta', members: 3, plan: 'Starter', createdAt: '2026-02-20' },
  { name: 'Tenant Gamma', owner: 'Admin Gamma', members: 12, plan: 'Enterprise', createdAt: '2025-11-10' },
]);

function getPlanColor(plan: string) {
  const colors: Record<string, string> = {
    'Starter': 'info',
    'Professional': 'primary',
    'Enterprise': 'warning'
  };
  return colors[plan] || 'default';
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <UiParentCard title="Tenant List">
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Search Tenants..."
          hide-details
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn color="primary">
          <v-icon start>mdi-plus</v-icon> Add Tenant
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table :headers="headers" :items="items" :search="search" class="elevation-0">
      <template v-slot:item.plan="{ item }">
        <v-chip :color="getPlanColor(item.plan)" size="small" variant="tonal">
          {{ item.plan }}
        </v-chip>
      </template>
      <template v-slot:item.members="{ item }">
        <v-chip size="small" variant="text">
          <v-icon start size="small">mdi-account-group</v-icon>
          {{ item.members }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon size="small" variant="text" color="primary"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon size="small" variant="text" color="error"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
  </UiParentCard>
</template>
