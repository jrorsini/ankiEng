import isPhrasalVerb from "../utility/isPhrasalVerb.js";
import {
    fetchReversoResponse,
    errorLogMessage,
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
        it("should return an error", async function () {
            const result = await fetchReversoResponse("asdfadss");
            assert.equal(result, errorLogMessage);
        });
    });
});
