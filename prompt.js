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
export async function chooseTranslation() {
    const results = await inquirer.prompt([
        {
            type: "checkbox",
            name: "translation",
            message:
                "Which " + chalk.underline.bold.yellow("translation") + "?",
            choices: this.translations,
        },
    ]);

    this.translations = results.translation[0];

    return this;
}

/**
 * Asks which Example to choose
 * @param {Array} examples - Examples to choose from
 * @returns {String} the choosen Example
 */
export async function chooseExample() {
    const answers = await inquirer.prompt([
        {
            type: "checkbox",
            name: "example",
            message: "Which " + chalk.underline.bold.yellow("example") + "?",
            choices: this.examples.map(
                (e) =>
                    `${e.en.replace(
                        this.word,
                        chalk.bold.red(this.word)
                    )} | ${e.fr.replace(this.word, chalk.bold.red(this.word))}`
            ),
        },
    ]);
    return answers.example;
}
