import isPhrasalVerb from "../utility/isPhrasalVerb.js";
import Reverso from "reverso-api";
const reverso = new Reverso();
import {
    fetchReversoResponse,
    fetchTranslations,
    fetchExamples,
    fetchDictionaryBodyResponse,
    fetchIPAs,
} from "../utility/scrapeFuncs.js";
import assert from "assert";

describe("Utility", function () {
    describe("#isPhrasalVerb()", function () {
        it("should be a phrasal verb", function () {
            assert.equal(isPhrasalVerb("dig up"), true);
            assert.equal(isPhrasalVerb("figure out"), true);
        });
        it("should should not be a phrasal verb", function () {
            assert.equal(isPhrasalVerb("dig"), false);
            assert.equal(isPhrasalVerb("test  "), false);
        });
    });

    describe("#fetchReversoResponse()", function () {
        it("should return a response", async function () {
            const result = await fetchReversoResponse("test");
            assert.equal(result.ok, true);
        });
        it("should return false", async function () {
            let result;
            try {
                result = await fetchReversoResponse("asdfadss");
            } catch (error) {
                result = false;
            }
            assert.equal(result, false);
        });
    });

    describe("#fetchTranslations()", function () {
        it("should return the translations without duplicates", async function () {
            assert.equal(
                fetchTranslations(await fetchReversoResponse("reedy")).length,
                5
            );
        });
    });

    describe("#fetchExamples()", function () {
        it("should return examples", async function () {
            const result = await fetchReversoResponse("test");
            const examples = fetchExamples(result);
            assert.equal(examples.length, 3);
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
});

// seawall doesn't return any IPA
// there's a case like "multivariate" in which an error is returned from thesaurus.com cause it can't find the word.
