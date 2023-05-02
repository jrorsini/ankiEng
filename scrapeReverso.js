import Reverso from "reverso-api";
import axios from "axios";
import cheerio from "cheerio";
const reverso = new Reverso();

export async function fetchAPIs(word) {}

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

async function scrapeDictionary(userInput) {
    let dictionary_response;
    try {
        dictionary_response = await axios.get(
            `https://www.dictionary.com/browse/${userInput}`
        );
    } catch (error) {
        console.log(error, error.stack);
    }

    let $ = cheerio.load(dictionary_response.data);
    const ipaContainer = $(".pron-spell-ipa-container").find(
        ".pron-ipa-content"
    );

    return ipaContainer.length === 1
        ? [
              ipaContainer
                  .text()
                  .trim()
                  .replace(/[/()[\]]/g, ""),
          ]
        : [
              ...new Set(
                  $(".pron-spell-ipa-container")
                      .find(".pron-ipa-content")
                      .map(function (i, el) {
                          return $(el)
                              .text()
                              .replace(/[/()[\]]/g, "")
                              .trim();
                      })
                      .toArray()
              ),
          ];
}

scrapeDictionary("clear");
