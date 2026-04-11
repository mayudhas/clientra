<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const page = ref({ title: 'Clients' });
const breadcrumbs = ref([
  { title: 'CRM', disabled: false, href: '#' },
  { title: 'Clients', disabled: true, href: '#' }
]);

const search = ref('');

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Company', key: 'company' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
];

const items = ref([
  { name: 'Budi Santoso', email: 'budi@majujaya.com', phone: '+62 812 3456 7890', company: 'PT Maju Jaya', status: 'Active' },
  { name: 'Siti Rahma', email: 'siti@berkah.co.id', phone: '+62 821 9876 5432', company: 'CV Berkah Sentosa', status: 'Active' },
  { name: 'Ahmad Fauzi', email: 'ahmad@sejahtera.id', phone: '+62 856 1234 5678', company: 'Toko Sejahtera', status: 'Inactive' },
  { name: 'Dewi Kartika', email: 'dewi@globaltech.io', phone: '+62 813 5678 1234', company: 'Global Tech Indonesia', status: 'Active' },
  { name: 'Rizky Pratama', email: 'rizky@nusantaradigital.com', phone: '+62 878 4321 8765', company: 'Nusantara Digital', status: 'Active' },
]);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <UiParentCard title="Client List">
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Search Clients..."
          hide-details
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn color="primary">
          <v-icon start>mdi-plus</v-icon> Add Client
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table :headers="headers" :items="items" :search="search" class="elevation-0">
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
