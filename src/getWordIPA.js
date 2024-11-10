import axios from 'axios';

/**
 * Function that dispatches Card Note to Anki.
 * @param {String} word list of jlpt's new words to add to Anki.
 * @return {Array} Array containing the IPA.
 */
export default async function getWordIPA(word) {
    try {
        let dictionaryapiJSON = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        return [
            ...new Set(
                dictionaryapiJSON.data.map((e) =>
                    e.phonetic ? e.phonetic.replaceAll('/', '') : ''
                )
            ),
        ][0];
    } catch (err) {
        return err;
    }
}
