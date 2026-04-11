<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const page = ref({ title: 'Users' });
const breadcrumbs = ref([
  { title: 'Management', disabled: false, href: '#' },
  { title: 'Users', disabled: true, href: '#' }
]);

const search = ref('');

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Tenant', key: 'tenant' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
];

const items = ref([
  { name: 'Arie Yudha', email: 'arieyudha141098.ay@gmail.com', role: 'Super Admin', tenant: '—', status: 'Active' },
  { name: 'Admin Alpha', email: 'admin@alpha.co.id', role: 'Admin', tenant: 'Tenant Alpha', status: 'Active' },
  { name: 'Staff One', email: 'staff1@alpha.co.id', role: 'Member', tenant: 'Tenant Alpha', status: 'Active' },
  { name: 'Admin Beta', email: 'admin@beta.io', role: 'Admin', tenant: 'Tenant Beta', status: 'Active' },
  { name: 'Staff Two', email: 'staff2@beta.io', role: 'Member', tenant: 'Tenant Beta', status: 'Inactive' },
]);

function getRoleColor(role: string) {
  const colors: Record<string, string> = {
    'Super Admin': 'error',
    'Admin': 'primary',
    'Member': 'info'
  };
  return colors[role] || 'default';
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <UiParentCard title="User List">
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Search Users..."
          hide-details
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn color="primary">
          <v-icon start>mdi-plus</v-icon> Add User
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table :headers="headers" :items="items" :search="search" class="elevation-0">
      <template v-slot:item.role="{ item }">
        <v-chip :color="getRoleColor(item.role)" size="small" variant="tonal">
          {{ item.role }}
        </v-chip>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status === 'Active' ? 'success' : 'error'" size="small" variant="tonal">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon size="small" variant="text" color="primary"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon size="small" variant="text" color="error"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
  </UiParentCard>
</template>
