import inquirer from "inquirer";
import chalk from "chalk";
import { typeColor } from "./utility/global.js";

/**
 * Asks what word to search
 * @returns {String} the word search body response scraped from thesaurus.com
 */
export async function askWhatWordToEnter() {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "word",
            message: "Enter a word to search (or press Enter to quit):",
        },
    ]);
    return answers.word.trim();
}

/**
 * Asks which IPA to choose
 * @param {Array} ipas - IPAs to choose from
 * @returns {String} the choosen IPA
 */
export async function whichIPA(ipas) {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "ipa",
            message: "Which " + chalk.underline.bold.yellow("IPA") + "?",
            choices: ipas,
        },
    ]);
    return answers.ipa;
}

/**
 * Asks which spelling to choose
 * @param {Array} spellings - IPAs to choose from
 * @returns {String} the choosen spelling
 */
export async function whichSpelling(spellings) {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "spelling",
            message: "Which " + chalk.underline.bold.yellow("spelling") + "?",
            choices: spellings,
        },
    ]);
    return answers.spelling;
}

/**
 * Asks which Definition to choose
 * @param {Array} definitions - Definitions to choose from
 * @returns {String} the choosen Definition
 */
export async function whichDefinition(definitions) {
    const choices = definitions.map((e) => {
        const type = e.split(" | ")[0].replace(" ", "_");
        console.log(type);
        return (
            chalk.hex(typeColor[type]).inverse(` ${type.toUpperCase()} `) +
            " | " +
            e.split(" | ")[1]
        );
    });
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "definition",
            message: "Which " + chalk.underline.bold.yellow("definition") + "?",
            choices,
        },
    ]);

    const typ = answers.definition.split(" | ")[0];
    const def = answers.definition.split(" | ")[1];

    return { typ, def };
}

/**
 * Asks which Tranlation to choose
 * @param {Array} translation - Tranlations to choose from
 * @returns {String} the choosen Tranlation
 */
export async function whichTranslation(translations) {
    const results = await inquirer.prompt([
        {
            type: "checkbox",
            name: "translation",
            message:
                "Which " + chalk.underline.bold.yellow("translation") + "?",
            choices: translations,
            // choices: translations,
        },
    ]);

    return results.translation;
}

/**
 * Asks if user wants examples
 * @returns {Boolean} user's answer
 */
export async function askIfUserWantExamples() {
    const answers = await inquirer.prompt([
        {
            type: "confirm",
            name: "exampleConfirmation",
            message: "Is there an example you wish to add",
        },
    ]);
    return answers.exampleConfirmation;
}

/**
 * Asks if user wants examples
 * @returns {Boolean} user's answer
 */
export async function askIfUserWantsMoreTranslation() {
    const answers = await inquirer.prompt([
        {
            type: "confirm",
            name: "translationConfirmation",
            message: `Is there one more translation you wish to add ? (press Enter if "Yes")`,
        },
    ]);
    return answers.translationConfirmation;
}

/**
 * Asks which Example to choose
 * @param {Array} examples - Examples to choose from
 * @returns {String} the choosen Example
 */
export async function whichExample(word, examples) {
    const answers = await inquirer.prompt([
        {
            type: "checkbox",
            name: "example",
            message: "Which " + chalk.underline.bold.yellow("example") + "?",
            choices: examples.map((e) =>
                e.source.replace(word, chalk.bold.red(word))
            ),
        },
    ]);
    return answers.example;
}
