import {
    fetchDictionaryBodyResponse,
    fetchThesaurusBodyResponse,
    fetchReversoResponse,
    fetchIPAs,
    fetchSpellings,
    fetchDefinitions,
    fetchTranslations,
    fetchExamples,
} from "./utility/scrapeFuncs.js";

import {
    askWhatWordToEnter,
    whichIPA,
    whichExample,
    whichDefinition,
    whichSpelling,
    whichTranslation,
} from "./prompt.js";

async function scrape(userInput) {
    const dictionaryRes = await fetchDictionaryBodyResponse(userInput);
    const thesaurusRes = await fetchThesaurusBodyResponse(userInput);
    const reversoRes = await fetchReversoResponse(userInput);

    const ipas = fetchIPAs(dictionaryRes);
    const spellings = fetchSpellings(dictionaryRes);
    const definitions = fetchDefinitions(thesaurusRes);
    const translations = fetchTranslations(reversoRes);
    const examples = fetchExamples(reversoRes);

    return { userInput, ipas, spellings, definitions, translations, examples };
}

const word = await askWhatWordToEnter();
let { userInput, ipas, spellings, definitions, translations, examples } =
    await scrape(word);

const ipa = ipas.length > 1 ? await whichIPA(ipas) : ipas[0];

const spelling =
    spellings.length > 1 ? await whichSpelling(spellings) : spellings[0];

const definition =
    definitions.length > 1
        ? await whichDefinition(definitions)
        : definitions[0];

const translation =
    translations.length > 1
        ? await whichTranslation(translations)
        : translations[0];

const example =
    examples.length > 1 ? await whichExample(examples) : examples[0];

console.log(
    `${definition.split("|")[0]};${userInput};${ipa};${spelling};${
        definition.split("|")[1]
    };${translation}`
);
