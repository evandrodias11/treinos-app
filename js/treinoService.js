// treinoService.js

import { db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

export async function carregarTreinos() {
  const treinosSnapshot = await getDocs(collection(db, "treinos"));
  const treinos = treinosSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return treinos;
}

export async function salvarTreino(treino) {
  await addDoc(collection(db, "treinos"), treino);
}

export async function atualizarTreino(treinoId, treinoAtualizado) {
  const treinoRef = doc(db, "treinos", treinoId);
  await updateDoc(treinoRef, treinoAtualizado);
}

export async function deletarTreino(treinoId) {
  const treinoRef = doc(db, "treinos", treinoId);
  await deleteDoc(treinoRef);
}
