let todosOsPaises = [];
let paisesFiltrados = [];

// Carregar dados da API
async function carregar() {
  try {
    const resposta = await fetch("https://restcountries.com/v3.1/all");
    const dados = await resposta.json();

    todosOsPaises = dados;
    paisesFiltrados = dados;

    mostrarPaises(dados);
    estatisticas(dados);

  } catch (erro) {
    console.error("Erro ao carregar países:", erro);
  }
}

// Mostrar países na tela
function mostrarPaises(lista) {
  const div = document.querySelector("#listaPaises");
  div.innerHTML = "";

  lista.forEach(pais => {
    const card = document.createElement("div");
    card.className = "pais";

    card.innerHTML = `
      <img src="${pais.flags.png}" alt="Bandeira de ${pais.name.common}">
      <h3>${pais.name.common}</h3>
      <p><strong>Capital:</strong> ${pais.capital ? pais.capital[0] : "Nenhuma"}</p>
      <p><strong>População:</strong> ${pais.population.toLocaleString()}</p>
    `;

    card.addEventListener("click", () => detalhesDoPais(pais.name.common));

    div.appendChild(card);
  });
}

// Busca por nome
function buscaNome() {
  const busca = document.querySelector("#campoBusca");

  busca.addEventListener("input", e => {
    const texto = e.target.value.toLowerCase();

    paisesFiltrados = todosOsPaises.filter(pais =>
      pais.name.common.toLowerCase().includes(texto)
    );

    mostrarPaises(paisesFiltrados);
    estatisticas(paisesFiltrados);
  });
}

// Filtro por região
function filtroRegiao() {
  const select = document.querySelector("#filtroRegiao");

  select.addEventListener("change", e => {
    const regiao = e.target.value;

    paisesFiltrados = regiao
      ? todosOsPaises.filter(p => p.region === regiao)
      : todosOsPaises;

    mostrarPaises(paisesFiltrados);
    estatisticas(paisesFiltrados);
  });
}

// Ordenar
function ordenarPorNome() {
  paisesFiltrados.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );
  mostrarPaises(paisesFiltrados);
}

function ordenarPorPopulacao() {
  paisesFiltrados.sort((a, b) => a.population - b.population);
  mostrarPaises(paisesFiltrados);
}

function ordenarPorArea() {
  paisesFiltrados.sort((a, b) => a.area - b.area);
  mostrarPaises(paisesFiltrados);
}

// Estatísticas (reduce)
function estatisticas(lista) {
  const totalPop = lista.reduce((acc, p) => acc + p.population, 0);
  const totalArea = lista.reduce((acc, p) => acc + p.area, 0);

  const div = document.querySelector("#estatisticas");
  div.innerHTML = `
    <h2>📊 Estatísticas</h2>
    <p><strong>Total de países:</strong> ${lista.length}</p>
    <p><strong>População total:</strong> ${totalPop.toLocaleString()}</p>
    <p><strong>Área total:</strong> ${totalArea.toLocaleString()} km²</p>
    <p><strong>Média de população:</strong> ${(totalPop / lista.length).toFixed(0)}</p>
    <p><strong>Média de área:</strong> ${(totalArea / lista.length).toFixed(0)}</p>
  `;
}

// Detalhes do país (find)
function detalhesDoPais(nome) {
  const pais = todosOsPaises.find(p => p.name.common === nome);

  alert(`
    País: ${pais.name.common}
    Capital: ${pais.capital}
    Sub-região: ${pais.subregion}
    Idiomas: ${pais.languages ? Object.values(pais.languages).join(", ") : "Nenhum"}
    Moedas: ${pais.currencies ? Object.values(pais.currencies).map(m => m.name).join(", ") : "Nenhuma"}
    Fronteiras: ${pais.borders ? pais.borders.join(", ") : "Nenhuma"}
  `);
}

// Inicializar
carregar();
buscaNome();
filtroRegiao();
