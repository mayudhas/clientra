<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useTenantsStore } from '@/stores/tenants';
import { useNotificationStore } from '@/stores/notification';
import { XIcon, CheckIcon } from 'vue-tabler-icons';

const props = defineProps({
  show: Boolean,
  editMode: Boolean,
  tenantData: Object,
});

const emit = defineEmits(['update:show', 'saved']);

const tenantsStore = useTenantsStore();
const notificationStore = useNotificationStore();
const loading = ref(false);
const formRef = ref<any>(null);

const formData = reactive({
  name: '',
});

const rules = {
  name: [
    (v: string) => !!v || 'Name is required',
    (v: string) => v.length >= 2 || 'Name must be at least 2 characters',
  ],
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.editMode && props.tenantData) {
      formData.name = props.tenantData.name;
    } else {
      formData.name = '';
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
    if (props.editMode && props.tenantData) {
      await tenantsStore.updateTenant(props.tenantData.id, { name: formData.name });
      notificationStore.showSuccess('Tenant updated successfully');
    } else {
      await tenantsStore.createTenant({ name: formData.name });
      notificationStore.showSuccess('Tenant created successfully');
    }
    emit('saved');
    close();
  } catch (error: any) {
    notificationStore.showError(error.message || 'Failed to save tenant');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="close" max-width="500px" persistent>
    <v-card>
      <v-card-title class="pa-4 bg-primary text-white d-flex align-center">
        <span class="text-h5">{{ editMode ? 'Edit Tenant' : 'New Tenant' }}</span>
        <v-spacer />
        <v-btn icon color="white" variant="text" @click="close">
          <XIcon size="20" />
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" @submit.prevent="save">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.name"
                label="Tenant Name"
                variant="outlined"
                color="primary"
                :rules="rules.name"
                placeholder="Enter company name"
                required
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
