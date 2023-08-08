import chalk from "chalk";
import { typeColor } from "./global.js";
import natural from "natural";

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

export function getClosestMatchingWord(wordToMatch, sentence) {
    const wordsInSentence = sentence.split(" ");

    let closestMatch = null;
    let minDistance = Infinity;

    wordsInSentence.forEach((word) => {
        const distance = natural.LevenshteinDistance(wordToMatch, word);
        if (distance < minDistance) {
            minDistance = distance;
            closestMatch = word;
        }
    });

    return closestMatch;
}

export function logLingueeData(data) {
    console.log(`RESULTS for ${data.word}\n`);
    data.translations.map((e) => {
        console.log(
            `\n${chalk.bgGray(
                ` ${e.type.toUpperCase()} `
            )}: ${chalk.green.underline(e.translation)}`
        );
        const translation = e.translation;
        e.examples.map((e) => {
            const en_match = getClosestMatchingWord(data.word, e.en);
            const fr_match = getClosestMatchingWord(translation, e.fr);
            const en_ex = e.en.replace(
                en_match,
                chalk.bold.underline.red(en_match)
            );
            const fr_ex = e.fr.replace(
                fr_match,
                chalk.bold.underline.cyan(fr_match)
            );
            console.log(`\n\t${en_ex}\n\t${fr_ex}`);
            return e;
        });
        return e;
    });
}

export function logWordContent() {
    const log = console.log;
    const headLog = (str) => chalk.yellow.bold.underline(str);

    // WORD
    if (this.word) log(`\t${headLog(`WORD:`)} ${this.word}`);

    // IPA & PRONUNCIATION
    if (this.ipa) log(`\n\t${headLog(`IPA:`)} ${this.ipa}`);

    // DEFINITION
    if (this.definitions) {
        this.definitions.map((e) => {
            const wordType = e.type;
            log(
                "\t" +
                    chalk
                        .hex(typeColor[wordType])
                        .inverse(` ${wordType.toUpperCase()} `) +
                    chalk.hex(typeColor[wordType]).bold(` ${e.definition}`)
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
            `\n\t${chalk.bold(
                `${this.translations
                    .map((line, index) =>
                        (index + 1) % 6 === 0 ? `${line}\n\t` : `${line} - `
                    )
                    .join("")
                    .slice(0, -2)
                    .trim()}`
            )}\n`
        );
    }

    // EXAMPLES
    if (this.examples) {
        log(`\t${headLog(`EXAMPLES:`)}`);
        this.examples.slice(0, 5).map((e) => {
            const trslt2Rep = getMatchingWord(
                this.translations,
                e.fr.toLowerCase()
            );
            log(
                `\n\t${e.en.replace(
                    this.word,
                    chalk.bold.red(this.word)
                )}\n\t${e.fr
                    .toLowerCase()
                    .replace(trslt2Rep, chalk.bold.underline.cyan(trslt2Rep))}`
            );
        });
        log("\n");
    }
}
