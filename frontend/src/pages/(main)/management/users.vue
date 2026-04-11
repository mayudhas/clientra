<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import UserFormDialog from './components/UserFormDialog.vue';

// Import Tabler Icons
import { 
  PlusIcon, 
  PencilIcon, 
  UserCheckIcon, 
  UserOffIcon,
  SearchIcon
} from 'vue-tabler-icons';

const usersStore = useUsersStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const page = ref({ title: 'Users Management' });
const breadcrumbs = ref([
  { title: 'Management', disabled: false, href: '#' },
  { title: 'Users', disabled: true, href: '#' }
]);

const search = ref('');
const showDialog = ref(false);
const showConfirmDialog = ref(false);
const confirmLoading = ref(false);
const selectedUser = ref<any>(null);
const editingUser = ref<any>(null);
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [] as any[]
});

const headers = [
  { title: 'Name', key: 'name', align: 'start' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Tenant', key: 'tenant.name', value: (item: any) => item.tenant?.name || '—' },
  { title: 'Status', key: 'isActive' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
];

// Computed list to handle data properly
const userList = computed(() => usersStore.users);

async function loadData() {
  await usersStore.fetchUsers({
    page: options.value.page,
    limit: options.value.itemsPerPage,
    search: search.value
  });
}

onMounted(loadData);

// Watch for search and options changes
watch([search, options], loadData, { deep: true });

function openAddDialog() {
  editingUser.value = null;
  showDialog.value = true;
}

function openEditDialog(item: any) {
  editingUser.value = { ...item };
  showDialog.value = true;
}

function triggerToggleStatus(item: any) {
  selectedUser.value = item;
  showConfirmDialog.value = true;
}

async function confirmToggleStatus() {
  if (!selectedUser.value) return;
  
  confirmLoading.value = true;
  try {
    const newStatus = !selectedUser.value.isActive;
    await usersStore.updateUser(selectedUser.value.id, { isActive: newStatus });
    notificationStore.showSuccess(`User has been ${newStatus ? 'activated' : 'deactivated'} successfully`);
    showConfirmDialog.value = false;
    loadData();
  } catch (error: any) {
    notificationStore.showError(error.response?.data?.message || 'Failed to update user status');
  } finally {
    confirmLoading.value = false;
  }
}

function getRoleColor(role: string) {
  const colors: Record<string, string> = {
    'super_admin': 'error',
    'admin': 'primary',
    'member': 'info'
  };
  return colors[role] || 'grey';
}

function formatRole(role: string) {
  return role ? role.replace('_', ' ').toUpperCase() : '—';
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs">
    <template v-slot:right-content>
       <v-chip color="success" size="small" variant="tonal" class="font-weight-bold">
          DEBUG: V.1.0-READY
       </v-chip>
    </template>
  </BaseBreadcrumb>
  
  <v-row>
    <v-col cols="12">
      <UiParentCard title="User List">
        <template v-slot:action>
          <v-btn color="primary" @click="openAddDialog" flat>
            <PlusIcon size="20" class="mr-2" /> Add User
          </v-btn>
        </template>

        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              variant="outlined"
              label="Search Users..."
              hide-details
              density="compact"
              clearable
            >
              <template v-slot:prepend-inner>
                <SearchIcon size="18" />
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-data-table-server
          v-model:options="options"
          :headers="headers"
          :items="userList"
          :items-length="usersStore.total"
          :loading="usersStore.loading"
          @update:options="loadData"
          class="elevation-0 border"
        >
          <!-- Role Column -->
          <template v-slot:item.role="{ item }">
            <v-chip :color="getRoleColor(item.role)" size="small" variant="tonal" class="font-weight-bold">
              {{ formatRole(item.role) }}
            </v-chip>
          </template>

          <!-- Status Column -->
          <template v-slot:item.isActive="{ item }">
            <v-chip :color="item.isActive ? 'success' : 'error'" size="small" variant="flat">
              {{ item.isActive ? 'Active' : 'Inactive' }}
            </v-chip>
          </template>

          <!-- Actions Column -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-end pr-2">
              <v-btn icon size="small" variant="text" color="primary" @click="openEditDialog(item)" class="mr-1">
                <PencilIcon size="18" />
                <v-tooltip activator="parent" location="top">Edit User</v-tooltip>
              </v-btn>
              
              <v-btn 
                v-if="item.id !== authStore.user?.id"
                icon 
                size="small" 
                variant="text" 
                :color="item.isActive ? 'error' : 'success'"
                @click="triggerToggleStatus(item)"
              >
                <component :is="item.isActive ? UserOffIcon : UserCheckIcon" size="18" />
                <v-tooltip activator="parent" location="top">
                  {{ item.isActive ? 'Deactivate' : 'Activate' }}
                </v-tooltip>
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
      </UiParentCard>
    </v-col>
  </v-row>

  <!-- Add/Edit Dialog -->
  <UserFormDialog 
    v-model="showDialog" 
    :user="editingUser" 
    @saved="loadData" 
  />

  <!-- Confirm Status Toggle Dialog -->
  <v-dialog v-model="showConfirmDialog" max-width="400">
    <v-card rounded="lg">
      <v-card-title class="pa-6 pb-2">
        <span class="text-h5 font-weight-bold">Confirm Action</span>
      </v-card-title>
      <v-card-text class="pa-6 pt-0">
        <p class="text-body-1" v-if="selectedUser">
          Are you sure you want to <strong>{{ selectedUser.isActive ? 'deactivate' : 'activate' }}</strong> user 
          <span class="text-primary font-weight-medium">{{ selectedUser.name }}</span>?
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-6 pt-4">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="showConfirmDialog = false" :disabled="confirmLoading">Cancel</v-btn>
        <v-btn 
          :color="selectedUser?.isActive ? 'error' : 'success'" 
          variant="flat" 
          class="px-6"
          @click="confirmToggleStatus" 
          :loading="confirmLoading"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
