import { getLingueeData } from "./utility/api.js";
import {
    logWordContent,
    logLingueeData,
    getClosestMatchingWord,
} from "./utility/log.js";
import { chooseLingueeTranslation, chooseLingueeExample } from "./prompt.js";

import { addCard } from "./anki.js";

console.clear();

const usrInput = process.argv.slice(2).join(" ").toLowerCase().trim();

console.log(`loading "${usrInput}"`);

let ankiEngNote = { word: usrInput };

ankiEngNote = await getLingueeData.call(ankiEngNote);

console.clear();
if (ankiEngNote.translations.length > 0) {
    logLingueeData(ankiEngNote);
    ankiEngNote = await chooseLingueeTranslation.call(ankiEngNote);
    console.clear();
    if (ankiEngNote.examples.length > 1) {
        ankiEngNote = await chooseLingueeExample.call(ankiEngNote);
    } else {
        const en = ankiEngNote.examples[0].en;
        const fr = ankiEngNote.examples[0].fr;

        delete ankiEngNote.examples;

        const en_match = getClosestMatchingWord(ankiEngNote.word, en);
        const fr_match = getClosestMatchingWord(ankiEngNote.translation, fr);
        const en_ex = en.replace(en_match, `|${en_match}|`);
        const fr_ex = fr.replace(fr_match, `|${fr_match}|`);

        ankiEngNote = {
            ...ankiEngNote,
            example_en: en_ex,
            example_fr: fr_ex,
        };
    }
    console.log(ankiEngNote);
}

// ADD ANKI CARD
// await addCard.call(ankiEngNote, "ankiEng", "ANKIENG_NOTE");
