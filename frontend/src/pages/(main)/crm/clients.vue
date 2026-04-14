<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useClientsStore } from '@/stores/clients';
import { useAuthStore } from '@/stores/auth';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ClientFormDialog from './components/ClientFormDialog.vue';
import DeleteClientDialog from './components/DeleteClientDialog.vue';
import { 
  PlusIcon, 
  SearchIcon, 
  PencilIcon, 
  TrashIcon, 
  RefreshIcon,
  UsersIcon
} from 'vue-tabler-icons';

const clientsStore = useClientsStore();
const authStore = useAuthStore();
const page = ref({ title: 'Clients' });
const breadcrumbs = ref([
  { title: 'CRM', disabled: false, href: '#' },
  { title: 'Clients', disabled: true, href: '#' }
]);

const search = ref('');
const dialog = ref(false);
const deleteDialog = ref(false);
const editMode = ref(false);
const selectedClient = ref<any>(null);

const isAdmin = computed(() => authStore.user?.role === 'super_admin');

const headers = computed(() => {
  const baseHeaders = [
    { title: 'Name', key: 'name', align: 'start', sortable: true },
    { title: 'Email', key: 'email', align: 'start', sortable: true },
    { title: 'Phone', key: 'phone', align: 'start', sortable: false },
    { title: 'Company', key: 'company', align: 'start', sortable: true },
  ];

  if (isAdmin.value) {
    baseHeaders.push({ title: 'Tenant', key: 'tenant.name', align: 'start', sortable: true });
  }

  baseHeaders.push({ title: 'Status', key: 'status', align: 'center', sortable: true });
  baseHeaders.push({ title: 'Actions', key: 'actions', align: 'end', sortable: false });

  return baseHeaders;
});

onMounted(() => {
  loadClients();
});

async function loadClients() {
  await clientsStore.fetchClients();
}

function openCreate() {
  editMode.value = false;
  selectedClient.value = null;
  dialog.value = true;
}

function openEdit(item: any) {
  editMode.value = true;
  selectedClient.value = item;
  dialog.value = true;
}

function confirmDelete(item: any) {
  selectedClient.value = item;
  deleteDialog.value = true;
}

function getStatusColor(status: string) {
  return status === 'active' ? 'success' : 'error';
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  
  <UiParentCard title="Client List">
    <template v-slot:action>
      <v-btn color="primary" @click="openCreate">
        <PlusIcon size="18" class="mr-1" /> Add Client
      </v-btn>
    </template>

    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          variant="outlined"
          label="Search Clients..."
          hide-details
          density="compact"
        >
          <template v-slot:prepend-inner>
            <SearchIcon size="18" class="text-secondary" />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn icon variant="text" color="secondary" @click="loadClients" :loading="clientsStore.loading">
          <RefreshIcon size="20" />
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="clientsStore.clients"
      :search="search"
      :loading="clientsStore.loading"
      class="elevation-0 border rounded"
    >
      <template v-slot:item.name="{ item }">
        <div class="d-flex align-center">
          <v-avatar color="lightprimary" size="35" class="mr-3">
            <span class="text-primary font-weight-bold">{{ item.name.charAt(0).toUpperCase() }}</span>
          </v-avatar>
          <span class="font-weight-medium">{{ item.name }}</span>
        </div>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal" class="text-capitalize">
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-end gap-2">
          <v-btn 
            icon 
            size="small" 
            variant="text" 
            color="primary" 
            v-tooltip="'Edit Client'"
            @click="openEdit(item)"
          >
            <PencilIcon size="18" />
          </v-btn>
          <v-btn 
            icon 
            size="small" 
            variant="text" 
            color="error" 
            v-tooltip="'Delete Client'"
            @click="confirmDelete(item)"
          >
            <TrashIcon size="18" />
          </v-btn>
        </div>
      </template>
      
      <template v-slot:no-data>
        <div class="text-center py-4">
          <UsersIcon size="40" class="text-medium-emphasis mb-2" />
          <p class="text-body-1 text-medium-emphasis">No clients found. Click "Add Client" to create one.</p>
        </div>
      </template>
    </v-data-table>
  </UiParentCard>

  <!-- Dialogs -->
  <ClientFormDialog
    v-model:show="dialog"
    :edit-mode="editMode"
    :client-data="selectedClient"
    @saved="loadClients"
  />

  <DeleteClientDialog
    v-model:show="deleteDialog"
    :client="selectedClient"
    @deleted="loadClients"
  />
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
