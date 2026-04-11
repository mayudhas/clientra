<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification';
import { computed } from 'vue';
import { 
  CircleCheckIcon, 
  AlertCircleIcon, 
  InfoCircleIcon, 
  AlertTriangleIcon,
  XIcon
} from 'vue-tabler-icons';

const notificationStore = useNotificationStore();

const currentNotification = computed(() => {
  return notificationStore.notifications.length > 0 
    ? notificationStore.notifications[0] 
    : null;
});

const show = computed({
  get: () => !!currentNotification.value,
  set: (val) => {
    if (!val && currentNotification.value) {
      notificationStore.remove(currentNotification.value.id);
    }
  }
});

function getIcon(type: string) {
  switch (type) {
    case 'success': return CircleCheckIcon;
    case 'error': return AlertCircleIcon;
    case 'warning': return AlertTriangleIcon;
    case 'info':
    default: return InfoCircleIcon;
  }
}
</script>

<template>
  <v-snackbar
    v-model="show"
    v-if="currentNotification"
    :color="currentNotification.type"
    :timeout="currentNotification.timeout || 4000"
    location="bottom right"
    elevation="24"
    rounded="md"
    class="mb-4 mr-4"
  >
    <div class="d-flex align-center">
      <component :is="getIcon(currentNotification.type)" size="24" class="mr-2" />
      <span class="text-subtitle-1 font-weight-medium">{{ currentNotification.message }}</span>
    </div>

    <template v-slot:actions>
      <v-btn
        variant="text"
        icon
        @click="show = false"
      >
        <XIcon size="18" />
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
:deep(.v-snackbar__content) {
  padding: 12px 16px !important;
}
</style>
