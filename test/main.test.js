import isPhrasalVerb from "../utility/isPhrasalVerb.js";
import Reverso from "reverso-api";
const reverso = new Reverso();
import {
    fetchReversoResponse,
    getTranslations,
    getExamples,
    fetchDictionaryBodyResponse,
    fetchThesaurusBodyResponse,
    getIPAs,
    getTypes,
    getDefinitions,
    getPronunciation,
    mainScrape,
} from "../utility/scrapeFuncs.js";
import assert from "assert";
import chalk from "chalk";
import { logWordContent } from "../utility/log.js";

const wordList = [
    "cobwebs",
    "jawing",
    "holler",
    "stand out",
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

// wordList.map(async (e) => {
//     let { userInput, ipa, pronunciation, definitions, translations, examples } =
//         await mainScrape(e);

//     logWordContent(
//         userInput,
//         ipa,
//         pronunciation,
//         definitions,
//         translations,
//         examples
//     );
// });

describe("dictionary.com", function () {
    wordList.map((e) => {
        it(`${chalk.bold.green("result")} for "${chalk.bold.white(
            e
        )}"`, async function () {
            const dictionaryRes = await fetchDictionaryBodyResponse(e);
            assert.equal(!dictionaryRes, false);
        });
    });
});

describe("dictionary.com types", function () {
    wordList.map((e) => {
        it(`${chalk.bold.green("result")} for "${chalk.bold.white(
            e
        )}"`, async function () {
            const dictionaryRes = await fetchDictionaryBodyResponse(e);
            const types = getTypes(e, dictionaryRes);
            types ? assert.equal(!types, false) : assert.equal(types, false);
        });
    });
});

describe("thesaurus.com", function () {
    wordList.map((e) => {
        it(`${chalk.bold.green("result")} for "${chalk.bold.white(
            e
        )}"`, async function () {
            const thesaurusRes = await fetchThesaurusBodyResponse(e);
            assert.equal(!thesaurusRes, false);
        });
    });
});

describe("thesaurus.com definition", function () {
    wordList.map((e) => {
        it(`${chalk.bold.green("result")} for "${chalk.bold.white(
            e
        )}"`, async function () {
            const dictionaryRes = await fetchDictionaryBodyResponse(e);
            const thesaurusRes = await fetchThesaurusBodyResponse(e);
            const typ = getTypes(e, dictionaryRes);
            const def = await getDefinitions(thesaurusRes, typ);
            def ? assert.equal(!def, false) : assert.equal(def, false);
        });
    });
});
/**

describe("#isPhrasalVerb()", function () {
    wordList
        .filter((e) => !isPhrasalVerb(e))
        .map((e) => {
            it(`${chalk.underline.bold(e)} != phrasal verb `, function () {
                assert.equal(isPhrasalVerb(e), false);
            });
        });

    wordList
        .filter((e) => isPhrasalVerb(e))
        .map((e) => {
            it(`${chalk.underline.bold(e)} = phrasal verb`, function () {
                assert.equal(isPhrasalVerb(e), true);
            });
        });
});

 */

// describe("#fetchDictionaryBodyResponse", function () {
//     it("should return false", async function () {
//         const apis = await fetchDictionaryBodyResponse("seawall");
//         assert.equal(apis, false);
//     });
// });

// describe("#fetchThesaurusBodyResponse", function () {
//     it("should return nothing for moose in thesaurus", async function () {
//         const dictionaryRes = await fetchDictionaryBodyResponse("moose");
//         const thesaurusRes = await fetchThesaurusBodyResponse("moose");
//         const types = dictionaryRes ? getTypes("moose", dictionaryRes) : false;
//         const definitions = thesaurusRes
//             ? getDefinitions(thesaurusRes, types)
//             : false;
//         assert.equal(definitions, false);
//     });
// });

// "stand out" error on reverso
// "moose" doesn't return definition
// "noticeably" logs adj adj adj after answering IPA
// there's a case like "multivariate" in which an error is returned from thesaurus.com cause it can't find the word.
