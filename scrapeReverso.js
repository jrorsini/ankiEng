import Reverso from "reverso-api";
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
    const ipaContainer = $(".pron-spell-ipa-container .pron-ipa-container");

    // IPA
    let ipa;
    if (ipaContainer.length > 0) {
        ipa = ipaContainer.find(".pron-ipa-content");
        if (ipa.length === 1) {
            ipa = ipa
                .text()
                .trim()
                .replace(/[/()[\]]/g, "");
        } else {
            ipa = ipa
                .map((i, el) =>
                    $(el)
                        .text()
                        .replace(/[/()[\]]/g, "")
                        .trim()
                )
                .toArray();
            ipa = [...new Set(ipa)];
        }
    }

    return ipa;
}

scrapeDictionary("clear");
