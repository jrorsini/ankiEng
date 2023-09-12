// to implement -> https://dictionaryapi.dev
// https://github.com/fega/wordreference-api
// https://dictionaryapi.com/products/index

import { getDictData, getWRefData } from "./utility/api.js";
import {
    getClosestMatchingWord,
    logData,
    logLingueeData,
    logReversoData,
    logWRefTranslations,
} from "./utility/log.js";
import {
    chooseTranslation,
    chooseExample,
    chooseDefinition,
    chooseTranslationType,
} from "./prompt.js";
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

console.time("Time");
// get wordreference.com & dictionary.com's data
ankiEngNote = await getWRefData.call(ankiEngNote);
ankiEngNote = await getDictData.call(ankiEngNote);
console.timeEnd("Time");

if (ankiEngNote.translations.length > 0) {
    // clear log.
    // console.clear();

    ankiEngNote.fromTypes.length > 1
        ? (ankiEngNote = await chooseTranslationType.call(ankiEngNote))
        : delete ankiEngNote.fromTypes;

    // console.log(ankiEngNote);
    // logging translations
    logWRefTranslations(ankiEngNote);

    ankiEngNote = await chooseTranslation.call(ankiEngNote);

    // clear log.
    console.clear();

    // choose definition.
    if (ankiEngNote.definitions) {
        ankiEngNote = await chooseDefinition.call(ankiEngNote);

        // clear log.
        console.clear();
    }

    console.log(ankiEngNote);
} else {
    // clear log.
    console.clear();
}
/**

if (ankiEngNote !== undefined && ankiEngNote.translations.length > 0) {
    logData(ankiEngNote);

    // log line separator
    console.log(`\n-----------------------\n`);



    // save card in Anki.
    await addCard.call(ankiEngNote, "lang - 🇺🇸 ankiEng", "ANKIENG_NOTE");
}

 */
