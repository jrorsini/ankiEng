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

const linguee_translations = await axios.get(
    `https://linguee-api.fly.dev/api/v2/translations`,
    {
        params: { query: usrInput, src: "en", dst: "fr" },
    }
);

const linguee_external_sources = await axios.get(
    `https://linguee-api.fly.dev/api/v2/external_sources`,
    {
        params: { query: usrInput, src: "en", dst: "fr" },
    }
);

const linguee_examples = await axios.get(
    `https://linguee-api.fly.dev/api/v2/examples`,
    {
        params: { query: usrInput, src: "en", dst: "fr" },
    }
);

// console.log(linguee_translations.data.map((e) => e.translations.text));
console.log(linguee_examples);

/*

const ankiEngNote = { word: usrInput };

await getDictionaryContent.call(ankiEngNote);
await getSynonyms.call(ankiEngNote);
await getTranslations.call(ankiEngNote);
await getExamples.call(ankiEngNote);

logWordContent.call(ankiEngNote);

ankiEngNote.translations && (await chooseTranslation.call(ankiEngNote));
ankiEngNote.synonyms && (await chooseSynonyms.call(ankiEngNote));
ankiEngNote.examples && (await chooseExample.call(ankiEngNote));

console.log(ankiEngNote);

// ADD ANKI CARD
await addCard.call(ankiEngNote);

 */
