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

        let ipa, spelling, definition, translation, example;

        // IPA
        try {
            ipa = ipas.length > 1 ? await whichIPA(ipas) : ipas[0];
        } catch (err) {
            console.log(err);
        }

        // SPELLING
        try {
            spelling =
                spellings.length > 1
                    ? await whichSpelling(spellings)
                    : spellings[0];
        } catch (err) {
            console.log(err);
        }

        logExamples(examples);

        // EXAMPLE
        if (await askIfUserWantExamples()) {
            try {
                example =
                    examples.length > 1
                        ? await whichExample(examples)
                        : examples[0];
            } catch (error) {
                console.log(error);
            }
        }

        // DEFINITION
        translation = await whichDefinition(definitions);

        // log definitions
        // try {
        //     definition =
        //         definitions.length > 1
        //             ? await whichDefinition(definitions)
        //             : definitions[0];
        // } catch (error) {
        //     console.log(error);
        // }

        // TRANSLATION
        translation = await whichTranslation(translations);

        const newWordCard = `${userInput};${ipa};${spelling};${translation}`;

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

        // } else {
        //     console.log("file doesn't exist");
        // }

        // console.log(definitions);
        // try {
        //     example =
        //         examples.length > 1
        //             ? await whichExample(examples)
        //             : examples[0];
        // } catch (error) {
        //     console.log(error);
        // }

        // try {
        //     definition =
        //         definitions.length > 1
        //             ? await whichDefinition(definitions)
        //             : definitions[0];
        // } catch (error) {
        //     console.log(error);
        // }

        // const newWordCard = `${
        //     definition.split(" | ")[0]
        // };${userInput};${ipa};${spelling};${
        //     definition.split(" | ")[1]
        // };${translation}`;
        // const fileName = "ankiTest.txt";
        // if (fs.existsSync(fileName)) {
        //     const fileContent = fs.readFileSync(fileName, "utf8");
        //     console.log(fileContent);
        //     if (fileContent.includes(newWordCard)) {
        //         console.log(
        //             `\nThe word ` +
        //                 chalk.yellow.bold(`"${newWordCard.split(";")[1]}"`) +
        //                 ` with the ` +
        //                 chalk.underline.bold(`same content`) +
        //                 ` already exists in file\n`
        //         );
        //     } else {
        //     }
        // const fileContent = await getFileContent();
        // if (fileContent.includes(newWordCard)) {
        //     console.log(
        //         `The sentence "${
        //             newWordCard.split(";")[1]
        //         }" already exists in file`
        //     );
        // } else {
        // }
        // const WordCard =
        //     fileContent.trim() === ""
        //         ? newWordCard
        //         : fileContent + "\n" + newWordCard;
        // console.log(WordCard);
        // try {
        //     await saveContentToFile(WordCard);
        //     console.log("File saved");
        // } catch (err) {
        //     console.error(`Failed to save data`);
        // }
        // } else {
        //     console.log("file doesn't exist");
        // }
    } else {
        console.log("No input");
        break;
    }
}
