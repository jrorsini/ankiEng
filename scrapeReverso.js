import Reverso from "reverso-api";
const reverso = new Reverso();

async function scrapeReverso(word) {
    let translations = await reverso.getTranslation(
        word,
        "english",
        "french",
        (err, response) => {
            if (err) throw new Error(err.message);

            return response.translations;
        }
    );

    let examples = await reverso.getContext(
        "dismiss",
        "english",
        "french",
        (err, response) => {
            if (err) throw new Error(err.message);

            return response.examples;
        }
    );

    return { translations, examples };
}

export default scrapeReverso;
