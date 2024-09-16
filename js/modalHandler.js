// modalHandler.js

import { db } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Função para abrir o modal de treino com visualização dos exercícios
export function abrirModalTreino(treino, renderizarExercicios) {
  const treinoModalTitle = document.getElementById("treinoModalTitle");
  treinoModalTitle.textContent = treino.nome;

  renderizarExercicios(treino);

  const treinoModal = document.getElementById("treinoModal");
  treinoModal.classList.add("ativo");

  // Fechar o modal ao clicar no 'X'
  const closeBtn = treinoModal.querySelector(".close");
  closeBtn.onclick = () => {
    treinoModal.classList.remove("ativo");
  };

  // Fechar o modal ao clicar fora dele
  window.onclick = function (event) {
    if (event.target == treinoModal) {
      treinoModal.classList.remove("ativo");
    }
  };
}

// Função para abrir o modal de vídeo
export function abrirModalVideo(url) {
  const videoContainer = document.getElementById("videoContainer");
  const videoModal = document.getElementById("videoModal");

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId;
    if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1];
    } else {
      videoId = url.split("v=")[1].split("&")[0];
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    videoContainer.innerHTML = `<iframe width="100%" height="315" src="${embedUrl}" 
                                  frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
                                  encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                                </iframe>`;
  } else if (url.endsWith(".gif")) {
    videoContainer.innerHTML = `<img src="${url}" alt="Exemplo do exercício" style="max-width: 100%; height: auto;">`;
  } else {
    videoContainer.innerHTML = `<video controls autoplay>
                    <source src="${url}" type="video/mp4">
                    Seu navegador não suporta a tag de vídeo.
                </video>`;
  }

  videoModal.classList.add("ativo");

  // Fechar o modal ao clicar no 'X'
  const closeVideoBtn = videoModal.querySelector(".close-video");
  closeVideoBtn.onclick = () => {
    videoModal.classList.remove("ativo");
    videoContainer.innerHTML = "";
  };

  // Fechar o modal ao clicar fora dele
  window.onclick = function (event) {
    if (event.target == videoModal) {
      videoModal.classList.remove("ativo");
      videoContainer.innerHTML = "";
    }
  };
}

// Função para abrir o modal de edição de exercício
export function abrirModalEdicao(treinoId, exercicioIndex) {
  const modalEdicao = document.getElementById("modalEdicao");
  const modalContent = modalEdicao.querySelector(".modal-content");

  const treino = window.treinos.find((t) => t.id === treinoId);
  const exercicio = treino.exercicios[exercicioIndex];

  modalContent.innerHTML = `
    <span class="close-edicao" onclick="fecharModalEdicao()">&times;</span>
    <label for="inputNome">Nome:</label>
    <input type="text" id="inputNome" value="${exercicio.nome}">
    <label for="inputSeries">Séries:</label>
    <input type="number" id="inputSeries" value="${exercicio.series || ""}">
    <label for="inputRepeticoes">Repetições:</label>
    <input type="number" id="inputRepeticoes" value="${
      exercicio.repeticoes || ""
    }">
    <label for="inputPeso">Peso (kg):</label>
    <input type="number" id="inputPeso" value="${exercicio.peso || ""}">
    <label for="inputTempo">Tempo (min):</label>
    <input type="number" id="inputTempo" value="${exercicio.tempo || ""}">
    <label for="inputVideoUrl">URL do Vídeo:</label>
    <input type="text" id="inputVideoUrl" value="${exercicio.videoUrl || ""}">
    <div class="button-container">
      <button onclick="salvarExercicioEdicao('${treinoId}', ${exercicioIndex})">Salvar</button>
      <button onclick="fecharModalEdicao()">Cancelar</button>
    </div>
  `;

  modalEdicao.classList.add("ativo");
}

// Função para abrir o modal de adição de exercício
export function abrirModalAdicaoExercicio(treinoId) {
  const modalEdicao = document.getElementById("modalEdicao");
  const modalContent = modalEdicao.querySelector(".modal-content");

  modalContent.innerHTML = `
    <span class="close-edicao" onclick="fecharModalEdicao()">&times;</span>
    <label for="inputNome">Nome:</label>
    <input type="text" id="inputNome" placeholder="Nome do exercício">
    <label for="inputSeries">Séries:</label>
    <input type="number" id="inputSeries" placeholder="Número de séries">
    <label for="inputRepeticoes">Repetições:</label>
    <input type="number" id="inputRepeticoes" placeholder="Número de repetições">
    <label for="inputPeso">Peso (kg):</label>
    <input type="number" id="inputPeso" placeholder="Peso em kg">
    <label for="inputTempo">Tempo (min):</label>
    <input type="number" id="inputTempo" placeholder="Tempo em minutos">
    <label for="inputVideoUrl">URL do Vídeo:</label>
    <input type="text" id="inputVideoUrl" placeholder="URL do vídeo">
    <div class="button-container">
      <button onclick="salvarNovoExercicio('${treinoId}')">Salvar</button>
      <button onclick="fecharModalEdicao()">Cancelar</button>
    </div>
  `;

  modalEdicao.classList.add("ativo");
}

// Função para fechar o modal de edição
export function fecharModalEdicao() {
  const modalEdicao = document.getElementById("modalEdicao");
  modalEdicao.classList.remove("ativo");
}

// Disponibiliza a função fecharModalEdicao no escopo global
window.fecharModalEdicao = fecharModalEdicao;
