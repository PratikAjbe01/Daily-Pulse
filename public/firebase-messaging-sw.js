importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');


const firebaseConfig = {
  apiKey: "AIzaSyCkqN1RyAtx1v3w0coG38uvfxGsO3Z33fw",
  authDomain: "daily-pulse-ed591.firebaseapp.com",
  projectId: "daily-pulse-ed591",
  storageBucket: "daily-pulse-ed591.firebasestorage.app",
  messagingSenderId: "953859705100",
  appId: "1:953859705100:web:47b7bd01bc2df39b832129",
  measurementId: "G-B1SV30DBXN"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});