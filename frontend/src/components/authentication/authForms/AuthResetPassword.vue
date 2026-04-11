<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useNotificationStore } from '@/stores/notification';
import { EyeIcon, EyeOffIcon } from 'vue-tabler-icons';

const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();

const token = ref((route.query.token as string) || '');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const showPassword = ref(false);

async function handleSubmit() {
  if (newPassword.value !== confirmPassword.value) {
    notificationStore.showError('Passwords do not match');
    return;
  }

  if (newPassword.value.length < 6) {
    notificationStore.showError('Password must be at least 6 characters');
    return;
  }

  loading.value = true;
  try {
    await api.post('/auth/reset-password', { 
      token: token.value, 
      newPassword: newPassword.value 
    });
    
    notificationStore.showSuccess('Password reset successful! Please login.');
    router.push('/authentication/login');
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to reset password';
    notificationStore.showError(message);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (!token.value) {
    notificationStore.showError('Invalid or missing reset token');
    router.push('/authentication/login');
  }
});
</script>

<template>
  <div>
    <v-row class="d-flex mb-3">
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">New Password</v-label>
        <v-text-field 
          v-model="newPassword" 
          variant="outlined" 
          color="primary" 
          hide-details="auto"
          placeholder="Min 6 characters"
          :type="showPassword ? 'text' : 'password'"
        >
          <template v-slot:append-inner>
            <v-btn icon variant="text" size="small" @click="showPassword = !showPassword" class="mt-n1 mr-n2">
              <component :is="showPassword ? EyeIcon : EyeOffIcon" size="20" />
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Confirm New Password</v-label>
        <v-text-field 
          v-model="confirmPassword" 
          variant="outlined" 
          color="primary" 
          hide-details="auto"
          placeholder="Repeat new password"
          :type="showPassword ? 'text' : 'password'"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn 
      color="secondary" 
      size="large" 
      block 
      flat 
      @click="handleSubmit" 
      :loading="loading"
      :disabled="!newPassword || newPassword !== confirmPassword"
    >
      Reset Password
    </v-btn>
  </div>
</template>
