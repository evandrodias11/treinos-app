import {
  carregarTreinos,
  salvarTreino as salvarTreinoService,
  atualizarTreino as atualizarTreinoService,
  deletarTreino as deletarTreinoService,
} from "./treinoService.js";
import {
  adicionarExercicio as adicionarExercicioService,
  salvarExercicio as salvarExercicioService,
  deletarExercicio as deletarExercicioService,
} from "./exercicioService.js";
import {
  abrirModalTreino,
  abrirModalVideo,
  abrirModalEdicao,
  abrirModalAdicaoExercicio,
} from "./modalHandler.js"; // Adicionada a importação de abrirModalEdicaoParaAdicionar

// Função para abrir o modal de edição de exercício
window.abrirModalEdicao = function (treinoId, exercicioIndex) {
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

  modalEdicao.style.display = "flex";
};

// Função para fechar o modal de edição ou adição
window.fecharModalEdicao = function () {
  const modalEdicao = document.getElementById("modalEdicao");
  modalEdicao.style.display = "none";
};

// Função para abrir o modal de edição de treino (definida como global)
window.abrirModalTreinoEdicao = function (treinoId = null) {
  const modalEdicao = document.getElementById("modalEdicao");
  const modalContent = modalEdicao.querySelector(".modal-content");

  let treino = { nome: "", descricao: "" }; // Valores padrão
  if (treinoId) {
    treino = window.treinos.find((t) => t.id === treinoId);
  }

  modalContent.innerHTML = `
    <span class="close-edicao" onclick="fecharModalEdicao()">&times;</span>
    <label for="inputNomeTreino">Nome do Treino:</label>
    <input type="text" id="inputNomeTreino" value="${treino.nome}">
    <label for="inputDescricaoTreino">Descrição:</label>
    <textarea id="inputDescricaoTreino">${treino.descricao}</textarea>
    <div class="button-container">
      <button onclick="salvarTreinoEdicao('${treinoId || ""}')">Salvar</button>
      <button onclick="fecharModalEdicao()">Cancelar</button>
    </div>
  `;

  modalEdicao.style.display = "flex";
};

// Função para abrir o modal de adição de exercício
window.abrirModalEdicaoParaAdicionar = function (treinoId) {
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

  modalEdicao.style.display = "flex";
};

// Função para salvar novo ou editar treino
window.salvarTreinoEdicao = async function (treinoId = null) {
  const nome = document.getElementById("inputNomeTreino").value;
  const descricao = document.getElementById("inputDescricaoTreino").value;

  if (!nome) {
    alert("O nome do treino é obrigatório");
    return;
  }

  const treinoAtualizado = { nome, descricao };

  try {
    if (treinoId) {
      await atualizarTreinoService(treinoId, treinoAtualizado);
      Toastify({
        text: "Treino atualizado com sucesso!",
        duration: 1000,
        gravity: "top",
        position: "center",
        style: { background: "#4caf50" },
      }).showToast();
    } else {
      await salvarTreinoService(treinoAtualizado);
      Toastify({
        text: "Treino criado com sucesso!",
        duration: 1000,
        gravity: "top",
        position: "center",
        style: { background: "#4caf50" },
      }).showToast();
    }

    setTimeout(() => {
      fecharModalEdicao();
      document.location.reload();
    }, 1000);
  } catch (error) {
    console.error("Erro ao salvar o treino:", error);
    alert("Erro ao salvar o treino. Tente novamente.");
  }
};

// Função para deletar treino
window.deletarTreino = async function (treinoId) {
  if (confirm("Tem certeza que deseja deletar este treino?")) {
    try {
      await deletarTreinoService(treinoId);
      Toastify({
        text: "Treino deletado com sucesso!",
        duration: 1000,
        gravity: "top",
        position: "center",
        style: { background: "#f44336" },
      }).showToast();
      document.location.reload();
    } catch (error) {
      console.error("Erro ao deletar o treino:", error);
      alert("Erro ao deletar o treino. Tente novamente.");
    }
  }
};

