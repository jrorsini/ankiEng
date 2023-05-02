import Reverso from "reverso-api";
import axios from "axios";
import cheerio from "cheerio";
import isPhrasalVerb from "./isPhrasalVerb.js";
const reverso = new Reverso();

export async function fetchTranslations(word) {
    let res = await reverso.getTranslation(
        word,
        "english",
        "french",
        (err, response) => {
            if (err) throw new Error(err.message);
            return response;
        }
    );
    return res.translations;
}

export async function fetchExamples(word) {
    let res = await reverso.getContext(
        "dismiss",
        "english",
        "french",
        (err, response) => {
            if (err) throw new Error(err.message);

            return response;
        }
    );

    return res.examples;
}

export async function fetchIPAs(word) {
    let body;
    try {
        body = await axios.get(`https://www.dictionary.com/browse/${word}`);
    } catch (err) {
        console.log(err, err.stack);
    }

    let $ = cheerio.load(body.data);
    const ipaContainer = $(".pron-spell-ipa-container").find(
        ".pron-ipa-content"
    );

    return ipaContainer.length === 1
        ? [
              ipaContainer
                  .text()
                  .replace(/[/()[\]]/g, "")
                  .trim(),
          ]
        : [
              ...new Set(
                  ipaContainer
                      .map((i, el) =>
                          $(el)
                              .text()
                              .replace(/[/()[\]]/g, "")
                              .trim()
                      )
                      .toArray()
              ),
          ];
}

export async function fetchSpellings(word) {
    let body;
    try {
        body = await axios.get(`https://www.dictionary.com/browse/${word}`);
    } catch (err) {
        console.log(err, err.stack);
    }

    let $ = cheerio.load(body.data);
    const spellingContainer = $(
        ".pron-spell-ipa-container .pron-spell-container"
    ).find(".pron-spell-content");

    return spellingContainer.length === 1
        ? [spellingContainer.text().replace(/\[|\]/g, "").trim()]
        : [
              ...new Set(
                  spellingContainer
                      .map((i, el) => $(el).text().replace(/\[|\]/g, "").trim())
                      .toArray()
              ),
          ];
}
export async function fetchTypes(word) {
    // body response
    let body;
    try {
        body = await axios.get(`https://www.dictionary.com/browse/${word}`);
    } catch (err) {
        console.log(err, err.stack);
    }
    let $ = cheerio.load(body.data);

    return isPhrasalVerb(word)
        ? ["phrasal verb"]
        : $("section.serp-nav-button")
              .next()
              .find("span.luna-pos")
              .toArray()
              .map((el) =>
                  $(el)
                      .text()
                      // avoid a case like "reedy" in which we have this "adjective, reed·i·er, reed·i·est."
                      .replace(",", "")
                      .trim()
                      .replace("adjective", "adj")
              );
}
