import chalk from "chalk";
import { typeColor } from "./global.js";

/**
 * log the entire content of the searched word
 * @param {String} userInput - to log
 * @param {Array} ipas - to log
 * @param {Array} spellings - to log
 * @param {Array} definitions - to log
 * @param {Array} translations - to log
 * @param {Array} examples - to log
 */
export function logWordContent(
    userInput,
    ipas,
    pronunciation,
    definitions,
    translations,
    examples
) {
    const log = console.log;

    log("\n\t\t" + chalk.yellow.bold.underline(`WORD:`) + ` ${userInput}`);

    // IPA & PRONUNCIATION
    if (ipas)
        log(
            "\n\t" +
                chalk.yellow.bold.underline(`IPA:`) +
                ` ${ipas}` +
                "   |   " +
                chalk.yellow.bold.underline(`SPELLING:`) +
                ` ${pronunciation}\n`
        );

    // DEFINITION
    console.log(definitions);
    if (definitions)
        definitions.map((e) => {
            const wordType = e.split(" | ")[0];
            log(
                "\t" +
                    chalk
                        .hex(typeColor[wordType])
                        .inverse(` ${wordType.toUpperCase()} `) +
                    chalk.hex(typeColor[wordType]).bold(` ${e.split(" | ")[1]}`)
            );
        });

    // TRANSLATION
    log("\n\t" + chalk.yellow.bold.underline(`TRANSLATIONS:`));
    log(
        "\n\t" +
            chalk.bold(
                `${translations
                    .map((line, index) =>
                        (index + 1) % 4 === 0 ? line + "\n\t" : line + " - "
                    )
                    .join("")
                    .slice(0, -2)}`
            ) +
            "\n"
    );

    // EXAMPLES
    log("\t" + chalk.yellow.bold.underline(`EXAMPLES:`) + "\n");
    examples.slice(0, 5).map((e) => {
        log(`\t${e.source.replace(userInput, chalk.bold.red(userInput))}`);
        log(`\t${e.target}\n`);
    });
    // examples.map((e) => {
    //     const sourceOffset = e.source_phrases[0].offset;
    //     const sourceLength = e.source_phrases[0].length;
    //     const sourcePhrase = e.source_phrases[0].phrase;

    //     const targetOffset = e.target_phrases[0].offset;
    //     const targetLength = e.target_phrases[0].length;
    //     const targetPhrase = e.target_phrases[0].phrase;
    //     log(
    //         `\t${e.source.slice(0, sourceOffset)}` +
    //             chalk.red.bold.underline(sourcePhrase) +
    //             `${e.source.slice(
    //                 sourceOffset + sourceLength,
    //                 e.source.length
    //             )}\n\t${e.target.slice(0, targetOffset)}` +
    //             chalk.cyan.bold.underline(targetPhrase) +
    //             `${e.target.slice(
    //                 targetOffset + targetLength,
    //                 e.target.length
    //             )}\n`
    //     );
    // });
}
