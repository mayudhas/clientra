<script setup lang="ts">
import { ref } from 'vue';
import api from '@/services/api';
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();
const email = ref('');
const loading = ref(false);
const sent = ref(false);

async function handleSubmit() {
  if (!email.value) return;
  
  loading.value = true;
  try {
    await api.post('/auth/forgot-password', { email: email.value });
    
    notificationStore.showSuccess('Reset link sent! Please check your email.');
    sent.value = true;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to send reset link';
    notificationStore.showError(message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div v-if="!sent">
    <v-row class="d-flex mb-3">
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Email Address</v-label>
        <v-text-field 
          v-model="email" 
          variant="outlined" 
          color="primary" 
          hide-details="auto"
          placeholder="Enter your email"
          type="email"
          @keyup.enter="handleSubmit"
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
      :disabled="!email"
    >
      Send Reset Link
    </v-btn>
    
    <div class="mt-5 text-center">
      <v-btn variant="text" to="/authentication/login" color="primary">Back to Login</v-btn>
    </div>
  </div>
  
  <div v-else class="text-center py-5">
    <v-icon color="success" size="64" class="mb-4">mdi-email-check</v-icon>
    <h3 class="text-h5 mb-2">Check Your Email</h3>
    <p class="text-medium-emphasis mb-6">
      We've sent a password reset link to <strong>{{ email }}</strong>. 
      Please check your inbox and follow the instructions.
    </p>
    <v-btn color="primary" variant="outlined" to="/authentication/login" block>
      Return to Login
    </v-btn>
  </div>
</template>
