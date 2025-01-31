import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { api } from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('chat-messages', {
      name: 'Chat Messages',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    await Notifications.setNotificationChannelAsync('bid-updates', {
      name: 'Bid Updates',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PROJECT_ID, // Add this to your .env file
    })).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export async function updateDeviceToken() {
  try {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      await api.post('/user/device-token', {
        token,
        platform: Platform.OS,
      });
    }
  } catch (error) {
    console.error('Error updating device token:', error);
  }
}

export function setupNotificationListeners(navigation) {
  // Handle notification when app is in foreground
  const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
    // You can handle foreground notifications differently if needed
    console.log('Received notification in foreground:', notification);
  });

  // Handle notification when user taps on it
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    
    if (data.click_action === 'CHAT_NOTIFICATION') {
      navigation.navigate('(app)', {
        screen: 'chat',
        params: {
          id: data.chatId,
        },
      });
    } else if (data.click_action === 'BID_NOTIFICATION') {
      navigation.navigate('(app)', {
        screen: 'offer',
      });
    }
  });

  // Return cleanup function
  return () => {
    foregroundSubscription.remove();
    responseSubscription.remove();
  };
}

// Function to handle background notifications
export function handleBackgroundNotification(notification) {
  // This function will be called when a notification is received in the background
  return Promise.resolve();
} 