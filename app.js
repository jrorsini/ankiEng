import {
    getLingueeData,
    getReversoExamples,
    getReversoTranslations,
} from "./utility/api.js";
import {
    getClosestMatchingWord,
    logLingueeData,
    logReversoData,
} from "./utility/log.js";
import { chooseLingueeTranslation, chooseLingueeExample } from "./prompt.js";
import Reverso from "reverso-api";

import { addCard } from "./anki.js";

// clear log.
console.clear();

// instanciate Reverso
const reverso = new Reverso();

// retrieve user input
console.log(process.argv);
const usrInput = process.argv.slice(2).join(" ").toLowerCase().trim();
console.log(usrInput);

// log user input loading
console.log(`loading "${usrInput}"`);

// create Anki note object.
let ankiEngNote = { word: usrInput };

let reverso_data = {};

reverso_data = await getReversoTranslations.call(
    reverso_data,
    ankiEngNote.word
);
reverso_data = await getReversoExamples.call(reverso_data, ankiEngNote.word);

reverso_data["word"] = usrInput;

// get linguee's data
ankiEngNote = await getLingueeData.call(ankiEngNote);

// checks if linguee's api response isn't undefined.
if (ankiEngNote !== undefined && ankiEngNote.translations.length > 0) {
    // clear log.
    console.clear();

    // log reverso's data.
    logReversoData(reverso_data);

    // log linguee's data.
    logLingueeData(ankiEngNote);

    console.log(`\n-----------------------\n`);

    // choose translation.
    ankiEngNote = await chooseLingueeTranslation.call(ankiEngNote);

    // clear log.
    console.clear();

    // get example.
    ankiEngNote = await chooseLingueeExample.call(ankiEngNote);

    // save card in Anki.
    await addCard.call(ankiEngNote, "ankiEng", "ANKIENG_NOTE");
} else {
    // clear log.
    console.clear();

    // log reverso's data.
    logReversoData(reverso_data);
}
