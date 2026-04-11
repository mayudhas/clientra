<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTenantsStore } from '@/stores/tenants';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import TenantFormDialog from './components/TenantFormDialog.vue';
import DeleteTenantDialog from './components/DeleteTenantDialog.vue';
import { 
  PlusIcon, 
  SearchIcon, 
  PencilIcon, 
  TrashIcon, 
  UsersIcon, 
  UsersGroupIcon,
  RefreshIcon
} from 'vue-tabler-icons';

const tenantsStore = useTenantsStore();
const page = ref({ title: 'Tenant Management' });
const breadcrumbs = ref([
  { title: 'Management', disabled: false, href: '#' },
  { title: 'Tenants', disabled: true, href: '#' }
]);

const search = ref('');
const dialog = ref(false);
const deleteDialog = ref(false);
const editMode = ref(false);
const selectedTenant = ref<any>(null);

const headers = [
  { title: 'Tenant Name', key: 'name', align: 'start', sortable: true },
  { title: 'Users', key: 'userCount', align: 'center', sortable: false },
  { title: 'Clients', key: 'clientCount', align: 'center', sortable: false },
  { title: 'Created At', key: 'createdAt', align: 'start', sortable: true },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false }
];

const pagination = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [] as any[]
});

onMounted(() => {
  loadTenants();
});

async function loadTenants() {
  await tenantsStore.fetchTenants({
    page: pagination.value.page,
    limit: pagination.value.itemsPerPage,
    search: search.value
  });
}

function handleSearch() {
  pagination.value.page = 1;
  loadTenants();
}

function openCreate() {
  editMode.value = false;
  selectedTenant.value = null;
  dialog.value = true;
}

function openEdit(item: any) {
  editMode.value = true;
  selectedTenant.value = item;
  dialog.value = true;
}

function confirmDelete(item: any) {
  selectedTenant.value = item;
  deleteDialog.value = true;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  
  <UiParentCard title="Tenant List">
    <template v-slot:action>
      <v-btn color="primary" @click="openCreate">
        <PlusIcon size="18" class="mr-1" /> Add Tenant
      </v-btn>
    </template>

    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          variant="outlined"
          label="Search Tenants..."
          hide-details
          density="compact"
          @keyup.enter="handleSearch"
        >
          <template v-slot:prepend-inner>
            <SearchIcon size="18" class="text-secondary" />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn icon variant="text" color="secondary" @click="loadTenants" :loading="tenantsStore.loading">
          <RefreshIcon size="20" />
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table-server
      v-model:items-per-page="pagination.itemsPerPage"
      v-model:page="pagination.page"
      :headers="headers"
      :items="tenantsStore.tenants"
      :items-length="tenantsStore.total"
      :loading="tenantsStore.loading"
      class="elevation-0 border rounded"
      @update:options="loadTenants"
    >
      <template v-slot:item.name="{ item }">
        <div class="d-flex align-center">
          <v-avatar color="lightprimary" size="35" class="mr-3">
            <span class="text-primary font-weight-bold">{{ item.name.charAt(0).toUpperCase() }}</span>
          </v-avatar>
          <span class="font-weight-medium">{{ item.name }}</span>
        </div>
      </template>

      <template v-slot:item.userCount="{ item }">
        <v-chip size="small" variant="tonal" color="info">
          <UsersIcon size="14" class="mr-1" />
          {{ item.userCount || 0 }}
        </v-chip>
      </template>

      <template v-slot:item.clientCount="{ item }">
        <v-chip size="small" variant="tonal" color="secondary">
          <UsersGroupIcon size="14" class="mr-1" />
          {{ item.clientCount || 0 }}
        </v-chip>
      </template>

      <template v-slot:item.createdAt="{ item }">
        <span class="text-subtitle-2 text-medium-emphasis">{{ formatDate(item.createdAt) }}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-end gap-2">
          <v-btn 
            icon 
            size="small" 
            variant="text" 
            color="primary" 
            v-tooltip="'Edit Tenant'"
            @click="openEdit(item)"
          >
            <PencilIcon size="18" />
          </v-btn>
          <v-btn 
            icon 
            size="small" 
            variant="text" 
            color="error" 
            v-tooltip="'Delete Tenant'"
            @click="confirmDelete(item)"
          >
            <TrashIcon size="18" />
          </v-btn>
        </div>
      </template>
    </v-data-table-server>
  </UiParentCard>

  <!-- Dialogs -->
  <TenantFormDialog
    v-model:show="dialog"
    :edit-mode="editMode"
    :tenant-data="selectedTenant"
    @saved="loadTenants"
  />

  <DeleteTenantDialog
    v-model:show="deleteDialog"
    :tenant="selectedTenant"
    @deleted="loadTenants"
  />
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
