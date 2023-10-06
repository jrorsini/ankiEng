// to implement -> https://dictionaryapi.dev
// https://github.com/fega/wordreference-api
// https://dictionaryapi.com/products/index

/**
 * TO TEST
 * wunderking
 * oxpecker (undefined example)
 */

import { getDictData, getWRefData } from "./utility/api.js";
import { logSearchResults } from "./utility/log.js";
import {
    chooseTranslation,
    chooseDefinition,
    chooseTranslationType,
    chooseNoteType,
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
ankiEngNote = await getWRefData.call(ankiEngNote);

// get dictionary.com's data
ankiEngNote = await getDictData.call(ankiEngNote);

if (ankiEngNote.translations.length > 0) {
    // clear log.
    console.clear();

    ankiEngNote.fromTypes.length > 1
        ? (ankiEngNote = await chooseTranslationType.call(ankiEngNote))
        : delete ankiEngNote.fromTypes;

    // logging search results
    logSearchResults.call(ankiEngNote);

    console.log(`\n`);

    // choose which translation to keep
    ankiEngNote = await chooseTranslation.call(ankiEngNote);

    // clear log.
    console.clear();

    // choose a definition to keep
    if (ankiEngNote.definitions) {
        ankiEngNote = await chooseDefinition.call(ankiEngNote);
    } else {
        ankiEngNote["definition"] = "";
        delete ankiEngNote.definitions;
    }

    ankiEngNote["word"] = ankiEngNote.from;

    ankiEngNote["translation"] = ankiEngNote.to;

    ankiEngNote["example_en"] = ankiEngNote.example.from
        ? ankiEngNote.example.from
        : "";

    ankiEngNote["example_fr"] = ankiEngNote.example.to
        ? ankiEngNote.example.to
        : "";

    delete ankiEngNote.from;
    delete ankiEngNote.example;
    delete ankiEngNote.to;

    console.clear();

    // choose which note type to save card to.
    const noteTypes = await chooseNoteType();

    // save card in Anki.
    for (let i = 0; i < noteTypes.length; i++) {
        await addCard.call(ankiEngNote, `lang - 🇺🇸 ankiEng`, noteTypes[i]);
    }
} else {
    // clear log.
    console.clear();
}
