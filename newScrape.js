import {
    fetchDictionaryBodyResponse,
    fetchTranslations,
    fetchExamples,
    fetchIPAs,
    fetchSpellings,
    fetchTypes,
} from "./scrapeReverso.js";

let type, ipa, spellings, definition, translations, examples;

async function scrape(userInput) {
    const dictionaryRes = await fetchDictionaryBodyResponse(userInput);

    type = fetchTypes(userInput, dictionaryRes);
    ipa = fetchIPAs(dictionaryRes);
    spellings = fetchSpellings(dictionaryRes);
    translations = await fetchTranslations(userInput);
    examples = await fetchExamples(userInput);

    console.log(type);
    console.log(ipa);
    console.log(spellings);
    console.log(translations);
    console.log(examples);
}

scrape("clear");
