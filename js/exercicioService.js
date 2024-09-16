import { db } from "./firebaseConfig.js";
import {
  doc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Função para adicionar um novo exercício a um treino
export async function adicionarExercicio(treinoId, novoExercicio) {
  const treinoRef = doc(db, "treinos", treinoId);
  const treinoSnap = await getDoc(treinoRef);
  const treinoData = treinoSnap.data();

  // Verificar se o array de exercícios existe, caso contrário, inicializá-lo
  if (!treinoData.exercicios) {
    treinoData.exercicios = [];
  }

  const novoExercicioComValoresValidos = {
    nome: novoExercicio.nome,
    series: novoExercicio.series !== undefined ? novoExercicio.series : null,
    repeticoes:
      novoExercicio.repeticoes !== undefined ? novoExercicio.repeticoes : null,
    peso: novoExercicio.peso !== undefined ? novoExercicio.peso : null,
    tempo: novoExercicio.tempo !== undefined ? novoExercicio.tempo : null,
    videoUrl: novoExercicio.videoUrl || null,
  };

  // Adiciona o novo exercício ao array de exercícios
  treinoData.exercicios.push(novoExercicioComValoresValidos);

  // Atualiza o documento no Firestore
  await updateDoc(treinoRef, treinoData);
}

// Função para salvar alterações de um exercício no treino
export async function salvarExercicio(
  treinoId,
  exercicioIndex,
  exercicioAtualizado
) {
  const treinoRef = doc(db, "treinos", treinoId);
  const treinoSnap = await getDoc(treinoRef);
  const treinoData = treinoSnap.data();

  // Verificar se o array de exercícios existe e se o índice é válido
  if (!treinoData.exercicios || !treinoData.exercicios[exercicioIndex]) {
    console.error("Exercício não encontrado ou índice inválido");
    return;
  }

  // Atualizar o exercício com os valores capturados ou manter os antigos
  treinoData.exercicios[exercicioIndex] = {
    nome:
      exercicioAtualizado.nome || treinoData.exercicios[exercicioIndex].nome,
    series: exercicioAtualizado.series || null,
    repeticoes: exercicioAtualizado.repeticoes || null,
    peso: exercicioAtualizado.peso || null,
    tempo: exercicioAtualizado.tempo || null,
    videoUrl: exercicioAtualizado.videoUrl || null,
  };

  // Atualiza o documento no Firestore
  await updateDoc(treinoRef, treinoData);
}

// Função para deletar um exercício
export async function deletarExercicio(treinoId, exercicioIndex) {
  const treinoRef = doc(db, "treinos", treinoId);
  const treinoSnap = await getDoc(treinoRef);
  const treinoData = treinoSnap.data();

  // Remove o exercício do array pelo índice
  treinoData.exercicios.splice(exercicioIndex, 1);

  // Atualiza o documento no Firestore
  await updateDoc(treinoRef, treinoData);
}
