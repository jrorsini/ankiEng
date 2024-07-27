import wr from 'wordreference-api';

/**
 * Function that dispatches Card Note to Anki.
 * @param {Array} WordReferenceRes the Word Reference's response.
 * @return {Array} Array with all the formatted translations listed.
 */
function getTranslationsList(WordReferenceRes) {
    const arr = WordReferenceRes.translations.map((e) => e.translations);
    return [].concat(...arr.map((inArr) => [].concat(...inArr))).map((e) => ({
        ...e,
        from: e.from.trim().replaceAll('⇒', ''),
        to: e.to.trim().replaceAll('⇒', ''),
        example: {
            from: e.example.from.length > 0 ? e.example.from[0] : '',
            to: e.example.to.length > 0 ? e.example.to[0] : '',
        },
    }));
}

export default async function getWRefData(word) {
    try {
        let WordReferenceRes = await wr(word, 'en', 'fr');
        let translations = getTranslationsList(WordReferenceRes);
        console.log(translations);
        return translations;
    } catch (err) {
        return this;
    }
}
