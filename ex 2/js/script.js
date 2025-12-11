const API_KEY = "https://www.omdbapi.com/";

const inputBusca = document.querySelector("#busca");
const btnBuscar = document.querySelector("#btnBuscar");
const lista = document.querySelector("#listaFilmes");
const ordenar = document.querySelector("#ordenar");
const filtroTipo = document.querySelector("#filtroTipo");
const estatisticasDiv = document.querySelector("#estatisticas");
const detalhesDiv = document.querySelector("#detalhes");

let filmes = []; // onde tudo será armazenado

btnBuscar.addEventListener("click", buscarFilmes);

async function buscarFilmes() {
  const termo = inputBusca.value;

  if (!termo) return alert("Digite algo!");

  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${termo}`;

  const resposta = await fetch(url);
  const dados = await resposta.json();

  filmes = dados.Search || [];

  renderFilmes(filmes);
  mostrarEstatisticas(filmes);
}

function renderFilmes(listaFilmes) {
    lista.innerHTML = "";
  
    listaFilmes.forEach(f => {
      const card = document.createElement("div");
      card.className = "card";
  
      card.innerHTML = `
        <img src="${f.Poster}" alt="">
        <h3>${f.Title}</h3>
        <p>${f.Year}</p>
        <p>${f.Type}</p>
      `;
  
      card.onclick = () => mostrarDetalhes(f.imdbID);
  
      lista.appendChild(card);
    });
}
  
ordenar.addEventListener("change", () => {
    let listaOrdenada = [...filmes];
  
    if (ordenar.value === "ano") {
      listaOrdenada.sort((a, b) => Number(b.Year) - Number(a.Year));
    }
  
    if (ordenar.value === "titulo") {
      listaOrdenada.sort((a, b) => a.Title.localeCompare(b.Title));
    }
  
    renderFilmes(listaOrdenada);
});

filtroTipo.addEventListener("change", () => {
    if (!filtroTipo.value) return renderFilmes(filmes);
  
    const filtrados = filmes.filter(f => f.Type === filtroTipo.value);
  
    renderFilmes(filtrados);
});

function mostrarEstatisticas(lista) {
    const total = lista.length;
  
    const somaAno = lista.reduce((acc, f) => acc + Number(f.Year), 0);
    const mediaAno = total ? (somaAno / total).toFixed(1) : 0;
  
    const contagem = lista.reduce((acc, f) => {
      acc[f.Type] = (acc[f.Type] || 0) + 1;
      return acc;
    }, {});
  
    estatisticasDiv.innerHTML = `
      <h3>📊 Estatísticas</h3>
      <p>Total de itens: ${total}</p>
      <p>Média do ano: ${mediaAno}</p>
      <p>Filmes: ${contagem.movie || 0}</p>
      <p>Séries: ${contagem.series || 0}</p>
      <p>Games: ${contagem.game || 0}</p>
    `;
}
  
async function mostrarDetalhes(id) {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`;
  
    const resposta = await fetch(url);
    const dados = await resposta.json();
  
    detalhesDiv.innerHTML = `
      <h2>${dados.Title} (${dados.Year})</h2>
      <p><strong>Gênero:</strong> ${dados.Genre}</p>
      <p><strong>Elenco:</strong> ${dados.Actors}</p>
      <p><strong>Direção:</strong> ${dados.Director}</p>
      <p><strong>Duração:</strong> ${dados.Runtime}</p>
      <p><strong>Nota IMDb:</strong> ${dados.imdbRating}</p>
      <p><strong>Sinopse:</strong> ${dados.Plot}</p>
    `;
}
