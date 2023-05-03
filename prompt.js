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
 * Asks which IPA to choose
 * @param {Array} definitions - IPAs to choose from
 * @returns {String} the choosen IPA word search body response scraped from thesaurus.com
 */
export async function whichDefinitions(definitions) {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "definition",
            message: "Which Definition?",
            choices: definitions,
        },
    ]);
    return answers.definition;
}
