// API's handlers.
import { getWordReferenceTranslations } from './src/ankiEng_get-wordreference-data.js';
import { addAnkiEngCard } from './ankieng-card-handler.js';
import { chooseTranslationType, chooseTranslation } from './prompt.js';
import { searchResultLogTranslations } from './src/search-results-logs.js';
import { startSpinner } from './utils/cli-loader.js';

export async function ankiEng(usrInput) {
    const stopSpinner = startSpinner(usrInput);

    // DATA FETCH
    let fetchedTranslations = await getWordReferenceTranslations(usrInput);
    // let fetchedReversoTranslation = await getTranslationFromReverso(usrInput);

    stopSpinner();

    const note_fields = {
        english: '',
        ipa: '',
        pronunciation: '',
        audio: '',
        nuance: '',
        context: '',
        meaning: '',
        translations: '',
        visual: '',
        extra: '',
        type_from: '',
        type_to: '',
        example_en: '',
        example_fr: '',
        source_link: '',
        source_thumbnail: '',
    };

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
        console.log(example);

        note_fields.english = from;
        note_fields.translations = to;
        note_fields.type_from = fromType;
        note_fields.type_to = toType;
        note_fields.example_en = example.from;
        note_fields.example_fr = example.to;
    }

    await addAnkiEngCard(note_fields);
}
