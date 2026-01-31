import isRomanChar from './utils/isRomanChar.js';

const tagToDeck = {
    'Learn_Japanese_with_JapanesePod101.com':
        'Learn_Japanese_with_JapanesePod101.com',
    Bite_Size_Japanese: 'BiteSizeJapanese',
    MAIの日本語Podcast: 'MAIの日本語Podcast',
    "Ayano's_Japanese_Learning_Hub": 'Ayano_s_Japanese_Learning_Hub',
    HINA_Japanese: 'HINA_Japanese',
    Otsukare_Japanese: 'Otsukare_Japanese',
    Imari_Japan: 'Imari_Japan',
    Yosuke_Teaches_Japanese: 'Yosuke_Teaches_Japanese',
};

export default async function buildAnkiCard(fields, tags) {
    let lang = isRomanChar(fields.word) ? 'ENGLISH' : 'JAPANESE';

    console.log(tags[0]);

    const deckName = tagToDeck[tags[0]] ?? `1 - ${lang}`;

    const modelName = `CUSTOM_NOTE_${lang}`;

    let note = {
        deckName,
        modelName,
        fields,
        tags,
        options: { allowDuplicate: true },
    };

    return note;
}