// Função para salvar as alterações no exercício editado
window.salvarExercicioEdicao = async function (treinoId, exercicioIndex) {
  const nome = document.getElementById("inputNome").value;
  const series = document.getElementById("inputSeries").value;
  const repeticoes = document.getElementById("inputRepeticoes").value;
  const peso = document.getElementById("inputPeso").value;
  const tempo = document.getElementById("inputTempo").value;
  const videoUrl = document.getElementById("inputVideoUrl").value;

  if (!nome) {
    alert("O nome do exercício é obrigatório");
    return;
  }

  const exercicioAtualizado = {
    nome,
    series: series ? parseInt(series) : null,
    repeticoes: repeticoes ? parseInt(repeticoes) : null,
    peso: peso ? parseFloat(peso) : null,
    tempo: tempo ? parseInt(tempo) : null,
    videoUrl: videoUrl || null,
  };

  try {
    await salvarExercicioService(treinoId, exercicioIndex, exercicioAtualizado);

    Toastify({
      text: "Edição feita com sucesso!",
      duration: 1000,
      gravity: "top",
      position: "center",
      style: {
        background: "#4caf50",
      },
    }).showToast();

    // Atualiza os exercícios sem recarregar a página
    const treino = window.treinos.find((t) => t.id === treinoId);
    treino.exercicios[exercicioIndex] = exercicioAtualizado;
    renderizarExercicios(treino);

    setTimeout(fecharModalEdicao, 1000);
  } catch (error) {
    console.error("Erro ao salvar o exercício:", error);
    alert("Erro ao salvar o exercício. Tente novamente.");
  }
};

// Função para salvar um novo exercício
window.salvarNovoExercicio = async function (treinoId) {
  const nome = document.getElementById("inputNome").value;
  const series = document.getElementById("inputSeries").value;
  const repeticoes = document.getElementById("inputRepeticoes").value;
  const peso = document.getElementById("inputPeso").value;
  const tempo = document.getElementById("inputTempo").value;
  const videoUrl = document.getElementById("inputVideoUrl").value;

  if (!nome) {
    alert("O nome do exercício é obrigatório");
    return;
  }

  const novoExercicio = {
    nome,
    series: series ? parseInt(series) : null,
    repeticoes: repeticoes ? parseInt(repeticoes) : null,
    peso: peso ? parseFloat(peso) : null,
    tempo: tempo ? parseInt(tempo) : null,
    videoUrl: videoUrl || null,
  };

  try {
    await adicionarExercicioService(treinoId, novoExercicio);

    Toastify({
      text: "Exercício adicionado com sucesso!",
      duration: 1000,
      gravity: "top",
      position: "center",
      style: {
        background: "#4caf50",
      },
    }).showToast();

    // Atualiza os exercícios sem recarregar a página
    const treino = window.treinos.find((t) => t.id === treinoId);
    treino.exercicios.push(novoExercicio);
    renderizarExercicios(treino);

    setTimeout(fecharModalEdicao, 1000);
  } catch (error) {
    console.error("Erro ao adicionar o exercício:", error);
    alert("Erro ao adicionar o exercício. Tente novamente.");
  }
};

// Função para deletar um exercício
window.deletarExercicioEdicao = async function (treinoId, exercicioIndex) {
  if (confirm("Tem certeza que deseja deletar este exercício?")) {
    try {
      // Chama o serviço para deletar o exercício no banco de dados
      await deletarExercicioService(treinoId, exercicioIndex);

      Toastify({
        text: "Exercício deletado com sucesso!",
        duration: 1000,
        gravity: "top",
        position: "center",
        style: {
          background: "#f44336",
        },
      }).showToast();

      // Atualiza a lista global de exercícios sem recarregar a página
      const treino = window.treinos.find((t) => t.id === treinoId);
      treino.exercicios.splice(exercicioIndex, 1); // Remove o exercício da lista global
      renderizarExercicios(treino); // Renderiza a nova lista de exercícios
    } catch (error) {
      console.error("Erro ao deletar o exercício:", error);
      alert("Erro ao deletar o exercício. Tente novamente.");
    }
  }
};

