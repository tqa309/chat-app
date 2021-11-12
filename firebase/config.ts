import firebase from "firebase/compat/app";

import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4bPGM5rdVEfWDElJMnxNsxwn3r5SGPNU",
  authDomain: "chat-app-a6607.firebaseapp.com",
  databaseURL: "https://chat-app-a6607-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-app-a6607",
  storageBucket: "chat-app-a6607.appspot.com",
  messagingSenderId: "156507489304",
  appId: "1:156507489304:web:a7a7f64f0b2f314629af6d",
  measurementId: "G-C93CC5C9LB"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

auth.useEmulator("http://localhost:9099");
if (window.location.hostname === "localhost") {
    db.useEmulator("localhost", 8080);
    storage.useEmulator('localhost', 9199)
}

export { db, auth, storage };
export default firebase;
