<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const page = ref({ title: 'Settings' });
const breadcrumbs = ref([
  { title: 'Settings', disabled: true, href: '#' }
]);

const appName = ref('Clientra CRM');
const defaultLanguage = ref('id');
const timezone = ref('Asia/Jakarta');
const dateFormat = ref('DD/MM/YYYY');
const currency = ref('IDR');
const enableNotifications = ref(true);
const enableDarkMode = ref(false);

const languages = [
  { title: 'Bahasa Indonesia', value: 'id' },
  { title: 'English', value: 'en' },
];

const timezones = [
  { title: 'Asia/Jakarta (WIB)', value: 'Asia/Jakarta' },
  { title: 'Asia/Makassar (WITA)', value: 'Asia/Makassar' },
  { title: 'Asia/Jayapura (WIT)', value: 'Asia/Jayapura' },
];

const dateFormats = [
  { title: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { title: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { title: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
];

const currencies = [
  { title: 'IDR - Indonesian Rupiah', value: 'IDR' },
  { title: 'USD - US Dollar', value: 'USD' },
];

function handleSave() {
  // Placeholder — will connect to API later
  alert('Settings saved! (placeholder)');
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-row>
    <v-col cols="12" md="8">
      <UiParentCard title="General Settings">
        <v-form @submit.prevent="handleSave">
          <v-text-field
            v-model="appName"
            label="Application Name"
            variant="outlined"
            class="mb-4"
          />
          <v-select
            v-model="defaultLanguage"
            :items="languages"
            item-title="title"
            item-value="value"
            label="Default Language"
            variant="outlined"
            class="mb-4"
          />
          <v-select
            v-model="timezone"
            :items="timezones"
            item-title="title"
            item-value="value"
            label="Timezone"
            variant="outlined"
            class="mb-4"
          />
          <v-select
            v-model="dateFormat"
            :items="dateFormats"
            item-title="title"
            item-value="value"
            label="Date Format"
            variant="outlined"
            class="mb-4"
          />
          <v-select
            v-model="currency"
            :items="currencies"
            item-title="title"
            item-value="value"
            label="Currency"
            variant="outlined"
            class="mb-4"
          />

          <v-divider class="my-6" />

          <v-switch
            v-model="enableNotifications"
            label="Enable Email Notifications"
            color="primary"
            class="mb-2"
            hide-details
          />
          <v-switch
            v-model="enableDarkMode"
            label="Enable Dark Mode"
            color="primary"
            class="mb-4"
            hide-details
          />

          <v-divider class="my-6" />

          <v-btn color="primary" type="submit" size="large">
            <v-icon start>mdi-content-save</v-icon> Save Settings
          </v-btn>
        </v-form>
      </UiParentCard>
    </v-col>

    <v-col cols="12" md="4">
      <UiParentCard title="Account Info">
        <div class="text-center mb-4">
          <v-avatar size="80" color="primary">
            <v-icon size="40" color="white">mdi-account</v-icon>
          </v-avatar>
        </div>
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">Name</v-list-item-title>
            <v-list-item-subtitle class="font-weight-medium">Arie Yudha</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">Email</v-list-item-title>
            <v-list-item-subtitle class="font-weight-medium">arieyudha141098.ay@gmail.com</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">Role</v-list-item-title>
            <v-list-item-subtitle>
              <v-chip size="small" color="error" variant="tonal">Super Admin</v-chip>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
