import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure = async () => {
    await notifee.requestPermission();

    // Android 채널 생성
    await notifee.createChannel({
      id: 'eisenhower-matrix',
      name: 'Eisenhower Matrix Tasks',
      sound: 'default',
      importance: 4, // HIGH
    });
  }

  scheduleNotification = async (task: { id: string, title: string, notificationDate: Date }) => {
    const { id, title, notificationDate } = task;

    // 트리거 생성 (예약된 시간에 알림 발생)
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: notificationDate.getTime(),
    };

    // 알림 생성
    await notifee.createTriggerNotification(
      {
        id,
        title: 'Task Reminder',
        body: title,
        android: {
          channelId: 'eisenhower-matrix',
          importance: 4,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      },
      trigger,
    );
  }

  cancelNotification = async (id: string) => {
    await notifee.cancelNotification(id);
  }
}

export default new NotificationService();