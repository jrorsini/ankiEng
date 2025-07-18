import inquirer from 'inquirer';
import chalk from 'chalk';
import {
    filterByTranslationType,
    filterByDefinitionType,
} from './utils/translationTypes.js';

// return an array of distinct translation types such as nouns, verbs, etc...
function createTranslationTypesArray(translations) {
    return [...new Set(translations.map((e) => e.fromType))].filter(
        (e) => e !== ''
    );
}

// translation format : 食生活 - habitudes alimentaires - しょくせいかつ - shokuseikatsu
export async function inquireJapaneseTranslation(fetchedTranslations) {
    let translationObject = {
        kanji: '',
        reading: '',
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
        translationObject.kanji = answers.translation.split(' - ')[0];
        translationObject.reading = answers.translation.split(' - ')[2];
        translationObject.romaji = answers.translation.split(' - ')[3];
        translationObject.translation = answers.translation.split(' - ')[1];
    }

    return translationObject;
}

export async function inquireTranslationType(translations) {
    const translationTypesArr = createTranslationTypesArray(translations);

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'translationType',
            message: `Which ${chalk.underline.bold.yellow(
                'translation type'
            )}?`,
            choices: translationTypesArr,
        },
    ]);

    return answers.translationType;
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