// Função para abrir o modal de vídeo
window.abrirVideo = abrirModalVideo;

// Renderiza os treinos ao carregar a página
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const treinos = await carregarTreinos();
    window.treinos = treinos;
    renderizarTreinos(window.treinos);
  } catch (error) {
    console.error("Erro ao carregar os treinos:", error);
  }
});

// Função para renderizar os treinos e adicionar o botão "Adicionar Treino"
function renderizarTreinos(treinos) {
  const treinoContainer = document.querySelector(".treino-lista");
  treinoContainer.innerHTML = "";

  treinos.forEach((treino) => {
    const treinoItem = document.createElement("div");
    treinoItem.classList.add("treino-item");
    treinoItem.innerHTML = `
      <h3>${treino.nome}</h3>
      <p>${treino.descricao}</p>
      <button onclick="abrirModalTreinoEdicao('${treino.id}')">Editar</button>
      <button onclick="deletarTreino('${treino.id}')">Deletar</button>
    `;
    treinoItem.addEventListener("click", () =>
      abrirModalTreino(treino, renderizarExercicios)
    );
    treinoContainer.appendChild(treinoItem);
  });

  // Botão para adicionar novo treino
  const adicionarTreinoBtn = document.createElement("button");
  adicionarTreinoBtn.textContent = "Adicionar Treino";
  adicionarTreinoBtn.onclick = () => abrirModalTreinoEdicao();
  treinoContainer.appendChild(adicionarTreinoBtn);
}

// Função para renderizar os exercícios dentro do modal de visualização
function renderizarExercicios(treino) {
  const exerciciosLista = document.getElementById("exerciciosLista");
  exerciciosLista.innerHTML = ""; // Limpa os exercícios anteriores

  // Verifica se treino.exercicios existe e é um array
  if (Array.isArray(treino.exercicios) && treino.exercicios.length > 0) {
    treino.exercicios.forEach((exercicio, index) => {
      const exercicioItem = document.createElement("div");
      exercicioItem.classList.add("exercicio-item");

      // Exibe os detalhes do exercício de forma não editável
      exercicioItem.innerHTML = `
        <h4>${exercicio.nome}</h4>
        <p>Séries: ${exercicio.series || "-"}</p>
        <p>Repetições: ${exercicio.repeticoes || "-"}</p>
        <p>Peso: ${exercicio.peso || "-"} kg</p>
        <p>Tempo: ${exercicio.tempo || "-"} min</p>
        <button onclick="abrirModalVideo('${
          exercicio.videoUrl
        }')">Ver vídeo</button>
        <button onclick="abrirModalEdicao('${
          treino.id
        }', ${index})">Editar</button>
        <button onclick="deletarExercicioEdicao('${
          treino.id
        }', ${index})">Deletar</button>
      `;

      exerciciosLista.appendChild(exercicioItem);
    });
  } else {
    // Se não houver exercícios, exibe uma mensagem
    exerciciosLista.innerHTML = "<p>Nenhum exercício cadastrado.</p>";
  }

  // Adicionar botão para adicionar novo exercício
  const adicionarExercicioBtn = document.createElement("button");
  adicionarExercicioBtn.textContent = "Adicionar Exercício";
  adicionarExercicioBtn.onclick = () => abrirModalAdicaoExercicio(treino.id);
  exerciciosLista.appendChild(adicionarExercicioBtn);
}

// Função para abrir o modal de vídeo
window.abrirModalVideo = abrirModalVideo;

// Renderiza os treinos ao carregar a página
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const treinos = await carregarTreinos();
    window.treinos = treinos;
    renderizarTreinos(window.treinos);
  } catch (error) {
    console.error("Erro ao carregar os treinos:", error);
  }
});
