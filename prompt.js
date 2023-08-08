import inquirer from "inquirer";
import chalk from "chalk";
import { typeColor } from "./utility/global.js";
import { getClosestMatchingWord, getMatchingWord } from "./utility/log.js";

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

export async function chooseLingueeTranslation() {
    const translationsArr = this.translations.map((e) => e.translation);
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "translation",
            message: `Which ${chalk.underline.bold.yellow("translation")} ?`,
            choices: translationsArr,
        },
    ]);
    const translation = this.translations.find(
        (e) => e["translation"] === answers.translation
    );

    delete this.translations;
    return { ...this, ...translation };
}

export async function chooseLingueeExample() {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "example",
            message: `Which ${chalk.underline.bold.yellow("example")} ?`,
            choices: this.examples.map((e) => {
                const en_match = getClosestMatchingWord(this.word, e.en);
                const fr_match = getClosestMatchingWord(this.translation, e.fr);
                const en_ex = e.en.replace(en_match, chalk.bold.red(en_match));
                const fr_ex = e.fr.replace(fr_match, chalk.bold.red(fr_match));
                return `${en_ex} | ${fr_ex}`;
            }),
        },
    ]);

    delete this.examples;
    return {
        ...this,
        example_en: JSON.stringify(answers.example.split(" | ")[0])
            .replace(/\\\w+\d+\w+\[\d+\w+\\\w+\d+\w+\[\d+\w/gi, "|")
            .slice(1, -1),
        example_fr: JSON.stringify(answers.example.split(" | ")[1])
            .replace(/\\\w+\d+\w+\[\d+\w+\\\w+\d+\w+\[\d+\w/gi, "|")
            .slice(1, -1),
    };
}

/**
 * Asks which Example to choose
 * @param {Array} examples - Examples to choose from
 * @returns {String} the choosen Example
 */
export async function chooseExample() {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "example",
            message: `Which ${chalk.underline.bold.yellow("example")} ?`,
            choices: this.examples.map((e) => {
                const trslt2Rep = getMatchingWord(
                    this.translations,
                    e.fr.toLowerCase()
                );
                return `${e.en.replace(
                    this.word,
                    chalk.bold.red(this.word)
                )} | ${e.fr
                    .toLowerCase()
                    .replace(trslt2Rep, chalk.bold.red(trslt2Rep))}`;
            }),
        },
    ]);

    this.example_en = JSON.stringify(answers.example.split(" | ")[0])
        .replace(/\\\w+\d+\w+\[\d+\w+\\\w+\d+\w+\[\d+\w/gi, "|")
        .slice(1, -1);

    this.example_fr = JSON.stringify(answers.example.split(" | ")[1])
        .replace(/\\\w+\d+\w+\[\d+\w+\\\w+\d+\w+\[\d+\w/gi, "|")
        .slice(1, -1);

    delete this.examples;
    delete this.translations;

    return this;
}
