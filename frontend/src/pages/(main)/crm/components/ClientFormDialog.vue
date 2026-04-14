<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { useClientsStore } from '@/stores/clients';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import TenantService, { type Tenant } from '@/services/tenant.service';
import { XIcon, CheckIcon, BuildingSkyscraperIcon } from 'vue-tabler-icons';

const props = defineProps({
  show: Boolean,
  editMode: Boolean,
  clientData: Object,
});

const emit = defineEmits(['update:show', 'saved']);

const clientsStore = useClientsStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const loading = ref(false);
const formRef = ref<any>(null);
const tenants = ref<Tenant[]>([]);

const isAdmin = computed(() => authStore.user?.role === 'super_admin');

const formData = reactive({
  name: '',
  email: '',
  company: '',
  phone: '',
  address: '',
  notes: '',
  status: 'active',
  tenantId: null as string | null,
});

const rules = {
  name: [
    (v: string) => !!v || 'Name is required',
    (v: string) => v.length >= 2 || 'Name must be at least 2 characters',
  ],
  email: [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
  ],
  tenant: [
    (v: any) => !isAdmin.value || !!v || 'Tenant is required for Super Admin',
  ],
};

const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
];

async function loadTenants() {
  if (!isAdmin.value) return;
  try {
    const response = await TenantService.getTenants({ limit: 100 });
    tenants.value = response.data.data;
  } catch (err) {
    console.error('Failed to load tenants', err);
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (isAdmin.value && tenants.value.length === 0) {
      loadTenants();
    }
    
    if (props.editMode && props.clientData) {
      formData.name = props.clientData.name || '';
      formData.email = props.clientData.email || '';
      formData.company = props.clientData.company || '';
      formData.phone = props.clientData.phone || '';
      formData.address = props.clientData.address || '';
      formData.notes = props.clientData.notes || '';
      formData.status = props.clientData.status || 'active';
      formData.tenantId = props.clientData.tenantId || null;
    } else {
      formData.name = '';
      formData.email = '';
      formData.company = '';
      formData.phone = '';
      formData.address = '';
      formData.notes = '';
      formData.status = 'active';
      formData.tenantId = null;
    }
    if (formRef.value) formRef.value.resetValidation();
  }
});

function close() {
  emit('update:show', false);
}

async function save() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const payload = { ...formData };
    if (!isAdmin.value) delete payload.tenantId;

    if (props.editMode && props.clientData) {
      await clientsStore.updateClient(props.clientData.id, payload);
      notificationStore.showSuccess('Client updated successfully');
    } else {
      await clientsStore.createClient(payload);
      notificationStore.showSuccess('Client created successfully');
    }
    emit('saved');
    close();
  } catch (error: any) {
    notificationStore.showError(error.message || 'Failed to save client');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="close" max-width="600px" persistent>
    <v-card>
      <v-card-title class="pa-4 bg-primary text-white d-flex align-center">
        <span class="text-h5">{{ editMode ? 'Edit Client' : 'New Client' }}</span>
        <v-spacer />
        <v-btn icon color="white" variant="text" @click="close">
          <XIcon size="20" />
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" @submit.prevent="save">
          <v-row>
            <!-- Tenant Selection for Super Admin -->
            <v-col cols="12" v-if="isAdmin">
              <v-autocomplete
                v-model="formData.tenantId"
                :items="tenants"
                item-title="name"
                item-value="id"
                label="Assign to Tenant*"
                variant="outlined"
                color="primary"
                :rules="rules.tenant"
                required
                prepend-inner-icon=""
              >
                <template v-slot:prepend-inner>
                   <BuildingSkyscraperIcon size="20" class="text-secondary" />
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.name"
                label="Full Name*"
                variant="outlined"
                color="primary"
                :rules="rules.name"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.email"
                label="Email Address*"
                variant="outlined"
                color="primary"
                :rules="rules.email"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.company"
                label="Company"
                variant="outlined"
                color="primary"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.phone"
                label="Phone Number"
                variant="outlined"
                color="primary"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="formData.address"
                label="Address"
                variant="outlined"
                color="primary"
                rows="2"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.status"
                :items="statusOptions"
                label="Status"
                variant="outlined"
                color="primary"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="formData.notes"
                label="Internal Notes"
                variant="outlined"
                color="primary"
                rows="2"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="error" variant="text" @click="close" :disabled="loading">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="save"
          :loading="loading"
        >
          <CheckIcon size="18" class="mr-1" />
          {{ editMode ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
