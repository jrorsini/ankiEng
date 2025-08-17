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
    let tags = [];
    const { tag } = await inquirer.prompt([
        {
            type: 'list',
            name: 'tag',
            message: `Quels tag ?`,
            choices: ['news', 'podcast', 'youtube', 'dbz', 'detective_conan'],
        },
    ]);
    let secondaryTag;
    tags.push(tag);

    if (tag === 'news') {
        secondaryTag = await inquirer.prompt([
            {
                type: 'list',
                name: 'tag',
                message: `Quel News ?`,
                choices: [
                    'ANNnewsCH',
                    'InsideEdition',
                    'RealTimeWithBillMaher',
                    'ABC7',
                    'ABC News',
                    'SBSnews6',
                    'MSNBC',
                    'tbs_news_dig',
                ],
            },
        ]);
        tags.push(secondaryTag.tag);
    }
    if (tag === 'podcast') {
        secondaryTag = await inquirer.prompt([
            {
                type: 'list',
                name: 'tag',
                message: `Quel podcast ?`,
                choices: ['YUYUの日本語Podcast', 'TheBiteSizeJapanesePodcast'],
            },
        ]);
        tags.push(secondaryTag.tag);
    }
    console.log(tags);

    return tags;
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
        translationObject.word = answers.translation.split(' - ')[0];
        translationObject.reading = answers.translation.split(' - ')[2];
        translationObject.reading_romaji = answers.translation.split(' - ')[3];
        translationObject.traduction = answers.translation.split(' - ')[1];
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
