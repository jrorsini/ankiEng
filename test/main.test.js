import Reverso from 'reverso-api';
const reverso = new Reverso();
import {
    getTranslations,
    fetchDictionaryBodyResponse,
    fetchThesaurusBodyResponse,
    getTypes,
    getDefinitions,
    getWord,
} from '../utility/api.js';
import assert from 'assert';
import chalk from 'chalk';

// set out
// farmyard
// promptly
// gaze
// securities

const wordList = [
    'spun',
    'sank',
    'puffing',
    'cobwebs',
    'jawing',
    'holler',
    // "what's keeping him"
    // "stand out",
    // "Ox",
    // "limp",
    // "slip up",
    // "dyke",
    // "horoscope",
    // "check in",
    // "shipwrecked",
    // "test",
    // "clear",
    // "hare",
    // "reedy",
    // "dove",
    // "flutter",
    // "brook",
    // "bank",
    // "blade",
    // "straw",
    // "freighter",
    // "sailor",
    // "latch",
    // "spar",
    // "distant",
    // "slumped",
    // "slump",
    // "fry",
    // "dastardly",
    // "despondent",
    // "flunky",
    // "clear out",
    // "stung",
    // "stalk",
    // "plain",
    // "foxy",
    // "parting",
    // "prowl",
    // "choppy",
    // "asinine",
    // "railway",
    // "divvy",
    // "confined",
    // "curs",
    // "cad",
    // "cowl",
    // "figment",
];

// let testDictionary = await fetchDictionaryBodyResponse("test");
// let testTypes = getTypes("test", testDictionary);
// console.log(testTypes);
// console.log(await fetchThesaurusBodyResponse("test"));
// await getDefinitions(, testTypes);

describe('dictionary.com', function () {
    wordList.map((e) => {
        it(`${chalk.bold.green('result')} for "${chalk.bold.white(
            e
        )}"`, async function () {
            const dictionaryRes = await fetchDictionaryBodyResponse(e);
            assert.equal(!dictionaryRes, false);
        });
    });
});

describe('thesaurus.com', function () {
    wordList.map((e) => {
        it(`${chalk.bold.green('result')} for "${chalk.bold.white(
            e
        )}"`, async function () {
            const thesaurusRes = await fetchThesaurusBodyResponse(e);
            assert.equal(!thesaurusRes, false);
        });
    });
});

describe('dictionary.com word', function () {
    wordList.map((e) => {
        it(`${chalk.bold.green('types')} for "${chalk.bold.white(
            e
        )}"`, async function () {
            const dictionaryRes = await fetchDictionaryBodyResponse(e);
            const word = await getWord(dictionaryRes);
            console.log(word);
            if (word) {
                assert.equal(!word, false);
            } else {
                assert.equal(word, false);
                console.log(
                    `\n\t${chalk.bold.underline.red(
                        'no word'
                    )} for ${chalk.bold(e)}`
                );
            }
        });
    });
});
describe('dictionary.com types', function () {
    wordList.map((e) => {
        it(`${chalk.bold.green('types')} for "${chalk.bold.white(
            e
        )}"`, async function () {
            const dictionaryRes = await fetchDictionaryBodyResponse(e);
            const types = getTypes(e, dictionaryRes);
            if (types) {
                assert.equal(!types, false);
            } else {
                assert.equal(types, false);
                console.log(
                    `\n\t${chalk.bold.underline.red(
                        'no types'
                    )} for ${chalk.bold(e)}`
                );
            }
        });
    });
});

describe('thesaurus.com definition', function () {
    wordList.map((e) => {
        it(`${chalk.bold.green('definition')} for "${chalk.bold.white(
            e
        )}"`, async function () {
            const dictionaryRes = await fetchDictionaryBodyResponse(e);
            const thesaurusRes = await fetchThesaurusBodyResponse(e);
            const typ = getTypes(e, dictionaryRes);
            const def = await getDefinitions(thesaurusRes, typ);
            if (def) {
                assert.equal(!def, false);
            } else {
                assert.equal(def, false);
                console.log(
                    `\n\t${chalk.bold.underline.red(
                        'no definition'
                    )} for ${chalk.bold(e)}`
                );
            }
        });
    });
});

describe('getTranslations', function () {
    wordList.map((e) => {
        it(`${chalk.bold.green('translations')} for "${chalk.bold.white(
            e
        )}"`, async function () {
            const translations = await getTranslations(e);
            if (translations) {
                assert.equal(!translations, false);
            } else {
                assert.equal(translations, false);
                console.log(
                    `\n\t${chalk.bold.underline.red(
                        'no translations'
                    )} for ${chalk.bold(e)}`
                );
            }
        });
    });
});
// "stand out" error on reverso
// "moose" doesn't return definition
// "noticeably" logs adj adj adj after answering IPA
// there's a case like "multivariate" in which an error is returned from thesaurus.com cause it can't find the word.
