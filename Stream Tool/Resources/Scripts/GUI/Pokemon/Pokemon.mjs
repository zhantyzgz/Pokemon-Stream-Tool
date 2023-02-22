import { pokeFinder } from "../Finder/Pokemon Finder.mjs";
import { stPath } from "../Globals.mjs";
const PkmnData = require('@pkmn/data');
const PkmnDex = require('@pkmn/dex');
const PkmnImg = require('@pkmn/img');


//TODO: evitar hardcodeo de gen 5. Singleton con la dex en uso en cada momento?
const dexGens = new PkmnData.Generations(PkmnDex.Dex);
const gen5 = dexGens.get(5); 
const pokemonList = gen5.species;

export class Pokemon {

    /** @type {PkmnData.Specie?} */
    #specie;

    constructor(el) {
        
        this.pokeSel = el.getElementsByClassName(`pokeSelector`)[0];
        this.nickInp = el.getElementsByClassName(`pokeNickName`)[0];
        this.formSel = el.getElementsByClassName(`pokeForm`)[0];
        this.genderChk = el.getElementsByClassName(`pokeGender`)[0];
        
        // set a listener that will trigger when pokemon selector is clicked
        this.pokeSel.addEventListener("click", () => {
            pokeFinder.open(this.pokeSel);
            pokeFinder.setCurrentPokemon(this);
            pokeFinder.focusFilter();

        });
        // also set an initial pokemon value
        this.setSpecies();

    }

    /**
     * Gets Pokémon species.
     * @returns {PkmnData.Specie?}
     */
    getSpecies() {
        return this.#specie;
    }
    /**
     * Sets a new pokemon based on species
     * @param {PkmnData.Specie | string} [specie] - Species of the pokemon
     */
    setSpecies(specie) {
        
        if(!specie){
            this.#specie = null;
        } else if(specie instanceof PkmnData.Specie){
            this.#specie = specie;
        } else{ //string
            this.#specie = pokemonList.get(specie);
        }

        // set the pokemon name and icon on the selector
        if (!this.#specie || this.#specie == "None") {
            this.pokeSel.children[1].innerHTML = "";
            this.pokeSel.children[0].src = `${stPath.poke}/None.png`;
        } else {
            this.pokeSel.children[1].innerHTML = this.#specie; 

            let imgInfo = PkmnImg.Icons.getPokemon(this.#specie, {protocol: 'http', domain: stPath.poke});
            this.pokeSel.children[0].style = imgInfo.style;
            //TODO: use getPokemon(name, {protocol: 'http', domain: stPath.poke}) in order to use local sprites.
            this.pokeSel.children[0].src = `${stPath.poke}/Transparent.png`; //Ugly workaround.
        }

    }

    getNickName() {
        return this.nickInp.value;
    }
    setNickName(name) {
        this.nickInp.value = name ?? "";
    }

    getForm() {
        return this.#specie?.forme;
    }

    getBaseSpecies(){
        return this.#specie?.baseSpecies;
    }

    getGender() {
        return this.#specie?.gender;
    }

    //TODO: set/get shinyness. Consider migrating to PokemonSet.

    getSpriteImgInfo(){
        //TODO: don't hardcode gen 5.
        let result = PkmnImg.Sprites.getPokemon(this.#specie, {
            gen: "gen5ani", 
            gender: this.getGender(), 
            shiny: this.shiny,
            protocol: 'http', domain: stPath.poke
        })
        result.url = result.url.replace("http://", "");
        return result;
    }

}