import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface ScheduledReminder {
  id: number;
  title: string;
  body: string;
  at: Date;
}

class NativeNotificationService {
  async requestPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      if (!('Notification' in window)) return false;
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    const current = await LocalNotifications.checkPermissions();
    if (current.display === 'granted') return true;
    const requested = await LocalNotifications.requestPermissions();
    return requested.display === 'granted';
  }

  async schedule(reminder: ScheduledReminder): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Agendamentos do sistema exigem o app instalado no celular.');
    }

    const allowed = await this.requestPermission();
    if (!allowed) throw new Error('Permissão de notificações não concedida.');

    await LocalNotifications.schedule({
      notifications: [{
        id: reminder.id,
        title: reminder.title,
        body: reminder.body || 'Você tem um lembrete Mamãe Zen.',
        schedule: { at: reminder.at, allowWhileIdle: true },
        sound: 'default',
        smallIcon: 'ic_stat_mamae_zen',
        channelId: 'mamae-zen-reminders',
        extra: { source: 'mamae-zen-reminder' },
      }],
    });
  }

  async cancel(id: number): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    await LocalNotifications.cancel({ notifications: [{ id }] });
  }

  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }
}

export const nativeNotificationService = new NativeNotificationService();