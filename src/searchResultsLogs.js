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

export function searchResultLogSynonyms(res) {
    res.hasOwnProperty('')
        ? console.log(
              `${chalk.underline.bold('Synonyms')} : ${chalk.green(
                  res[''][0]['synonyms'].join(', ')
              )}`
          )
        : console.log(res);
}

export function logSearchResults(word, translations, definitions, synonyms) {
    // clear log
    console.clear();

    // declare search header
    const searchHeader = `${chalk.greenBright.bold(
        `✓`
    )} RESULTS FOR ${chalk.yellow.underline.bold(word.toUpperCase())}`;

    // log search header
    console.log(searchHeader);

    // add underline based on search header's lenght
    console.log(`-`.repeat(searchHeader.length - 28));

    // log translations
    searchResultLogTranslations(translations);

    // log definitions
    logDefinitions(definitions);
}

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

function searchResultLogTranslations(translations) {
    console.log(`\n\t${chalk.bgWhiteBright.black.bold(` TRANSLATIONS `)}\n`);

    let ordredTranslations = translations.sort((a, b) =>
        a.fromType.localeCompare(b.fromType)
    );

    ordredTranslations.map((e) => {
        console.log(
            `${chalk.red(`${e.fromType}`)} ${chalk.red.bold(
                e.from
            )}・${chalk.cyan(`${e.toType}`)} ${chalk.cyan.bold(e.to)}`
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

function searchResultLogDefinitions(definitions) {
    console.log(`\n\t${chalk.bgWhiteBright.black.bold(` DEFINITIONS `)}`);

    for (let wordType in definitions) {
        console.log(`${chalk.red.underline(wordType)}`);
        definitions[wordType].map((d) => console.log(`・${d}`));
    }
}

/*

const log = console.log;

export function logDefinitions(definitions) {
    if (definitions) {
        log(`\n\t${chalk.bgWhiteBright.black.bold(` DEFINITIONS `)}`);

        definitions.map((e) => {
            const typ = e.split(' - ')[0];
            const def = e.split(' - ')[1];
            console.log(`\n${chalk.bgGray(` ${typ.toUpperCase()} `)} : ${def}`);
        });
    }
}

export function logTranslations(translations) {
    log(`\n\t${chalk.bgWhiteBright.black.bold(` TRANSLATIONS & EXAMPLES `)}`);
    translations.map((e) => {
        log(
            `\n${chalk.bgRed.bold.white(
                ` ${e.fromType.toUpperCase()} `
            )} ${chalk.bold.red(e.from)}  ~  ${chalk.bgCyan.bold.white(
                ` ${e.toType.toUpperCase()} `
            )} ${chalk.bold.cyan(e.to)}`
        );

        if (e.example.from) {
            const en_match = getClosestMatchingWord(e.from, e.example.from);
            const en_ex = e.example.from.replace(
                en_match,
                chalk.bold.underline.red(en_match)
            );
            log(`\n\t${en_ex}`);
        }
        if (e.example.to) {
            const fr_match = getClosestMatchingWord(e.to, e.example.to);
            const fr_ex = e.example.to.replace(
                fr_match,
                chalk.bold.underline.cyan(fr_match)
            );
            log(`\t${fr_ex}`);
        }
    });
}

export function getMatchingWord(wordList, sentence) {
    for (let i = 0; i < wordList.length; i++) {
        const word = wordList[i];
        const regex = new RegExp(`/${word}/`, 'i');

        if (sentence.match(word)) {
            return word; // Return the matching word
        }
    }

    return null; // No matching word found
}

export function logLingueeData(data) {
    console.log(`LINGUEE Results for ${data.word}\n`);
    data.translations.map((e) => {
        const translation = e.translation;
        console.log(
            `\n${chalk.bgGray(
                ` ${e.type.toUpperCase()} `
            )}: ${chalk.green.underline(translation)}`
        );
        e.examples.map((e) => {
            const en_match = getClosestMatchingWord(data.word, e.en);
            const fr_match = getClosestMatchingWord(translation, e.fr);
            const en_ex = e.en.replace(
                en_match,
                chalk.bold.underline.red(en_match)
            );
            const fr_ex = e.fr.replace(
                fr_match,
                chalk.bold.underline.cyan(fr_match)
            );
            console.log(`\n\t${en_ex}\n\t${fr_ex}`);
            return e;
        });
        return e;
    });
}

export function logReversoData(data) {
    console.log(`REVERSO Results for ${data.word}`);
    data.translations.map((e) => {
        const translation = e.translation;
        console.log(
            `\n\t${chalk.green.bold.underline(translation.toUpperCase())}`
        );
        e.examples.map((e) => {
            const en_match = getClosestMatchingWord(data.word, e.en);
            const fr_match = getClosestMatchingWord(translation, e.fr);
            const en_ex = e.en.replace(
                en_match,
                chalk.bold.underline.red(en_match)
            );
            const fr_ex = e.fr.replace(
                fr_match,
                chalk.bold.underline.cyan(fr_match)
            );
            console.log(`\n\t${en_ex}\n\t${fr_ex}`);
            return e;
        });
        return e;
    });
}

*/
