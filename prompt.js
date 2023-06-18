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
 * Asks which Definition to choose
 * @param {Array} definitions - Definitions to choose from
 * @returns {String} the choosen Definition
 */
export async function whichDefinition(definitions) {
    const choices = [];

    definitions.map((e) => {
        const type = e.split(" | ")[0].replace(" ", "_");
        choices.push(
            chalk.hex(typeColor[type]).inverse(` ${type.toUpperCase()} `) +
                " | " +
                e.split(" | ")[1]
        );
        return e;
    });

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "definition",
            message: "Which " + chalk.underline.bold.yellow("definition") + "?",
            choices,
        },
    ]);

    const typ = definitions
        .filter(
            (e) => e.split(" | ")[1] == answers.definition.split(" | ")[1]
        )[0]
        .split(" | ")[0];

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
            choices: this.translations,
            // choices: translations,
        },
    ]);

    this.translations = results.translation[0];

    return this;
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
