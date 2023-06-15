import chalk from "chalk";
import { typeColor } from "./global.js";

export function getMatchingWord(wordList, sentence) {
    for (let i = 0; i < wordList.length; i++) {
        const word = wordList[i];
        const regex = new RegExp(`/${word}/`, "i");

        if (sentence.match(word)) {
            return word; // Return the matching word
        }
    }

    return null; // No matching word found
}

export function logWordContent(object) {
    const log = console.log;

    // WORD
    if (object.word)
        log(
            "\n\t\t" + chalk.yellow.bold.underline(`WORD:`) + ` ${object.word}`
        );

    // IPA & PRONUNCIATION
    if (object.ipa)
        log(
            "\n\t" +
                chalk.yellow.bold.underline(`IPA:`) +
                ` ${object.ipa}` +
                "   |   " +
                chalk.yellow.bold.underline(`SPELLING:`) +
                ` ${object.pronunciation}\n`
        );

    // DEFINITION
    if (object.definitions) {
        object.definitions.map((e) => {
            const wordType = e.split(" | ")[0];
            log(
                "\t" +
                    chalk
                        .hex(typeColor[wordType])
                        .inverse(` ${wordType.toUpperCase()} `) +
                    chalk.hex(typeColor[wordType]).bold(` ${e.split(" | ")[1]}`)
            );
        });
    }

    // SYNONYMS
    if (object.synonyms) {
        log("\n\t" + chalk.yellow.bold.underline(`SYNONYMS:`));
        log("\n\t" + chalk.bold(`${object.synonyms.join(" - ")}`) + "\n");
    }

    // TRANSLATION
    if (object.translations) {
        log("\n\t" + chalk.yellow.bold.underline(`TRANSLATIONS:`));
        log(
            "\n\t" +
                chalk.bold(
                    `${object.translations
                        .map((line, index) =>
                            (index + 1) % 4 === 0 ? line + "\n\t" : line + " - "
                        )
                        .join("")
                        .slice(0, -2)}`
                ) +
                "\n"
        );
    }

    // EXAMPLES
    if (object.examples) {
        log("\t" + chalk.yellow.bold.underline(`EXAMPLES:`) + "\n");
        object.examples.slice(0, 8).map((e) => {
            const translationWordToReplace = getMatchingWord(
                object.translations,
                e.fr.toLowerCase()
            );
            log(
                `\n\t${e.en.replace(
                    object.word,
                    chalk.bold.red(object.word)
                )}\n\t${e.fr
                    .toLowerCase()
                    .replace(
                        translationWordToReplace,
                        chalk.bold.underline.cyan(translationWordToReplace)
                    )}`
            );
        });
    }
}
