// to implement -> https://dictionaryapi.dev
// https://github.com/fega/wordreference-api
// https://dictionaryapi.com/products/index

import {
    fuseReversoAndLinguee,
    getDictionary,
    getLingueeData,
    getReversoExamples,
    getReversoTranslations,
    getWordReference,
} from "./utility/api.js";
import {
    getClosestMatchingWord,
    logData,
    logLingueeData,
    logReversoData,
} from "./utility/log.js";
import {
    chooseTranslation,
    chooseExample,
    chooseDefinition,
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

// get wordreference.com's data
ankiEngNote = await getWordReference.call(ankiEngNote);

/**
// instanciate reverso object.
let reverso_data = {};

// added translations from Reverso
reverso_data = await getReversoTranslations.call(
    reverso_data,
    ankiEngNote.word
);

// added examples from Reverso
reverso_data = await getReversoExamples.call(reverso_data, ankiEngNote.word);

// get linguee's data
ankiEngNote = await getLingueeData.call(ankiEngNote);

// fuse Reverso and Linguee's definitions and examples.
ankiEngNote = fuseReversoAndLinguee(ankiEngNote, reverso_data);

// get dictionary.com's data
ankiEngNote = await getDictionary.call(ankiEngNote);


if (ankiEngNote !== undefined && ankiEngNote.translations.length > 0) {
    logData(ankiEngNote);

    // log line separator
    console.log(`\n-----------------------\n`);

    // choose definition.
    if (ankiEngNote.definitions) {
        ankiEngNote = await chooseDefinition.call(ankiEngNote);

        // clear log.
        console.clear();
    }

    // choose translation.
    if (ankiEngNote.translations) {
        ankiEngNote = await chooseTranslation.call(ankiEngNote);

        // clear log.
        console.clear();
    }

    // get example.
    if (ankiEngNote.examples) {
        ankiEngNote = await chooseExample.call(ankiEngNote);

        // clear log.
        console.clear();
    }

    // save card in Anki.
    await addCard.call(ankiEngNote, "lang - 🇺🇸 ankiEng", "ANKIENG_NOTE");
} else {
    // clear log.
    console.clear();
}

 */
