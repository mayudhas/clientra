<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const page = ref({ title: 'Invoices' });
const breadcrumbs = ref([
  { title: 'CRM', disabled: false, href: '#' },
  { title: 'Invoices', disabled: true, href: '#' }
]);

const search = ref('');

const headers = [
  { title: 'Invoice No.', key: 'invoiceNo' },
  { title: 'Client', key: 'client' },
  { title: 'Amount', key: 'amount' },
  { title: 'Status', key: 'status' },
  { title: 'Due Date', key: 'dueDate' },
  { title: 'Actions', key: 'actions', sortable: false }
];

const items = ref([
  { invoiceNo: 'INV-2026-001', client: 'PT Maju Jaya', amount: 'Rp 15.000.000', status: 'Paid', dueDate: '2026-03-15' },
  { invoiceNo: 'INV-2026-002', client: 'CV Berkah Sentosa', amount: 'Rp 8.500.000', status: 'Pending', dueDate: '2026-04-20' },
  { invoiceNo: 'INV-2026-003', client: 'Global Tech Indonesia', amount: 'Rp 45.000.000', status: 'Pending', dueDate: '2026-05-01' },
  { invoiceNo: 'INV-2026-004', client: 'Toko Sejahtera', amount: 'Rp 3.200.000', status: 'Overdue', dueDate: '2026-03-01' },
  { invoiceNo: 'INV-2026-005', client: 'Nusantara Digital', amount: 'Rp 22.750.000', status: 'Paid', dueDate: '2026-02-28' },
]);

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'Paid': 'success',
    'Pending': 'warning',
    'Overdue': 'error',
    'Draft': 'default'
  };
  return colors[status] || 'default';
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <UiParentCard title="Invoice List">
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Search Invoices..."
          hide-details
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn color="primary">
          <v-icon start>mdi-plus</v-icon> Create Invoice
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table :headers="headers" :items="items" :search="search" class="elevation-0">
      <template v-slot:item.invoiceNo="{ item }">
        <span class="font-weight-bold">{{ item.invoiceNo }}</span>
      </template>
      <template v-slot:item.amount="{ item }">
        <span class="font-weight-medium">{{ item.amount }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon size="small" variant="text" color="primary"><v-icon>mdi-eye</v-icon></v-btn>
        <v-btn icon size="small" variant="text" color="primary"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon size="small" variant="text" color="error"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
  </UiParentCard>
</template>
