import assert from 'assert';
import getWordAPI from '../src/getWordAPI.js';
import chalk from 'chalk';

const wordList = [
    ['iron', ''],
    ['construct', ''],
    // ['spun', ''],
    // ['sank', ''],
    // ['puffing', ''],
    // ['cobwebs', ''],
    // ['jawing', ''],
    // ['holler', ''],
];

describe(`#getWordAPI`, function () {
    wordList.map((e) => {
        it(`should return the IPA notation of "${chalk.bold.white(
            e
        )}"`, async function () {
            const wordIPA = await getWordAPI(e[0]);
            console.log(wordIPA);
            assert.equal(!wordIPA, false);
        });
    });
});
