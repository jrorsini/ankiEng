// API's handlers.
import { getWordReferenceTranslations } from './src/ankiEng_get-wordreference-data.js';
import { inquireTranslationType, inquireTranslation } from './prompts.js';
import { searchResultLogTranslations } from './src/search-results-logs.js';
import { startSpinner } from './utils/cli-loader.js';

export async function ankiEng(usrInput) {
    const stopSpinner = startSpinner(usrInput);

    let fetchedTranslations = await getWordReferenceTranslations(usrInput);

    stopSpinner();

    const ankiCard = {};

    if (fetchedTranslations.length > 0) {
        const translationType = await inquireTranslationType(
            fetchedTranslations
        );
        fetchedTranslations = fetchedTranslations.filter(
            (e) => e.fromType === translationType
        );
        searchResultLogTranslations(fetchedTranslations);
        let { from, fromType, toType, to, example } = await inquireTranslation(
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
        ankiCard.audio = `[sound:audio_${audio_english
            .replace(/\[/gi, '')
            .replace(/\]/gi, '')}.mp3]`;
    } else {
        ankiCard.word = usrInput;
        ankiCard.audio = `[sound:audio_${usrInput}.mp3]`;
    }

    return ankiCard;
}
