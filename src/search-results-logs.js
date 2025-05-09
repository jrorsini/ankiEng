import chalk from 'chalk';
import natural from 'natural';

function getClosestMatchingWord(wordToMatch, sentence) {
    const wordsInSentence = sentence.split(' ');

    let closestMatch = null;
    let minDistance = Infinity;

    wordsInSentence.forEach((word) => {
        const distance = natural.LevenshteinDistance(wordToMatch, word);
        if (distance < minDistance) {
            minDistance = distance;
            closestMatch = word;
        }
    });

    return closestMatch;
}

function loggingHeader(title) {
    console.log(`\n\t${chalk.bgWhiteBright.black.bold(` ${title} `)}`);
}

function searchResultLogDefinitions(definitions) {
    loggingHeader('DEFINITIONS');

    for (let wordType in definitions) {
        console.log(`${chalk.red.underline(wordType)}`);
        definitions[wordType].map((d) =>
            console.log(`${chalk.red.bold('・')}${d}`)
        );
    }
}

export function searchResultLogTranslations(translations) {
    loggingHeader('TRANSLATIONS');

    let orderedTranslations = translations.sort((a, b) =>
        a.fromType.localeCompare(b.fromType)
    );

    orderedTranslations.map((e) => {
        console.log(
            `${chalk.red(`${e.fromType}`)} ${chalk.red.bold(
                e.from
            )} ⇒ ${chalk.cyan(`${e.toType}`)} ${chalk.cyan.bold(e.to)}`
        );

        if (e.example.from) {
            const en_match = getClosestMatchingWord(e.from, e.example.from);

            console.log(
                `\t${e.example.from.replace(
                    en_match,
                    chalk.bold.underline.italic.red(en_match)
                )}`
            );
        }

        if (e.example.to) {
            const fr_match = getClosestMatchingWord(e.to, e.example.to);

            console.log(
                `\t${e.example.to.replace(
                    fr_match,
                    chalk.bold.underline.italic.cyan(fr_match)
                )}`
            );
        }
    });
}

function searchResultLogSynonyms(res) {
    loggingHeader('SYNONYMS');

    if (res.hasOwnProperty('')) {
        if (res[''][0]['meaning'] === '') {
            console.log(
                `${chalk.underline.red.bold('Synonyms')} : ${res[''][0][
                    'synonyms'
                ].join(', ')}`
            );
        } else {
            console.log(``);
            res[''].map((e) => {
                console.log(
                    `${chalk.bold.underline.red(e['meaning'])} ${chalk.bold.red(
                        ':'
                    )}\n\t${e['synonyms'].join(', ')} `
                );
            });
        }
    } else {
        for (const wordType in res) {
            console.log(`\n${chalk.bold.red(wordType)}`);

            res[wordType].map((e) => {
                console.log(
                    `  ${chalk.underline.red(e['meaning'])} : ${e[
                        'synonyms'
                    ].join(', ')} `
                );
            });
        }
    }
}

export function logSearchResults(
    word,
    definitions,
    translations,
    synonyms,
    reversoTranslation
) {
    console.clear();

    const searchHeader = `${chalk.greenBright.bold(
        `✓`
    )} RESULTS FOR ${chalk.yellow.underline.bold(word.toUpperCase())}`;

    console.log(searchHeader);

    // searchResultLogDefinitions(definitions);

    searchResultLogTranslations(translations);

    // searchResultLogSynonyms(synonyms);
}
