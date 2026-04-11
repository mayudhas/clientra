<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import { EyeIcon, EyeOffIcon } from 'vue-tabler-icons';

const props = defineProps({
  modelValue: Boolean,
  user: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const usersStore = useUsersStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const dialog = ref(false);
const valid = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const formRef = ref<any>(null);

const roles = [
  { title: 'Super Admin', value: 'super_admin' },
  { title: 'Admin', value: 'admin' },
  { title: 'Member', value: 'member' }
];

// If not Super Admin, restricted roles
const availableRoles = authStore.user?.role === 'super_admin' 
  ? roles 
  : roles.filter(r => r.value === 'member');

const defaultForm = {
  name: '',
  email: '',
  password: '',
  role: 'member',
  tenantId: ''
};

const form = ref({ ...defaultForm });

const rules = {
  required: (v: any) => !!v || 'Required.',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
  min: (v: string) => (v && v.length >= 6) || 'Min 6 characters'
};

watch(() => props.modelValue, (val) => {
  dialog.value = val;
  if (val) {
    if (props.user) {
      form.value = { 
        ...props.user, 
        password: '' // Reset password field for editing
      };
    } else {
      form.value = { ...defaultForm };
    }
  }
});

watch(dialog, (val) => {
  emit('update:modelValue', val);
});

async function save() {
  const { valid: isFormValid } = await formRef.value.validate();
  if (!isFormValid) return;

  loading.value = true;
  try {
    const payload: any = { ...form.value };
    
    // Ensure empty strings don't cause UUID validation errors in Postgres
    if (!payload.tenantId) {
      payload.tenantId = null;
    }
    
    if (props.user) {
      // Update
      if (!payload.password) delete payload.password;
      await usersStore.updateUser(props.user.id, payload);
      notificationStore.showSuccess('User updated successfully');
    } else {
      // Create
      await usersStore.createUser(payload);
      notificationStore.showSuccess('User created successfully');
    }
    emit('saved');
    dialog.value = false;
  } catch (error: any) {
    notificationStore.showError(error.response?.data?.message || 'Failed to save user');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card rounded="lg">
      <v-card-title class="pa-6 pb-2">
        <span class="text-h5 font-weight-bold">{{ user ? 'Edit User' : 'Add New User' }}</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form v-model="valid" ref="formRef">
          <v-row>
            <v-col cols="12">
              <v-label class="mb-2 font-weight-medium">Full Name</v-label>
              <v-text-field
                v-model="form.name"
                variant="outlined"
                color="primary"
                :rules="[rules.required]"
                hide-details="auto"
                placeholder="Enter full name"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="mb-2 font-weight-medium">Email Address</v-label>
              <v-text-field
                v-model="form.email"
                variant="outlined"
                color="primary"
                :rules="[rules.required, rules.email]"
                hide-details="auto"
                placeholder="Enter email address"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="mb-2 font-weight-medium">Password</v-label>
              <v-text-field
                v-model="form.password"
                variant="outlined"
                color="primary"
                :type="showPassword ? 'text' : 'password'"
                :rules="user ? [] : [rules.required, rules.min]"
                :placeholder="user ? 'Leave blank to keep current' : 'Min 6 characters'"
                hide-details="auto"
              >
                <template v-slot:append-inner>
                   <v-btn icon variant="text" size="small" @click="showPassword = !showPassword" class="mt-n1 mr-n2">
                      <component :is="showPassword ? EyeIcon : EyeOffIcon" size="20" />
                   </v-btn>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-label class="mb-2 font-weight-medium">Assigned Role</v-label>
              <v-select
                v-model="form.role"
                :items="availableRoles"
                variant="outlined"
                color="primary"
                hide-details="auto"
              />
            </v-col>
            <!-- Tenant selection only for Super Admin -->
            <v-col v-if="authStore.user?.role === 'super_admin'" cols="12">
               <v-label class="mb-2 font-weight-medium">Tenant ID (Optional)</v-label>
               <v-text-field
                v-model="form.tenantId"
                variant="outlined"
                color="primary"
                hide-details="auto"
                placeholder="Super Admin only"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions class="pa-6 pt-4">
        <v-spacer />
        <v-btn color="grey-darken-1" variant="text" @click="dialog = false" :disabled="loading">Cancel</v-btn>
        <v-btn color="secondary" variant="flat" class="px-6" :loading="loading" @click="save">
          {{ user ? 'Update User' : 'Save User' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
