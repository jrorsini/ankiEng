import inquirer from 'inquirer';
import chalk from 'chalk';
import {
    filterByTranslationType,
    filterByDefinitionType,
} from './utils/translationTypes.js';

// Turns "|shrug.|" into "|shrug|."
function properPiping(stc) {
    return stc.replace(
        /\|\w+[\.\,\;]\|/gi,
        (e) => `${e.slice(0, e.length - 2)}|${e.slice(-2, -1)}`
    );
}

export async function chooseJapaneseTranslation(fetchedTranslations) {
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

    res.kanji = answers.translation.split(' - ')[0];
    res.hiragana = answers.translation.split(' - ')[2];
    res.romaji = answers.translation.split(' - ')[3];
    res.translation = answers.translation.split(' - ')[1];

    return res;
}

export async function chooseTranslationType(fetchedTranslations) {
    const list_translation_types = [
        ...new Set(fetchedTranslations.map((e) => e.fromType)),
    ].filter((e) => e !== '');

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'translation',
            message: `Which ${chalk.underline.bold.yellow(
                'translation type'
            )}?`,
            choices: list_translation_types,
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

export async function chooseTranslation(fetchedTranslations) {
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

    // delete this.fromTypes;

    // // set selected translation
    // this['translations'] = this.translations.filter((e) =>
    //     filterByTranslationType(e, answers.type)
    // );

    // // set selected definition
    // if (this.definitions) {
    //     this['definitions'] = this.definitions.filter((e) =>
    //         filterByDefinitionType(e, answers.type)
    //     );
    // }

    // return this;
}

export async function chooseTranslationOld() {
    const translationsArr = this.translations.map(
        (e) => `${e.to}${e.example.from && ` | ${e.example.from}`}`
    );
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'translation',
            message: `Which ${chalk.underline.bold.yellow('translation')} ?`,
            choices: translationsArr,
        },
    ]);

    const translation = this.translations.find((tr) => {
        if (answers.translation.indexOf(' | ') === -1) {
            return tr.to == answers.translation;
        } else {
            return (
                tr.to == answers.translation.split(' | ')[0] &&
                tr.example.from == answers.translation.split(' | ')[1]
            );
        }
    });

    if (translation.example.from) {
        const en_match = getClosestMatchingWord(
            translation.from,
            translation.example.from
        );
        const en_ex = translation.example.from.replace(
            en_match,
            `|${en_match}|`
        );
        translation['example']['from'] = properPiping(en_ex);
    }
    if (translation.example.to) {
        const fr_match = getClosestMatchingWord(
            translation.to,
            translation.example.to
        );

        const fr_ex = translation.example.to.replace(fr_match, `|${fr_match}|`);
        translation['example']['to'] = properPiping(fr_ex);
    }

    delete this.translations;
    return { ...this, ...translation };
}

export async function chooseDefinition() {
    const definitionsArr = this.definitions.map((e) => e.split(' - ')[1]);
    const answers = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'definition',
            message: `Which ${chalk.underline.bold.yellow('definitions')} ?`,
            choices: definitionsArr,
        },
    ]);

    delete this.definitions;

    return {
        ...this,
        definition: answers.definition.length > 0 ? answers.definition[0] : '',
    };
}

export async function chooseExample() {
    if (this.examples.length > 1) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'example',
                message: `Which ${chalk.underline.bold.yellow('example')} ?`,
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
            example_en: JSON.stringify(answers.example.split(' | ')[0])
                .replace(/\\\w+\d+\w+\[\d+\w+\\\w+\d+\w+\[\d+\w/gi, '|')
                .slice(1, -1),
            example_fr: JSON.stringify(answers.example.split(' | ')[1])
                .replace(/\\\w+\d+\w+\[\d+\w+\\\w+\d+\w+\[\d+\w/gi, '|')
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
