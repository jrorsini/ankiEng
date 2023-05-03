import {
    fetchDictionaryBodyResponse,
    fetchThesaurusBodyResponse,
    fetchIPAs,
    fetchSpellings,
    fetchDefinitions,
    fetchTranslations,
    fetchExamples,
} from "./scrape.js";

let ipa, spellings, definitions, translations, examples;

async function scrape(userInput) {
    const dictionaryRes = await fetchDictionaryBodyResponse(userInput);
    const thesaurusRes = await fetchThesaurusBodyResponse(userInput);
    translations = await fetchTranslations(userInput);
    examples = await fetchExamples(userInput);

    ipa = fetchIPAs(dictionaryRes);
    spellings = fetchSpellings(dictionaryRes);

    definitions = fetchDefinitions(thesaurusRes);

    return { ipa, spellings, definitions, translations, examples };
}

const res = await scrape("clear");

console.log(res);
