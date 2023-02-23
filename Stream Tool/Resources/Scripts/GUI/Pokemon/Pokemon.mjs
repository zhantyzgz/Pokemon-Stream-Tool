import { pokeFinder } from "../Finder/Pokemon Finder.mjs";
import { stPath } from "../Globals.mjs";

//This lets us have automatic type checking:
/**
 * @typedef {import("@pkmn/data")} PkmnData
 * @typedef {import("@pkmn/data").Specie} Specie
 * @typedef {import("@pkmn/dex")} PkmnDex 
 * @typedef {import("@pkmn/img")} PkmnImg 
 * */
/** @type {PkmnData} */
const pkmnData = pkmn.data;
/** @type {PkmnDex} */
const pkmnDex = pkmn.dex;
/** @type {PkmnImg} */
const pkmnImg = pkmn.img;

//TODO: evitar hardcodeo de gen 5. Singleton con la dex en uso en cada momento?
const dexGens = new pkmnData.Generations(pkmnDex.Dex);
const gen5 = dexGens.get(5); 
const pokemonList = gen5.species;

export class Pokemon {

    /** @type {Specie?} */
    #specie;
    /** @type {boolean} */
    #shiny;
    /** @type {HTMLSelectElement} */
    pokeSel;
    /** @type {HTMLInputElement} */
    nickInp;
    /** @type {HTMLSelectElement} */
    formSel;
    /** @type {HTMLInputElement} */
    genderChk;

    /** @param {HTMLElement} el */
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
     * @returns {Specie?}
     */
    getSpecies() {
        return this.#specie;
    }
    /**
     * Sets a new pokemon based on species
     * @param {Specie | string} [specie] - Species of the pokemon
     */
    setSpecies(specie) {
        
        if(!specie){
            this.#specie = null;
        } else if(specie instanceof pkmnData.Specie){
            this.#specie = specie;
        } else{ //string
            this.#specie = pokemonList.get(specie) ?? null;
        }

        // set the pokemon name and icon on the selector
        if (!this.#specie) {
            this.pokeSel.children[1].innerHTML = "";
            this.pokeSel.children[0].src = `${stPath.poke}/None.png`;
        } else {

            this.pokeSel.children[1].innerHTML = this.#specie.name; 
            let imgInfo = pkmnImg.Icons.getPokemon(this.#specie.name, {protocol: 'http', domain: stPath.poke});
            imgInfo.style = imgInfo.style.replace("http://", "");
            this.pokeSel.children[0].style = imgInfo.style;
            //TODO: Fix the view inside electron and remove the ugly workaround.
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

    /** @param {boolean} bool */
    setShinyness(bool){
        this.#shiny = bool;
    }

    getShinyness(){
        return this.#shiny;
    }

    //TODO: Consider migrating to PokemonSet.

    getSpriteImgInfo(){
        //TODO: don't hardcode gen 5.
        let result = pkmnImg.Sprites.getPokemon(this.#specie?.name, {
            gen: "gen5ani", 
            gender: this.getGender(), 
            shiny: this.getShinyness(),
            protocol: 'http', domain: stPath.poke
        })
        result.url = result.url.replace("http://", "");
        return result;
    }

}