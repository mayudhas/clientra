<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import TenantService from '@/services/tenant.service';
import { EyeIcon, EyeOffIcon, SearchIcon } from 'vue-tabler-icons';

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
const tenants = ref<any[]>([]);
const loadingTenants = ref(false);

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
  tenantId: '',
  isActive: true
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
    if (authStore.user?.role === 'super_admin') {
      fetchTenants();
    }
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

async function fetchTenants() {
  loadingTenants.value = true;
  try {
    const response = await TenantService.getTenants({ limit: 100 });
    tenants.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch tenants:', error);
  } finally {
    loadingTenants.value = false;
  }
}

watch(dialog, (val) => {
  emit('update:modelValue', val);
});

async function save() {
  const { valid: isFormValid } = await formRef.value.validate();
  if (!isFormValid) return;

  loading.value = true;
  try {
    // Sanitize payload: only send fields defined in DTO
    const payload: any = {
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
      isActive: form.value.isActive,
      tenantId: form.value.tenantId
    };
    
    // If role is super_admin, tenant must be null
    if (payload.role === 'super_admin') {
      payload.tenantId = null;
    } else if (!payload.tenantId) {
      // Ensure empty strings don't cause UUID validation errors in Postgres
      payload.tenantId = null;
    }
    
    if (props.user) {
      // Update
      if (form.value.password) {
        payload.password = form.value.password;
      }
      await usersStore.updateUser(props.user.id, payload);
      notificationStore.showSuccess('User updated successfully');
    } else {
      // Create
      payload.password = form.value.password;
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
            <!-- Tenant selection only for Super Admin, and only if target role is not Super Admin -->
            <v-col v-if="authStore.user?.role === 'super_admin' && form.role !== 'super_admin'" cols="12">
               <v-label class="mb-2 font-weight-medium">Assign to Tenant</v-label>
               <v-autocomplete
                v-model="form.tenantId"
                :items="tenants"
                item-title="name"
                item-value="id"
                variant="outlined"
                color="primary"
                hide-details="auto"
                placeholder="Select a tenant (optional)"
                :loading="loadingTenants"
                clearable
              >
                <template v-slot:prepend-inner>
                  <SearchIcon size="18" class="text-secondary" />
                </template>
              </v-autocomplete>
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
