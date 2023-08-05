import {
    getExamples,
    getTranslations,
    getDictionaryContent,
    getLingueeData,
} from "./utility/api.js";
import { logWordContent } from "./utility/log.js";
import { chooseExample, chooseTranslation } from "./prompt.js";

import { addCard } from "./anki.js";

console.clear();

const usrInput = process.argv.slice(2).join(" ").toLowerCase().trim();

console.log(`loading "${usrInput}"`);

const ankiEngNote = { word: usrInput };

await getLingueeData.call(ankiEngNote);

// console.clear();
// logWordContent.call(ankiEngNote);

// ankiEngNote.translations && (await chooseTranslation.call(ankiEngNote));
// ankiEngNote.examples && (await chooseExample.call(ankiEngNote));

// console.log(ankiEngNote);

// ADD ANKI CARD
// await addCard.call(ankiEngNote, "ankiEng", "ANKIENG_NOTE");
