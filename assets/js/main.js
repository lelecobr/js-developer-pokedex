const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const modal = document.getElementById('pokemonModal');
const modalContent = document.getElementById('modalContent');
const closeButton = document.querySelector('.close');

const maxRecords = 151;
const limit = 10;
let offset = 0;
let pokemons = [];

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((newPokemons = []) => {
        pokemons = [...pokemons, ...newPokemons];
        const newHtml = newPokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit);

pokemonList.addEventListener('click', (event) => {
    const clickedElement = event.target.closest('.pokemon');
    if (clickedElement) {
        const pokemonIndex = Array.from(clickedElement.parentElement.children).indexOf(clickedElement);
        const selectedPokemon = pokemons[pokemonIndex];
        openModal(selectedPokemon);
    }
});

closeButton.addEventListener('click', closeModal);

// Fechar o modal se clicar fora da área do modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

function openModal(pokemon) {
    const modalHtml = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
        <p>Number: #${pokemon.number}</p>
        <p>Type: ${pokemon.type}</p>
        <p>Types: ${pokemon.types.join(', ')}</p>
    `;
    modalContent.innerHTML = modalHtml;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}
