import inquirer from "inquirer";

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
            message: "Which IPA?",
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
            message: "Which spelling?",
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
    console.log(definitions);
    const answers = await inquirer.prompt([
        {
            type: "rawlist",
            name: "definition",
            message: "Which definition?",
            choices: definitions,
        },
    ]);
    return answers.definition;
}

/**
 * Asks which Tranlation to choose
 * @param {Array} translation - Tranlations to choose from
 * @returns {String} the choosen Tranlation
 */
export async function whichTranslation(translations) {
    const answers = await inquirer.prompt([
        {
            type: "rawlist",
            name: "translation",
            message: "Which translation?",
            choices: translations,
        },
    ]);
    return answers.translation;
}

export async function askIfIWantExamples() {
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
 * Asks which Example to choose
 * @param {Array} examples - Examples to choose from
 * @returns {String} the choosen Example
 */
export async function whichExample(examples) {
    const answers = await inquirer.prompt([
        {
            type: "rawlist",
            name: "example",
            message: "Which example?",
            choices: examples.map((e) => e.source),
        },
    ]);
    return answers.example;
}
