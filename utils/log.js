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

const log = console.log;

export function logSearchResults() {
    // clear log
    console.clear();

    // declare search header
    const searchHeader = `RESULTS FOR ${chalk.yellow.underline.bold(
        this.word.toUpperCase()
    )}`;

    // log search header
    log(searchHeader);

    // add underline based on search header's lenght
    log(`-`.repeat(searchHeader.length - 28));

    // log translations
    logTranslations(this.translations);

    // log definitions
    logDefinitions(this.definitions);
}

export function logTranslations(translations) {
    log(`\n\t${chalk.bgWhiteBright.black.bold(` TRANSLATIONS & EXAMPLES `)}`);
    translations.map((e) => {
        log(
            `\n${chalk.bgRed.bold.white(
                ` ${e.fromType.toUpperCase()} `
            )} ${chalk.bold.red(e.from)}  ~  ${chalk.bgCyan.bold.white(
                ` ${e.toType.toUpperCase()} `
            )} ${chalk.bold.cyan(e.to)}`
        );

        if (e.example.from) {
            const en_match = getClosestMatchingWord(e.from, e.example.from);
            const en_ex = e.example.from.replace(
                en_match,
                chalk.bold.underline.red(en_match)
            );
            log(`\n\t${en_ex}`);
        }
        if (e.example.to) {
            const fr_match = getClosestMatchingWord(e.to, e.example.to);
            const fr_ex = e.example.to.replace(
                fr_match,
                chalk.bold.underline.cyan(fr_match)
            );
            log(`\t${fr_ex}`);
        }
    });
}

export function logDefinitions(definitions) {
    if (definitions) {
        log(`\n\t${chalk.bgWhiteBright.black.bold(` DEFINITIONS `)}`);

        definitions.map((e) => {
            const typ = e.split(" - ")[0];
            const def = e.split(" - ")[1];
            console.log(`\n${chalk.bgGray(` ${typ.toUpperCase()} `)} : ${def}`);
        });
    }
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
    console.log(`LINGUEE Results for ${data.word}\n`);
    data.translations.map((e) => {
        const translation = e.translation;
        console.log(
            `\n${chalk.bgGray(
                ` ${e.type.toUpperCase()} `
            )}: ${chalk.green.underline(translation)}`
        );
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

export function logReversoData(data) {
    console.log(`REVERSO Results for ${data.word}`);
    data.translations.map((e) => {
        const translation = e.translation;
        console.log(
            `\n\t${chalk.green.bold.underline(translation.toUpperCase())}`
        );
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

export function logDataObsolete(data) {
    console.clear();

    console.log(
        `RESULTS FOR ${chalk.yellow.underline.bold(data.word.toUpperCase())}\n`
    );

    if (data.ipa) {
        console.log(`\n\t ${chalk.bgRed.bold(" IPA ")}`);

        console.log(data.ipa);
    }

    // DEFINITION
    if (data.definitions) {
        console.log(`\n\t ${chalk.bgRed.bold(" DEFINITIONS ")}`);

        data.definitions.map((e) => {
            const typ = e.split(" - ")[0];
            const def = e.split(" - ")[1];
            console.log(`\n${chalk.bgGray(` ${typ.toUpperCase()} `)} : ${def}`);
        });
    }

    // TRANSLATION
    if (data.translations) {
        console.log(`\n\t ${chalk.bgRed.bold(" TRANSLATIONS ")}`);

        data.translations.map((e) => {
            const translation = e.translation;
            console.log(
                `\n${
                    e.type && `${chalk.bgGray(` ${e.type.toUpperCase()} `)}:`
                } ${chalk.green.underline.bold(translation)}`
            );
            e.examples
                .sort((a, b) => a.en.length - b.en.length)
                .map((e) => {
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
                })
                .slice(0, 5);
            return e;
        });
    }
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
