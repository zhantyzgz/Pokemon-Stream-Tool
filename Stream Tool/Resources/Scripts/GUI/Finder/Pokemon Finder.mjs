import { getCharacterList } from '../File System.mjs';
import { stPath } from '../Globals.mjs';
import { FinderSelect } from './Finder Select.mjs';

class PokeFinder extends FinderSelect {

    #curPokemon;

    constructor() {
        super(document.getElementById("pokeFinder"));
    }

    /** Fills the character list with each folder on the Characters folder */
    async loadCharacters() {

        // create a list with all Pokémon of the given generation
        const pokemonList = await getCharacterList();

        // add entries to the character list
        // pokemonList is a Species object, can iterate to get a Specie object.
        // NatDex order. If we prefer alphabetical, we can use Array.from(pokemonList).sort().
        for(let pokemon of pokemonList){
            // this will be the div to click
            const newDiv = document.createElement('div');
            newDiv.className = "finderEntry";
            newDiv.addEventListener("click", () => {this.#entryClick(pokemon.name)});

            // character icon
            const imgIcon = document.createElement('img');
            imgIcon.className = "fIconImg";
            // this will get us the true default icon for any character
            //TODO: move this to a more proper class (Pokemon), in order to have more advanced logic (different sprites depending on gen, etc).
            let imgInfo = pkmn.img.Icons.getPokemon(pokemon, {protocol: 'http', domain: stPath.poke});
            imgInfo.style = imgInfo.style.replace("http://", "");
            // Includes fields: style, url, left, top, css: {display, width, height, imageRendering, background}.
            // All the Pokémon icons are cropped from a single big spritesheet (pokemonicons-sheet.png).
            //TODO: Fix the view inside electron and remove the ugly workaround.
            
            imgIcon.style = imgInfo.style; //This should do the trick
            imgIcon.src = `${stPath.poke}/Transparent.png`; //Ugly workaround.
            
            // pokemon name
            const spanName = document.createElement('span');
            spanName.innerHTML = pokemon.name;
            spanName.className = "pfName";

            // add them to the div we created before
            newDiv.appendChild(imgIcon);
            newDiv.appendChild(spanName);

            // and now add the div to the actual interface
            this.addEntry(newDiv);

        }

    }

    #entryClick(pokeName) {

        // clear focus to hide character select menu
        document.activeElement.blur();

        // clear filter box
        this._finderEl.firstElementChild.value = "";

        // our player class will take things from here
        this.#curPokemon.setSpecies(pokeName);

    }

    setCurrentPokemon(pokemon) {
        this.#curPokemon = pokemon;
    }

}

export const pokeFinder = new PokeFinder;