// API's handlers.
import { getWordReferenceTranslations } from './src/ankiEng_get-wordreference-data.js';
import { chooseTranslationType, chooseTranslation } from './prompt.js';
import { searchResultLogTranslations } from './src/search-results-logs.js';
import { startSpinner } from './utils/cli-loader.js';

export async function ankiEng(usrInput) {
    const stopSpinner = startSpinner(usrInput);

    let fetchedTranslations = await getWordReferenceTranslations(usrInput);

    stopSpinner();

    const ankiCard = {};

    if (fetchedTranslations.length > 0) {
        const translationType = await chooseTranslationType(
            fetchedTranslations
        );
        fetchedTranslations = fetchedTranslations.filter(
            (e) => e.fromType === translationType
        );
        searchResultLogTranslations(fetchedTranslations);
        let { from, fromType, toType, to, example } = await chooseTranslation(
            fetchedTranslations
        );

        const audio_english = from
            .replace(/\[sth\/sb\]/gi, 'something or somebody')
            .replace(/\[sth\]/gi, 'something')
            .replace(/\[sb\]/gi, 'somebody');

        ankiCard.word = from;
        ankiCard.traduction = to;
        ankiCard.type_from = fromType;
        ankiCard.type_to = toType;
        ankiCard.example_en = example.from;
        ankiCard.example_fr = example.to;
        ankiCard.audio = `[sound:audio_${audio_english}.mp3]`;
    }

    return ankiCard;
}
