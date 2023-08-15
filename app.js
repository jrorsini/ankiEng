import { getLingueeData } from "./utility/api.js";
import { logLingueeData } from "./utility/log.js";
import { chooseLingueeTranslation, chooseLingueeExample } from "./prompt.js";

import { addCard } from "./anki.js";

// clear log.
console.clear();

// retrieve user input
const usrInput = process.argv.slice(2).join(" ").toLowerCase().trim();

// log user input loading
console.log(`loading "${usrInput}"`);

// create Anki note object.
let ankiEngNote = { word: usrInput };

// get linguee's data
ankiEngNote = await getLingueeData.call(ankiEngNote);

// checks if linguee's api response isn't undefined.
if (ankiEngNote !== undefined && ankiEngNote.translations.length > 0) {
    // clear log.
    console.clear();

    // clear linguee's data.
    logLingueeData(ankiEngNote);

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
}
