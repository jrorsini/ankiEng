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

export async function inquireTag() {
    // choisir le tag associé.
    // si c'est un episode dbz ou conan il est automatiquement associé.
    const jpTagsArr = ['news', 'podcast', 'none', 'dbz', 'detective_conan'];
    let tags = [];
    const { tag } = await inquirer.prompt([
        {
            type: 'list',
            name: 'tag',
            message: `Quels tag ?`,
            choices: jpTagsArr,
        },
    ]);
    let secondaryTag = '';
    tags.push(tag);

    if (tag === 'news') {
        tags.push('tbs_news_dig');
    }

    return tags;
    // let detectiveConanLinkEpisodeMap = { '': '69' };
    // let DbzLinkEpisodeMap = { '': '69' };
}

export async function inquireSourceLink() {
    const { sourceLink } = await inquirer.prompt([
        {
            type: 'input',
            name: 'sourceLink',
            message: `Youtube link :`,
        },
    ]);

    console.log(
        sourceLink.trim() !== ''
            ? `✅ link received`
            : 'You must paste a youtube link'
    );
    return sourceLink;
}

export async function inquireSourceTranscript() {
    const { source_transcript } = await inquirer.prompt([
        {
            type: 'input',
            name: 'source_transcript',
            message: `Transcript :`,
        },
    ]);

    console.log(
        source_transcript.trim() !== '' ? `✅ transcript received` : '👍'
    );
    return source_transcript;
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
        translationObject.reading_romaji = answers.translation.split(' - ')[3];
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
