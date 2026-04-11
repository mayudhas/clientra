import { defineStore } from 'pinia';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timeout?: number;
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as (Notification & { id: number })[]
  }),
  actions: {
    show(notification: Notification) {
      const id = Date.now();
      this.notifications.push({ ...notification, id });

      if (notification.timeout !== -1) {
        setTimeout(() => {
          this.remove(id);
        }, notification.timeout || 4000);
      }
    },
    showSuccess(message: string) {
      this.show({ message, type: 'success' });
    },
    showError(message: string) {
      this.show({ message, type: 'error' });
    },
    showInfo(message: string) {
      this.show({ message, type: 'info' });
    },
    showWarning(message: string) {
      this.show({ message, type: 'warning' });
    },
    remove(id: number) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    }
  }
});
