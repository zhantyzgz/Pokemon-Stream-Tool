import { inside, stPath } from './Globals.mjs';

/**
 * Returns parsed json data from a local file
 * @param {String} jPath - Path to local file
 * @returns {Object?} - Parsed json object
*/
export async function getJson(jPath) {

    if (inside.electron) {

        // the electron version
        const fs = require('fs');
        if (fs.existsSync(jPath + ".json")) {
            return JSON.parse(fs.readFileSync(jPath + ".json"));
        } else {
            return null;
        }

    } else {

        // the browser version
        try {
            return await (await fetch(jPath + ".json", {cache: "no-store"})).json();
        } catch (e) {
            return null;
        }

    }

}

/**
 * Checks if the requested file exists/can be accessed
 * @param {String} filePath - Path to the file
 * @returns True or False, pretty self explanatory if you ask me
 */
export async function fileExists(filePath) {

    if (inside.electron) {

        const fs = require('fs');
        return fs.existsSync(filePath);
        
    } else {

        return (await fetch(filePath, {method: "HEAD"})).ok;
    
    }

}


//TODO: Move this method out of FileSystem and into its own class.
const PkmnDex = require('@pkmn/dex');
const PkmnData = require('@pkmn/data');

const dexGens = new PkmnData.Generations(PkmnDex.Dex);
const gen5 = dexGens.get(5); //We'll hardcode it for now, for a proof-of-concept.
/**
 * Generates a character list depending on the Pokémon available on that generation.
 * @returns Species object (NOT an array, but an iterable).
 */
export async function getCharacterList() {

    const pokemonList2 = gen5.species;
    return pokemonList2;

}

//TODO: End of TODO.

/**
 * Saves a local json file with the provided values
 * @param {String} path - Path where the file will be saved
 * @param {Object} data - Data to be saved
 */
export async function saveJson(path, data) {

    if (inside.electron) {

        // save the file
        const fs = require('fs');
        fs.writeFileSync(`${stPath.text}${path}.json`, JSON.stringify(data, null, 2));
        
        // send signal to update remote GUIs
        const ipc = await import("./IPC.mjs");

    } else {
        const remote = await import("./Remote Requests.mjs");
        data.message = "RemoteSaveJson";
        data.path = path;
        remote.sendRemoteData(data);
    }
    
}
