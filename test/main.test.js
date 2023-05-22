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
} from "../utility/scrapeFuncs.js";
import assert from "assert";
import chalk from "chalk";

const wordList = [
    "stand out",
    "slip up",
    "horoscope",
    "check in",
    "cobwebs",
    // "shipwecked",
    // "test",
    // "clear",
    // "hare",
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

describe("Utility", function () {
    describe("#fetchDictionaryBodyResponse", function () {
        wordList.map((e) => {
            it(`returns body response for "${chalk.bold.underline(
                e
            )}" from dictionary.com`, async function () {
                const ipas = await fetchDictionaryBodyResponse(e);
                assert.equal(!ipas, false);
            });
        });
    });

    describe("#isPhrasalVerb()", function () {
        wordList
            .filter((e) => !isPhrasalVerb(e))
            .map((e) => {
                it(`${chalk.underline.bold(
                    e
                )} is not be a phrasal verb `, function () {
                    assert.equal(isPhrasalVerb(e), false);
                });
            });

        wordList
            .filter((e) => isPhrasalVerb(e))
            .map((e) => {
                it(`${chalk.underline.bold(e)} is a phrasal verb`, function () {
                    assert.equal(isPhrasalVerb(e), true);
                });
            });
    });

    describe("#getTranslations()", function () {
        it("should return the translations without duplicates", async function () {
            const translations = await getTranslations("reedy");
            assert.equal(translations.length, 4);
        });
    });

    describe("#getTranslation", function () {
        it("should return ", async function () {
            const result = await reverso.getTranslation(
                "she digs him",
                "english",
                "french",
                (err, res) => {
                    if (err) throw new Error(err.message);
                    return res;
                }
            );
        });
    });

    describe("#fetchDictionaryBodyResponse", function () {
        it("should return false", async function () {
            const apis = await fetchDictionaryBodyResponse("seawall");
            assert.equal(apis, false);
        });
    });

    describe("#fetchThesaurusBodyResponse", function () {
        it("should return false", async function () {
            const dictionaryRes = await fetchDictionaryBodyResponse("dyke");
            const thesaurusRes = await fetchThesaurusBodyResponse("dyke");
            const types = dictionaryRes
                ? getTypes("dyke", dictionaryRes)
                : false;
            const definitions = thesaurusRes
                ? getDefinitions(thesaurusRes, types)
                : false;

            assert.equal(definitions, false);
        });
        it("should return nothing for moose in thesaurus", async function () {
            const dictionaryRes = await fetchDictionaryBodyResponse("moose");
            const thesaurusRes = await fetchThesaurusBodyResponse("moose");
            const types = dictionaryRes
                ? getTypes("moose", dictionaryRes)
                : false;
            const definitions = thesaurusRes
                ? getDefinitions(thesaurusRes, types)
                : false;
            assert.equal(definitions, false);
        });
    });
});

// "stand out" error on reverso
// "moose" doesn't return definition
// "noticeably" logs adj adj adj after answering IPA
// there's a case like "multivariate" in which an error is returned from thesaurus.com cause it can't find the word.
