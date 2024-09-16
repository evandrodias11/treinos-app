import { db } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Função para abrir o modal de treino com visualização dos exercícios
export function abrirModalTreino(treino, renderizarExercicios) {
  const treinoModalTitle = document.getElementById("treinoModalTitle");
  const exerciciosLista = document.getElementById("exerciciosLista");
  treinoModalTitle.textContent = treino.nome;
  exerciciosLista.innerHTML = ""; // Limpa os exercícios anteriores

  renderizarExercicios(treino);

  // Botão para fechar modal
  document.querySelector(".close").addEventListener("click", () => {
    const treinoModal = document.getElementById("treinoModal");
    treinoModal.style.display = "none";
  });

  // Fechar o modal quando clicar fora
  window.onclick = function (event) {
    const treinoModal = document.getElementById("treinoModal");
    if (event.target == treinoModal) {
      treinoModal.style.display = "none";
    }
  };

  const treinoModal = document.getElementById("treinoModal");
  treinoModal.style.display = "flex";
}

// Função para abrir o modal de edição de exercício
export function abrirModalEdicao(treinoId, exercicioIndex) {
  const modal = document.getElementById("modalEdicao");
  const modalContent = modal.querySelector(".modal-content");

  // Exibir valores atuais nos inputs
  const treino = window.treinos.find((treino) => treino.id === treinoId);
  const exercicio = treino.exercicios[exercicioIndex];

  modalContent.innerHTML = `
        <h2>Editar Exercício</h2>
        <label>Nome:</label>
        <input type="text" id="inputNome" value="${exercicio.nome || ""}" />
        <label>Séries:</label>
        <input type="number" id="inputSeries" value="${
          exercicio.series || ""
        }" />
        <label>Repetições:</label>
        <input type="number" id="inputRepeticoes" value="${
          exercicio.repeticoes || ""
        }" />
        <label>Peso:</label>
        <input type="number" id="inputPeso" value="${exercicio.peso || ""}" />
        <label>Tempo:</label>
        <input type="number" id="inputTempo" value="${exercicio.tempo || ""}" />
        <label>Vídeo URL:</label>
        <input type="text" id="inputVideoUrl" value="${
          exercicio.videoUrl || ""
        }" />
        <div class="button-container">
          <button onclick="salvarExercicioEdicao('${treinoId}', ${exercicioIndex})">Salvar</button>    
          <button onclick="fecharModalEdicao()">Cancelar</button>
        </div>
      `;

  modal.style.display = "flex";
}

// Função para abrir o modal de adição de exercício
export function abrirModalAdicaoExercicio(treinoId) {
  const modal = document.getElementById("modalEdicao");
  const modalContent = modal.querySelector(".modal-content");

  // Limpa os campos para adicionar novo exercício
  modalContent.innerHTML = `
        <h2>Adicionar Exercício</h2>
        <label>Nome:</label>
        <input type="text" id="inputNome" placeholder="Nome do exercício" />
        <label>Séries:</label>
        <input type="number" id="inputSeries" placeholder="Número de séries" />
        <label>Repetições:</label>
        <input type="number" id="inputRepeticoes" placeholder="Número de repetições" />
        <label>Peso:</label>
        <input type="number" id="inputPeso" placeholder="Peso em kg" />
        <label>Tempo:</label>
        <input type="number" id="inputTempo" placeholder="Tempo em minutos" />
        <label>Vídeo URL:</label>
        <input type="text" id="inputVideoUrl" placeholder="URL do vídeo" />
        <div class="button-container">
          <button onclick="salvarNovoExercicio('${treinoId}')">Salvar</button>    
          <button onclick="fecharModalEdicao()">Cancelar</button>
        </div>
      `;

  modal.style.display = "flex";
}

// Função para deletar o exercício
export async function deletarExercicioEdicao(treinoId, exercicioIndex) {
  if (confirm("Tem certeza que deseja deletar este exercício?")) {
    try {
      await deletarExercicio(treinoId, exercicioIndex);

      Toastify({
        text: "Exercício deletado com sucesso!",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#f44336",
        },
      }).showToast();

      fecharModalEdicao();
    } catch (error) {
      console.error("Erro ao deletar o exercício:", error);
      alert("Erro ao deletar o exercício. Tente novamente.");
    }
  }
}

// Função para salvar as edições feitas no modal
export function salvarExercicioEdicao(treinoId, exercicioIndex) {
  const treinoRef = doc(db, "treinos", treinoId);

  const novoNome = document.getElementById("edit-nome").value;
  const novasSeries = document.getElementById("edit-series").value;
  const novasRepeticoes = document.getElementById("edit-repeticoes").value;
  const novoPeso = document.getElementById("edit-peso").value;
  const novoTempo = document.getElementById("edit-tempo").value;
  const novoVideoUrl = document.getElementById("edit-videoUrl").value;

  getDoc(treinoRef).then((docSnap) => {
    const treinoData = docSnap.data();
    const exercicioAtualizado = {
      nome: novoNome || treinoData.exercicios[exercicioIndex].nome,
      series: novasSeries
        ? parseInt(novasSeries)
        : treinoData.exercicios[exercicioIndex].series,
      repeticoes: novasRepeticoes
        ? parseInt(novasRepeticoes)
        : treinoData.exercicios[exercicioIndex].repeticoes,
      peso: novoPeso
        ? parseFloat(novoPeso)
        : treinoData.exercicios[exercicioIndex].peso,
      tempo: novoTempo
        ? parseInt(novoTempo)
        : treinoData.exercicios[exercicioIndex].tempo,
      videoUrl: novoVideoUrl || treinoData.exercicios[exercicioIndex].videoUrl,
    };

    treinoData.exercicios[exercicioIndex] = exercicioAtualizado;

    updateDoc(treinoRef, treinoData).then(() => {
      fecharModalEdicao();
    });
  });
}

// Função para fechar o modal de edição
export function fecharModalEdicao() {
  const modalEdicao = document.getElementById("modalEdicao");
  modalEdicao.style.display = "none";
}

// Função para abrir o modal de vídeo
export function abrirModalVideo(url) {
  const videoContainer = document.getElementById("videoContainer");
  const videoModal = document.getElementById("videoModal");

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.split("v=")[1];
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

  videoModal.style.display = "flex";

  document.querySelector(".close-video").addEventListener("click", () => {
    videoModal.style.display = "none";
    videoContainer.innerHTML = "";
  });
}
