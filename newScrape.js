import {
    fetchTranslations,
    fetchExamples,
    fetchIPAs,
    fetchSpellings,
    fetchTypes,
} from "./scrapeReverso.js";

let type, ipa, spellings, definition, translations, examples;

async function scrape(userInput) {
    translations = await fetchTranslations(userInput);
    examples = await fetchExamples(userInput);
    ipa = await fetchIPAs(userInput);
    spellings = await fetchSpellings(userInput);
    type = await fetchTypes("reedy");
    console.log(type);
}

scrape("clear");
