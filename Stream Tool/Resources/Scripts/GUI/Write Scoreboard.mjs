import { inside } from './Globals.mjs';
import { pokemons } from './Pokemon/Pokemons.mjs'

const updateDiv = document.getElementById('updateRegion');
const updateText = updateDiv.getElementsByClassName("botText")[0];
const updateRegion = document.getElementById('updateRegion');

// bottom bar update button
updateDiv.addEventListener("click", writeScoreboard);


/** Changes the text displayed on the update button */
export function changeUpdateText(text) {
    updateText.innerHTML = text;
}

/** Generates an object with game data, then sends it */
export async function writeScoreboard() {

    // if this is a remote browser, display some visual feedback
    if (!inside.electron) {
        changeUpdateText("SENDING DATA...");
        // disable updating until we get data back
        updateRegion.removeEventListener("click", writeScoreboard);
    }

    // this is what's going to be sent to the browsers
    const scoreboardJson = {
        playerPokemons: [], //more lines will be added below
        id : "gameData"
    };

    // add the player's info to the player section of the json
    for (let i = 0; i < pokemons.length; i++) {

        // finally, add it to the main json
        scoreboardJson.playerPokemons.push({
            species: pokemons[i].getSpecies()?.name,
            forme: pokemons[i].getForm(), 
            baseSpecies: pokemons[i].getBaseSpecies(), //Sometimes we just need the base forme name; avoids things like "Giratina-Origin".
            nickName : pokemons[i].getNickName(),
            gender : pokemons[i].getGender(),
            imgInfo : pokemons[i].getSpriteImgInfo()
        })

    }

    // its time to send the data away
    if (inside.electron) {

        const ipc = await import("./IPC.mjs");
        ipc.updateGameData(JSON.stringify(scoreboardJson, null, 2));
        ipc.sendGameData();
        ipc.sendRemoteGameData();

    } else { // remote update stuff

        const remote = await import("./Remote Requests.mjs");
        scoreboardJson.id = "";
        scoreboardJson.message = "RemoteUpdateGUI";
        remote.sendRemoteData(scoreboardJson);

    }

}
