<script setup lang="ts">
import { ref, watch } from 'vue';
import api from '@/services/api';
import { useNotificationStore } from '@/stores/notification';
import { EyeIcon, EyeOffIcon } from 'vue-tabler-icons';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const notificationStore = useNotificationStore();
const dialog = ref(false);
const loading = ref(false);
const showPasswords = ref(false);

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

watch(() => props.modelValue, (val) => {
  dialog.value = val;
});

watch(dialog, (val) => {
  emit('update:modelValue', val);
  if (!val) resetForm();
});

function resetForm() {
  form.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
}

async function handleSave() {
  if (form.value.newPassword !== form.value.confirmPassword) {
    notificationStore.showError('New passwords do not match');
    return;
  }

  if (form.value.newPassword.length < 6) {
    notificationStore.showError('New password must be at least 6 characters');
    return;
  }

  loading.value = true;
  try {
    await api.post('/users/change-password', {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    });
    
    notificationStore.showSuccess('Password updated successfully!');
    dialog.value = false;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to update password';
    notificationStore.showError(message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card rounded="lg">
      <v-card-title class="pa-6 pb-0">
        <span class="text-h5 font-weight-bold">Change Password</span>
      </v-card-title>
      
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium">Current Password</v-label>
            <v-text-field
              v-model="form.currentPassword"
              variant="outlined"
              color="primary"
              :type="showPasswords ? 'text' : 'password'"
              placeholder="Enter current password"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium">New Password</v-label>
            <v-text-field
              v-model="form.newPassword"
              variant="outlined"
              color="primary"
              :type="showPasswords ? 'text' : 'password'"
              placeholder="Min 6 characters"
              hide-details="auto"
            >
              <template v-slot:append-inner>
                <v-btn icon variant="text" size="small" @click="showPasswords = !showPasswords" class="mt-n1 mr-n2">
                   <component :is="showPasswords ? EyeIcon : EyeOffIcon" size="20" />
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-label class="mb-2 font-weight-medium">Confirm New Password</v-label>
            <v-text-field
              v-model="form.confirmPassword"
              variant="outlined"
              color="primary"
              :type="showPasswords ? 'text' : 'password'"
              placeholder="Repeat new password"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions class="pa-6 pt-4">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="dialog = false" :disabled="loading">Cancel</v-btn>
        <v-btn 
          color="secondary" 
          variant="flat" 
          class="px-6" 
          @click="handleSave" 
          :loading="loading"
          :disabled="!form.currentPassword || !form.newPassword || form.newPassword !== form.confirmPassword"
        >Update Password</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
