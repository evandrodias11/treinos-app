import { db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Função para carregar os treinos do Firestore
export async function carregarTreinos() {
  const snapshot = await getDocs(collection(db, "treinos"));
  const treinos = [];
  snapshot.forEach((doc) => treinos.push({ id: doc.id, ...doc.data() }));
  return treinos;
}

// Função para adicionar um novo treino
export async function salvarTreino(treino) {
  await addDoc(collection(db, "treinos"), treino);
}

// Função para atualizar treino existente
export async function atualizarTreino(id, treino) {
  await updateDoc(doc(db, "treinos", id), treino);
}

// Função para deletar treino
export async function deletarTreino(id) {
  await deleteDoc(doc(db, "treinos", id));
}
