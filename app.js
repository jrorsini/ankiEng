import {
    fuseReversoAndLinguee,
    getLingueeData,
    getReversoExamples,
    getReversoTranslations,
} from "./utility/api.js";
import {
    getClosestMatchingWord,
    logData,
    logLingueeData,
    logReversoData,
} from "./utility/log.js";
import { chooseTranslation, chooseExample } from "./prompt.js";
import Reverso from "reverso-api";

import { addCard } from "./anki.js";

// clear log.
console.clear();

// instanciate Reverso
const reverso = new Reverso();

// retrieve user input
const usrInput = process.argv.slice(2).join(" ").toLowerCase().trim();

// log user input loading
console.log(`loading "${usrInput}"`);

// create Anki note object.
let ankiEngNote = { word: usrInput };

// instanciate reverso object.
let reverso_data = {};

// added translations from Reverso
reverso_data = await getReversoTranslations.call(
    reverso_data,
    ankiEngNote.word
);

// added examples from Reverso
reverso_data = await getReversoExamples.call(reverso_data, ankiEngNote.word);

console.log(reverso_data);

// get linguee's data
ankiEngNote = await getLingueeData.call(ankiEngNote);

// fuse Reverso and Linguee's definitions and examples.
ankiEngNote = fuseReversoAndLinguee(ankiEngNote, reverso_data);

console.log(ankiEngNote);

// checks if linguee's api response isn't undefined.
if (ankiEngNote !== undefined && ankiEngNote.translations.length > 0) {
    // clear log.
    console.clear();

    // log linguee's data.
    logData(ankiEngNote);

    console.log(`\n-----------------------\n`);

    // choose translation.
    ankiEngNote = await chooseTranslation.call(ankiEngNote);

    // clear log.
    console.clear();

    // get example.
    ankiEngNote = await chooseExample.call(ankiEngNote);

    // save card in Anki.
    await addCard.call(ankiEngNote, "ankiEng", "ANKIENG_NOTE");
} else {
    // clear log.
    console.clear();
}
