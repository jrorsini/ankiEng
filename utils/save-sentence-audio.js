import gTTS from 'gtts';

function formatSentenceForAudio(s) {
    return s
        .split('<br/>')[0]
        .replace(/\<b\>/gi, '')
        .replace(/\<\/b\>/gi, '');
}

export default async function saveSentenceAudio(word, sentence) {
    // lang : ja, en
    const gtts = new gTTS(formatSentenceForAudio(sentence), 'ja');

    const path2dir = `/Users/jean-rogerorsini/Library/Application Support/Anki2/User 1/collection.media`;

    const audioFileName = `audio_${word}_source_transcript.mp3`;

    gtts.save(`${path2dir}/${audioFileName}`, function (err, result) {
        console.log(err ? err : `Audio saved as ${audioFileName}`);
    });
}
