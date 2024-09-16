// exercicioService.js

import { db } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

export async function adicionarExercicio(treinoId, exercicio) {
  const treinoRef = doc(db, "treinos", treinoId);
  const treinoSnap = await getDoc(treinoRef);
  const treinoData = treinoSnap.data();
  const exercicios = treinoData.exercicios || [];
  exercicios.push(exercicio);
  await updateDoc(treinoRef, { exercicios });
}

export async function salvarExercicio(
  treinoId,
  exercicioIndex,
  exercicioAtualizado
) {
  const treinoRef = doc(db, "treinos", treinoId);
  const treinoSnap = await getDoc(treinoRef);
  const treinoData = treinoSnap.data();
  const exercicios = treinoData.exercicios || [];
  exercicios[exercicioIndex] = exercicioAtualizado;
  await updateDoc(treinoRef, { exercicios });
}

export async function deletarExercicio(treinoId, exercicioIndex) {
  const treinoRef = doc(db, "treinos", treinoId);
  const treinoSnap = await getDoc(treinoRef);
  const treinoData = treinoSnap.data();
  const exercicios = treinoData.exercicios || [];
  exercicios.splice(exercicioIndex, 1);
  await updateDoc(treinoRef, { exercicios });
}
