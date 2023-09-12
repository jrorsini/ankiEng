import inquirer from "inquirer";
import chalk from "chalk";
import { typeColor } from "./utility/global.js";
import { getClosestMatchingWord, getMatchingWord } from "./utility/log.js";
import {
    filterByTranslationType,
    filterByDefinitionType,
} from "./utility/translationTypes.js";

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

export async function chooseTranslationType() {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "type",
            message: `Which ${chalk.underline.bold.yellow(
                "translation type"
            )}?`,
            choices: this.fromTypes,
        },
    ]);

    delete this.fromTypes;
    return {
        ...this,
        translations: this.translations.filter((e) =>
            filterByTranslationType(e, answers.type)
        ),
        definitions: this.definitions.filter((e) =>
            filterByDefinitionType(e, answers.type)
        ),
    };
}

export async function chooseTranslation() {
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

export async function chooseDefinition() {
    const definitionsArr = this.definitions.map((e) => e.split(" - ")[1]);
    const answers = await inquirer.prompt([
        {
            type: "checkbox",
            name: "definition",
            message: `Which ${chalk.underline.bold.yellow("definitions")} ?`,
            choices: definitionsArr,
        },
    ]);

    delete this.definitions;
    return { ...this, definition: answers.definition[0] };
}

export async function chooseExample() {
    if (this.examples.length > 1) {
        const answers = await inquirer.prompt([
            {
                type: "list",
                name: "example",
                message: `Which ${chalk.underline.bold.yellow("example")} ?`,
                choices: this.examples.map((e) => {
                    const en_match = getClosestMatchingWord(this.word, e.en);
                    const fr_match = getClosestMatchingWord(
                        this.translation,
                        e.fr
                    );
                    const en_ex = e.en.replace(
                        en_match,
                        chalk.bold.red(en_match)
                    );
                    const fr_ex = e.fr.replace(
                        fr_match,
                        chalk.bold.red(fr_match)
                    );
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
    } else {
        const en = this.examples[0].en;
        const fr = this.examples[0].fr;

        delete this.examples;

        const en_match = getClosestMatchingWord(this.word, en);
        const fr_match = getClosestMatchingWord(this.translation, fr);
        const en_ex = en.replace(en_match, `|${en_match}|`);
        const fr_ex = fr.replace(fr_match, `|${fr_match}|`);

        return {
            ...this,
            example_en: en_ex,
            example_fr: fr_ex,
        };
    }
}
