import gTTS from 'gtts';

export async function saveWordAudio(text) {
    const gtts = new gTTS(text, 'ja');

    const path2dir = `/Users/jean-rogerorsini/Library/Application Support/Anki2/User 1/collection.media`;

    gtts.save(`${path2dir}/audio_${text}.mp3`, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(`Audio saved as ${text}.mp3`);
        }
    });
}
