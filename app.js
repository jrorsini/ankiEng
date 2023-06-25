import {
    getExamples,
    getSynonyms,
    getTranslations,
    getDictionaryContent,
} from "./utility/api.js";
import { logWordContent } from "./utility/log.js";
import { chooseExample, chooseTranslation, chooseSynonyms } from "./prompt.js";

import axios from "axios";
import { addCard } from "./anki.js";
import cheerio from "cheerio";

console.clear();

const usrInput = process.argv.slice(2).join(" ").toLowerCase().trim();

console.log(`loading "${usrInput}"`);

// const body = await axios.get(`https://www.dictionary.com/browse/${usrInput}`);
// let $ = cheerio.load(body.data);
// console.log($(`[data-type="pronunciation-text"]`).text());

const ankiEngNote = { word: usrInput };

await getDictionaryContent.call(ankiEngNote);
await getSynonyms.call(ankiEngNote);
await getTranslations.call(ankiEngNote);
await getExamples.call(ankiEngNote);

// console.log(ankiEngNote);

// const ankiEngNote = await mainScrape(usrInput);

logWordContent.call(ankiEngNote);

ankiEngNote.translations && (await chooseTranslation.call(ankiEngNote));
ankiEngNote.synonyms && (await chooseSynonyms.call(ankiEngNote));
ankiEngNote.examples && (await chooseExample.call(ankiEngNote));

console.log(ankiEngNote);

// ADD ANKI CARD
await addCard.call(ankiEngNote);
