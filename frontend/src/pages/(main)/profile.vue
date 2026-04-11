<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ChangePasswordDialog from './management/components/ChangePasswordDialog.vue';
import api from '@/services/api';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const page = ref({ title: 'User Profile' });
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard/default' },
  { title: 'Profile', disabled: true, href: '#' }
]);

const loading = ref(false);
const saving = ref(false);
const showPasswordDialog = ref(false);
const userData = ref<any>(null);

const form = ref({
  name: '',
  email: ''
});

async function loadProfile() {
  loading.value = true;
  try {
    const response = await api.get('/users/profile');
    userData.value = response.data;
    form.value.name = response.data.name;
    form.value.email = response.data.email;
  } catch (error: any) {
    notificationStore.showError('Failed to load profile data');
  } finally {
    loading.value = false;
  }
}

async function handleUpdateProfile() {
  saving.value = true;
  try {
    await api.put('/users/profile', form.value);
    notificationStore.showSuccess('Profile updated successfully!');
    
    // Update local auth store too if needed
    if (authStore.user) {
      authStore.user.name = form.value.name;
      authStore.user.email = form.value.email;
    }
    
    await loadProfile();
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to update profile';
    notificationStore.showError(message);
  } finally {
    saving.value = false;
  }
}

onMounted(loadProfile);

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
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  
  <v-row v-if="userData">
    <v-col cols="12" md="4">
      <UiParentCard title="Overview">
        <div class="text-center pa-5">
          <v-avatar size="120" color="lightprimary" class="mb-4">
            <v-icon size="64" color="primary">mdi-account</v-icon>
          </v-avatar>
          <h2 class="text-h4 font-weight-bold mb-1">{{ userData.name }}</h2>
          <v-chip :color="getRoleColor(userData.role)" size="small" variant="tonal" class="mb-4 font-weight-bold">
            {{ formatRole(userData.role) }}
          </v-chip>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="text-medium-emphasis">Email</span>
            <span class="font-weight-medium">{{ userData.email }}</span>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <span class="text-medium-emphasis">Tenant</span>
            <span class="font-weight-medium">{{ userData.tenant?.name || 'Global' }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <span class="text-medium-emphasis">Status</span>
            <v-chip :color="userData.isActive ? 'success' : 'error'" size="x-small" density="comfortable" variant="flat">
              {{ userData.isActive ? 'Active' : 'Inactive' }}
            </v-chip>
          </div>
          
          <v-btn color="secondary" block variant="outlined" class="mt-6" @click="showPasswordDialog = true">
            <v-icon start>mdi-key-variant</v-icon> Change Password
          </v-btn>
        </div>
      </UiParentCard>
    </v-col>
    
    <v-col cols="12" md="8">
      <UiParentCard title="Edit Profile Details">
        <v-form @submit.prevent="handleUpdateProfile">
          <v-row>
            <v-col cols="12" sm="6">
              <v-label class="mb-2 font-weight-medium">Full Name</v-label>
              <v-text-field
                v-model="form.name"
                variant="outlined"
                color="primary"
                hide-details="auto"
                placeholder="Enter your full name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-label class="mb-2 font-weight-medium">Email Address</v-label>
              <v-text-field
                v-model="form.email"
                variant="outlined"
                color="primary"
                hide-details="auto"
                placeholder="Enter your email"
                type="email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-end mt-4">
              <v-btn color="primary" flat :loading="saving" type="submit" size="large">
                Save Changes
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </UiParentCard>
    </v-col>
  </v-row>
  
  <v-row v-else-if="loading">
     <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
     </v-col>
  </v-row>

  <ChangePasswordDialog v-model="showPasswordDialog" />
</template>
