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

export function logWordContent() {
    const log = console.log;
    const headLog = (str) => chalk.yellow.bold.underline(str);

    // WORD
    if (this.word) log(`\t${headLog(`WORD:`)} ${this.word}`);

    // IPA & PRONUNCIATION
    if (this.ipa)
        log(
            `\n\t${headLog(`IPA:`)} ${this.ipa}   |   ${headLog(`SPELLING:`)} ${
                this.pronunciation
            }\n`
        );

    // DEFINITION
    if (this.definitions) {
        this.definitions.map((e) => {
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
    if (this.synonyms) {
        log(
            `\n\t${headLog(`SYNONYMS:`)} ${chalk.bold(
                this.synonyms
                    .map((line, index) =>
                        (index + 1) % 6 === 0 ? `${line}\n\t` : `${line} - `
                    )
                    .join("")
                    .slice(0, -2)
            )}\n`
        );
    }

    // TRANSLATION
    if (this.translations) {
        log(`\n\t${headLog(`TRANSLATIONS:`)}`);
        log(
            `\n\t ${chalk.bold(
                `${this.translations
                    .map((line, index) =>
                        (index + 1) % 6 === 0 ? `${line}\n\t` : `${line} - `
                    )
                    .join("")
                    .slice(0, -2)}`
            )}\n`
        );
    }

    // EXAMPLES
    if (this.examples) {
        log(`\t${headLog(`EXAMPLES:`)}`);
        this.examples.slice(0, 5).map((e) => {
            const translationWordToReplace = getMatchingWord(
                this.translations,
                e.fr.toLowerCase()
            );
            log(
                `\n\t${e.en.replace(
                    this.word,
                    chalk.bold.red(this.word)
                )}\n\t${e.fr
                    .toLowerCase()
                    .replace(
                        translationWordToReplace,
                        chalk.bold.underline.cyan(translationWordToReplace)
                    )}`
            );
        });
        log("\n");
    }
}
