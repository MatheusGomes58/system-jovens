import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig1 = {
  apiKey: "AIzaSyD71aajbuopH-VZ9gmo5poOFyp1Dhevw2s",
  authDomain: "agendaiasd-ccb49.firebaseapp.com",
  projectId: "agendaiasd-ccb49",
  storageBucket: "agendaiasd-ccb49.appspot.com",
  messagingSenderId: "372111701662",
  appId: "1:372111701662:web:8a5da0b08c1140779d6d8f",
  measurementId: "G-8YG9YKHNZ7"
};

const firebaseConfig = {
  apiKey: "AIzaSyD0n1cFOafQClkJvs7YAAHCBLpaBE7qapc",
  authDomain: "jovenssantamonica-e9381.firebaseapp.com",
  projectId: "jovenssantamonica-e9381",
  storageBucket: "jovenssantamonica-e9381.appspot.com",
  messagingSenderId: "826705566796",
  appId: "1:826705566796:web:bc3e3907c7d13e34ef28e9",
  measurementId: "G-V4LN2Q4XYV"
};

const app = firebase.initializeApp(firebaseConfig, 'app');
const db = app.firestore();
const storage = app.storage();
const auth = firebase.initializeApp(firebaseConfig).auth();

const app2 = firebase.initializeApp(firebaseConfig1, 'app1');
const db2 = app2.firestore();

export { db, db2, storage, app, auth };
