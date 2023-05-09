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
    logExamples,
} from "./utility/scrapeFuncs.js";

import {
    saveContentToFile,
    fileExists,
    getFileContent,
} from "./utility/saveWordCardToFile.js";

import {
    askWhatWordToEnter,
    whichIPA,
    whichExample,
    whichDefinition,
    whichSpelling,
    whichTranslation,
    askIfUserWantExamples,
    askIfUserWantsMoreTranslation,
} from "./prompt.js";

import fs from "fs";
import chalk from "chalk";

async function scrape(userInput) {
    let dictionaryRes;
    let thesaurusRes;
    let reversoRes;
    dictionaryRes = await fetchDictionaryBodyResponse(userInput);
    thesaurusRes = await fetchThesaurusBodyResponse(userInput);
    reversoRes = await fetchReversoResponse(userInput);

    const ipas = fetchIPAs(dictionaryRes);
    const types = fetchTypes(userInput, dictionaryRes);
    const spellings = fetchSpellings(dictionaryRes);
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

        let ipa, spelling, translation, example;

        // IPA
        ipa = ipas.length > 1 ? await whichIPA(ipas) : ipas[0];

        // SPELLING
        spelling =
            spellings.length > 1
                ? await whichSpelling(spellings)
                : spellings[0];

        // DEFINITION
        let { typ, def } =
            definitions.length > 1
                ? await whichDefinition(definitions)
                : definitions[0];

        // EXAMPLE
        if (examples.length > 0) {
            logExamples(examples);
            if (await askIfUserWantExamples()) {
                example =
                    examples.length > 1
                        ? await whichExample(examples)
                        : examples[0];
            }
        }

        // TRANSLATION
        translation = await whichTranslation(translations);

        const newWordCard = `${userInput};${ipa};${spelling};${typ};${translation};${def}`;

        if (fileExists("ankiTest.txt")) {
            const fileContent = await getFileContent("ankiTest.txt");
            if (fileContent.includes(newWordCard)) {
                console.log(
                    `\nThe word ` +
                        chalk.yellow.bold(`"${newWordCard.split(";")[1]}"`) +
                        ` with the ` +
                        chalk.underline.bold(`exact SAME content`) +
                        ` already exists in file\n`
                );
            } else {
                try {
                    saveContentToFile(
                        "ankiTest.txt",
                        fileContent.trim() === ""
                            ? newWordCard
                            : fileContent + "\n" + newWordCard
                    );
                    console.log(`\n` + chalk.bold.green("File saved"));
                } catch (err) {
                    console.error(`Failed to save data`);
                }
            }
        }
    } else {
        console.log("No input");
        break;
    }
}
