import {
    fetchDictionaryBodyResponse,
    fetchThesaurusBodyResponse,
    fetchReversoResponse,
    fetchIPAs,
    fetchSpellings,
    fetchDefinitions,
    fetchTranslations,
    fetchExamples,
    fetchTypes,
} from "./utility/scrapeFuncs.js";

import { logWordContent } from "./utility/log.js";

import {
    askWhatWordToEnter,
    whichIPA,
    whichExample,
    whichDefinition,
    whichSpelling,
    whichTranslation,
    askIfUserWantExamples,
} from "./prompt.js";

import { addCard } from "./anki.js";

async function scrape(userInput) {
    let dictionaryRes;
    let thesaurusRes;
    let reversoRes;
    dictionaryRes = await fetchDictionaryBodyResponse(userInput);
    thesaurusRes = await fetchThesaurusBodyResponse(userInput);
    reversoRes = await fetchReversoResponse(userInput);

    const ipas = dictionaryRes ? fetchIPAs(dictionaryRes) : false;
    const types = dictionaryRes ? fetchTypes(userInput, dictionaryRes) : false;
    const spellings = dictionaryRes ? fetchSpellings(dictionaryRes) : false;
    const definitions = thesaurusRes
        ? fetchDefinitions(thesaurusRes, types)
        : false;
    const translations = fetchTranslations(reversoRes);
    const examples = fetchExamples(reversoRes);

    return {
        userInput,
        ipas,
        spellings,
        definitions,
        translations,
        examples,
    };
}

const log = console.log;
while (true) {
    console.log("\n");
    const word = await askWhatWordToEnter();

    if (word.length > 0) {
        let {
            userInput,
            ipas,
            spellings,
            definitions,
            translations,
            examples,
        } = await scrape(word);

        logWordContent(
            userInput,
            ipas,
            spellings,
            definitions,
            translations,
            examples
        );

        // IPA
        let ipa = ipas.length > 1 ? await whichIPA(ipas) : ipas[0] || ipas;

        // SPELLING
        let spelling =
            spellings.length > 1
                ? await whichSpelling(spellings)
                : spellings[0] || spellings;

        // DEFINITION
        let { typ, def } =
            definitions.length > 1
                ? await whichDefinition(definitions)
                : definitions[0] || definitions;

        // EXAMPLE
        let example;
        if (examples.length > 0) {
            // logWordContent(examples);
            if (await askIfUserWantExamples()) {
                example =
                    examples.length > 1
                        ? await whichExample(examples)
                        : examples[0];
            }
        }

        // TRANSLATION
        let translation = await whichTranslation(translations);

        // ADD CARD
        await addCard(userInput, typ, spelling, ipa, def, example, translation);
    } else {
        log("No input");
        break;
    }
}
