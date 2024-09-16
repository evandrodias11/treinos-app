import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDvm622azP1rA3U0fhyi9_G4cncmQGcD4U",
  authDomain: "treinos-app-17791.firebaseapp.com",
  projectId: "treinos-app-17791",
  storageBucket: "treinos-app-17791.appspot.com",
  messagingSenderId: "29487857882",
  appId: "1:29487857882:web:e5f688bf173b2f3c98a5e3",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
