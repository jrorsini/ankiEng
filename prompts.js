import inquirer from 'inquirer';
import chalk from 'chalk';
import {
    filterByTranslationType,
    filterByDefinitionType,
} from './utils/translationTypes.js';

// return an array of distinct translation types such as nouns, verbs, etc...
function createTranslationTypesArray(translations) {
    return [...new Set(fetchedTranslations.map((e) => e.fromType))].filter(
        (e) => e !== ''
    );
}

export async function inquireJapaneseTranslation(fetchedTranslations) {
    let res = {
        kanji: '',
        hiragana: '',
        romaji: '',
        translation: '',
    };
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'translation',
            message: `Which ${chalk.underline.bold.yellow('translation')}?`,
            choices: fetchedTranslations,
        },
    ]);

    if (answers.translation) {
        res.kanji = answers.translation.split(' - ')[0];
        res.hiragana = answers.translation.split(' - ')[2];
        res.romaji = answers.translation.split(' - ')[3];
        res.translation = answers.translation.split(' - ')[1];
    }

    return res;
}

export async function inquireTranslationType(translations) {
    const translationTypesArr = createTranslationTypesArray(translations);

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'translation',
            message: `Which ${chalk.underline.bold.yellow(
                'translation type'
            )}?`,
            choices: translationTypesArr,
        },
    ]);

    return answers.translation;
}

export async function chooseReversoTranslation(fetchedReversoTranslation) {
    const answers = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'reversoTranslation',
            message: `Which ${chalk.underline.bold.yellow('definitions')} ?`,
            choices: fetchedReversoTranslation,
        },
    ]);

    return answers.reversoTranslation.join(', ');
}

export async function chooseJapaneseReversoTranslation(
    fetchedReversoTranslation
) {
    const answers = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'reversoTranslation',
            message: `Which ${chalk.underline.bold.yellow('definitions')} ?`,
            choices: fetchedReversoTranslation,
        },
    ]);

    return answers.reversoTranslation.join(', ');
}

export async function inquireTranslation(fetchedTranslations) {
    const list_translations = fetchedTranslations.map((e) => `${e.to}`);

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'translation',
            message: `Which ${chalk.underline.bold.yellow(
                'translation type'
            )}?`,
            choices: list_translations, //`(${fetchedTranslations.fromType}) ${fetchedTranslations.from} | ${fetchedTranslations.to}`,
        },
    ]);

    return fetchedTranslations.filter((e) => e.to === answers.translation)[0];
}
