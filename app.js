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
    logWordContent,
} from "./utility/scrapeFuncs.js";

import {
    askWhatWordToEnter,
    whichIPA,
    whichExample,
    whichDefinition,
    whichSpelling,
    whichTranslation,
    askIfUserWantExamples,
    askIfUserWantsMoreTranslation,
    fullPrompt,
} from "./prompt.js";

async function scrape(userInput) {
    let dictionaryRes;
    let thesaurusRes;
    let reversoRes;
    dictionaryRes = await fetchDictionaryBodyResponse(userInput);
    thesaurusRes = await fetchThesaurusBodyResponse(userInput);
    reversoRes = await fetchReversoResponse(userInput);

    const ipas = dictionaryRes ? fetchIPAs(dictionaryRes) : "";
    const types = dictionaryRes ? fetchTypes(userInput, dictionaryRes) : "";
    const spellings = dictionaryRes ? fetchSpellings(dictionaryRes) : "";
    const definitions = fetchDefinitions(thesaurusRes, types);
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

        // await fullPrompt(translations);

        // IPA
        let ipa = ipas.length > 1 ? await whichIPA(ipas) : ipas[0];

        // SPELLING
        let spelling =
            spellings.length > 1
                ? await whichSpelling(spellings)
                : spellings[0];

        // DEFINITION
        let { typ, def } =
            definitions.length > 1
                ? await whichDefinition(definitions)
                : definitions[0];

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

        const newWordCard = `${userInput};${ipa};${spelling};${typ};${translation};${def}`;
    } else {
        log("No input");
        break;
    }
}
