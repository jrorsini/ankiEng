import { fetchTranslations, fetchExamples } from "./scrapeReverso.js";

let type, ipa, spelling, definition, translations, examples;

async function scrape(userInput) {
    translations = await fetchTranslations(userInput);
    examples = await fetchExamples(userInput);
    console.log(translations);
    console.log(examples);
}

scrape("clear");
