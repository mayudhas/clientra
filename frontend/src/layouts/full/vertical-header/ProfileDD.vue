<script setup lang="ts">
import { ref } from 'vue';
import { SettingsIcon, LogoutIcon, UserIcon, SearchIcon, AlertTriangleIcon } from 'vue-tabler-icons';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const swt1 = ref(true);
const swt2 = ref(false);
const showLogoutConfirm = ref(false);
const logoutLoading = ref(false);

const userName = authStore.user?.name || 'User';
const userRole = authStore.user?.role?.replace('_', ' ').toUpperCase() || 'Member';

async function handleLogout() {
  logoutLoading.value = true;
  await authStore.logout();
  logoutLoading.value = false;
  showLogoutConfirm.value = false;
}
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- profile DD -->
  <!-- ---------------------------------------------- -->
  <div class="pt-4">
    <div class="px-4 text-center pb-4">
      <v-avatar size="80" color="lightprimary" class="mb-3">
        <img v-if="authStore.user?.avatar" :src="authStore.user?.avatar" alt="user" />
        <span v-else class="text-h4 text-primary font-weight-bold">{{ userName.charAt(0) }}</span>
      </v-avatar>
      <h4 class="mb-1">{{ userName }}</h4>
      <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold px-3">
        {{ userRole }}
      </v-chip>
    </div>

    <v-divider class="mx-4" />
    <perfect-scrollbar style="height: calc(100vh - 400px); max-height: 400px">
      <div class="px-4 pb-4">
        <v-list class="mt-3 py-0">
          <v-list-item 
            color="secondary" 
            rounded="md" 
            to="/profile"
            active-color="primary"
          >
            <template v-slot:prepend>
              <UserIcon size="20" class="mr-2" />
            </template>
            <v-list-item-title class="text-body-small"> Account Settings</v-list-item-title>
          </v-list-item>

          <v-list-item 
            color="error" 
            rounded="md" 
            @click="showLogoutConfirm = true"
            class="mt-2 text-error"
          >
            <template v-slot:prepend>
              <LogoutIcon size="20" class="mr-2" />
            </template>
            <v-list-item-title class="text-body-small font-weight-bold"> Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </perfect-scrollbar>

    <!-- Logout Confirmation Dialog -->
    <v-dialog v-model="showLogoutConfirm" max-width="400">
      <v-card rounded="lg">
        <v-card-text class="pa-6 text-center">
          <v-avatar color="lighterror" size="70" class="mb-4">
            <AlertTriangleIcon size="40" class="text-error" />
          </v-avatar>
          <h3 class="text-h4 mb-2">Logout Confirmation</h3>
          <p class="text-body-1 text-medium-emphasis">
            Are you sure you want to log out of your account?
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showLogoutConfirm = false"
            :disabled="logoutLoading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            class="px-6"
            @click="handleLogout"
            :loading="logoutLoading"
          >
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
