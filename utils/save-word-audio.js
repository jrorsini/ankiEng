import gTTS from 'gtts';

function formatWordForAudio(w) {
    return w
        .split(',')[0]
        .replace(/\[sth\/sb\]/gi, 'sth or sb')
        .replace(/\[sth\]/gi, 'sth')
        .replace(/\[sb\]/gi, 'sb');
}

export default async function saveWordAudio(lang, w, reading) {
    // lang : ja, en
    let word = lang === 'en' ? formatWordForAudio(w) : w;

    const gtts = new gTTS(`${word}.`, lang);

    const path2dir = `/Users/jean-rogerorsini/Library/Application Support/Anki2/User 1/collection.media`;

    const audioFileName = `audio_${word}.mp3`;

    gtts.save(`${path2dir}/${audioFileName}`, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(`Audio saved as audio_${word}.mp3`);
        }
    });
}
