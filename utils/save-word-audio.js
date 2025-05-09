import gTTS from 'gtts';

export async function saveWordAudio(lang, word, reading) {
    const gtts = new gTTS(reading, lang); // lang : ja, en

    const path2dir = `/Users/jean-rogerorsini/Library/Application Support/Anki2/User 1/collection.media`;

    gtts.save(
        `${path2dir}/audio_${word}_${reading}.mp3`,
        function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log(`Audio saved as ${word}.mp3`);
            }
        }
    );
}
