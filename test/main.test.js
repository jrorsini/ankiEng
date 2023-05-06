import isPhrasalVerb from "../utility/isPhrasalVerb.js";
import {
    fetchReversoResponse,
    errorLogMessage,
    fetchTranslations,
    fetchExamples,
} from "../utility/scrapeFuncs.js";
import {
    saveWordCardToFile,
    fileExists,
    getFileContent,
} from "../utility/saveWordCardToFile.js";
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
        it("should return an error", async function () {
            const result = await fetchReversoResponse("asdfadss");
            assert.equal(result, errorLogMessage);
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

    describe("#fileExists()", function () {
        it("should return true because the file exists", async function () {
            assert.equal(await fileExists(), true);
        });
    });

    describe("#getFileContent()", function () {
        it("should return the whole content of the file", async function () {
            const data = await getFileContent();
            assert.equal(data.length > 0, true);
        });
    });

    describe("#fetchExamples()", function () {
        it("should return examples", async function () {
            const result = await fetchReversoResponse("test");
            const examples = fetchExamples(result);
            assert.equal(examples.length, 3);
        });
    });
});

// there's a case like "multivariate" in which an error is returned from thesaurus.com cause it can't find the word.
