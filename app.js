import { getLingueeData } from "./utility/api.js";
import { logWordContent, logLingueeData } from "./utility/log.js";
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
    console.log(ankiEngNote);
    if (ankiEngNote.examples.length > 1) {
        ankiEngNote = await chooseLingueeExample.call(ankiEngNote);
    }
    console.log(ankiEngNote);
}

// ADD ANKI CARD
// await addCard.call(ankiEngNote, "ankiEng", "ANKIENG_NOTE");
