import { pokeFinder } from "../Finder/Pokemon Finder.mjs";
import { stPath } from "../Globals.mjs";
const PkmnImg = require('@pkmn/img');

export class Pokemon {

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

    getSpecies() {
        return this.pokeSel.children[1].innerHTML;
    }
    /**
     * Sets a new pokemon based on the name
     * @param {String} name - Name of the pokemon
     */
    setSpecies(name) {

        // set the pokemon name and icon on the selector
        if (!name || name == "None") {
            this.pokeSel.children[1].innerHTML = "";
            this.pokeSel.children[0].src = `${stPath.poke}/None.png`;
        } else {
            this.pokeSel.children[1].innerHTML = name;

            let imgInfo = PkmnImg.Icons.getPokemon(name);
            this.pokeSel.children[0].style = imgInfo.style;
            //TODO: use getPokemon(name, {protocol: 'http', domain: stPath.poke}) in order to use local sprites.
            this.pokeSel.children[0].src = `${stPath.poke}/Transparent.png`; //Ugly workaround.
        }

    }

    getNickName() {
        return this.nickInp.value;
    }
    setNickName(name) {
        if (name) {
            this.nickInp.value = name;
        } else {
            this.nickInp.value = "";
        }
    }

    getForm() {
        return this.formSel.value;
    }

    getGender() {
        if (this.genderChk.checked) {
            return "F"
        } else {
            return "M"
        }
    }

    getSriteImgSrc() {
        return `../../Resources/Assets/Pokemon/${this.getSpecies()}/Sprite Anim/${this.getForm()}.gif`;
    }

}