const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


document.addEventListener("DOMContentLoaded", () => {
  loadTrainers();
});


function loadTrainers() {
  fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(trainers => {
      for(trainer of trainers) {
        renderTrainer(trainer);
      }
    });
};


function renderTrainer(t) {
  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.setAttribute("data-id", t.id);

  let name = document.createElement("p");
  name.innerText = t.name;
  card.appendChild(name);

  let addPokemon = document.createElement("button");
  addPokemon.setAttribute("data-trainer-id", t.id)
  addPokemon.setAttribute("class", "add-pokemon");
  addPokemon.innerText = "Add Pokemon"

  addPokemon.addEventListener("click", (e) => {
    e.preventDefault();
    let trainerID = e.target.parentElement.getElementsByTagName('button')[0]["dataset"].trainerId
    let team = e.target.parentElement.getElementsByTagName('ul')[0];
    addPokemonToTeam(team, trainerID);
  });

  card.appendChild(addPokemon);

  // list of their Pokemon (no more than 6)
  let team = document.createElement("ul");
  team.id = t.id;



  for(pokemon of t.pokemons) {
    let li = document.createElement("li");
    li.innerText = `${pokemon.nickname} (${pokemon.species})`;

    let releaseBtn = document.createElement("button");
    releaseBtn.setAttribute("class", "release");
    releaseBtn.setAttribute("data-pokemon-id", pokemon.id);
    releaseBtn.innerText = "Release"

    releaseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      releasePokemon(e.target.parentElement, team);
    });

    li.appendChild(releaseBtn);
    team.appendChild(li);
  };

  card.appendChild(team);
  document.querySelector('main').appendChild(card)

  return card
};

function addPokemonToTeam(team, trainerID) {
  debugger;
  if(team.children.length == 6) {
    alert("You have too many Pokemon! Release some before adding more.")
  } else {
    fetch(POKEMONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({trainerID: trainerID})
    })
    .then(res => (res.json()))
    .then(data => {
      document.getElementById(data.trainer_id.toString()).innerHTML += `
      <li>${data.nickname} (${data.species}) <button class="release" data-pokemon-id="${data.id}">Release</button></li>
      `
    })
  };
};

function releasePokemon(pokemon, team) {
  let pokemonID = pokemon.getElementsByTagName('button')[0].dataset.pokemonId;
  fetch(POKEMONS_URL + `/${parseInt(pokemonID)}`, {method: "DELETE"});
  pokemon.remove();
};
