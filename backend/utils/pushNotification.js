import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
  }
}

export const sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    // In a real implementation, you would fetch the FCM token from the user's document
    // For now, this is a placeholder
    // const user = await User.findById(userId);
    // const fcmToken = user.fcmToken;
    
    // if (!fcmToken) {
    //   console.log('No FCM token found for user:', userId);
    //   return;
    // }

    const message = {
      notification: {
        title,
        body
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      // token: fcmToken
    };

    // await admin.messaging().send(message);
    console.log('Push notification sent:', title);
    return { success: true };
  } catch (error) {
    console.error('Push notification failed:', error);
    throw error;
  }
};

