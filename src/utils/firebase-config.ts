// Firebase Configuration for Push Notifications
// This is a template - you'll need to replace with your actual Firebase config

export const firebaseConfig = {
  // Replace with your Firebase project configuration
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Push Notification Setup (requires Firebase SDK)
// Uncomment and configure when ready to implement push notifications

/*
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// VAPID key - generate this in Firebase Console > Project Settings > Cloud Messaging
const vapidKey = 'your-vapid-key';

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      const token = await getToken(messaging, { vapidKey });
      console.log('FCM Token:', token);
      
      // Send token to your server to save it for sending notifications
      await saveTokenToServer(token);
      
      return token;
    } else {
      console.log('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}

async function saveTokenToServer(token: string) {
  // Save the token to your backend server
  // This allows you to send targeted notifications
  console.log('Saving token to server:', token);
  
  // Example implementation:
  // await fetch('/api/save-fcm-token', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ token, userId: getCurrentUserId() })
  // });
}

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log('Message received in foreground:', payload);
  
  // Show notification manually when app is in foreground
  if (payload.notification) {
    new Notification(payload.notification.title || 'Agenda Bravo', {
      body: payload.notification.body,
      icon: '/icons/icon-192x192.png',
      tag: 'agenda-bravo-notification'
    });
  }
});

export { messaging };
*/