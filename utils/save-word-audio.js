import gTTS from 'gtts';

function formatWordForAudio(w) {
    return w
        .split(',')[0]
        .replace(/\[sth\/sb\]/gi, 'something or somebody')
        .replace(/\[sth\]/gi, 'something')
        .replace(/\[sb\]/gi, 'somebody');
}

export default async function saveWordAudio(lang, word, reading) {
    // lang : ja, en
    const gtts = new gTTS(
        lang === 'en' ? `${formatWordForAudio(word)}.` : `${word}.`,
        lang
    );

    const path2dir = `/Users/jean-rogerorsini/Library/Application Support/Anki2/User 1/collection.media`;

    // const audioFileName = `${
    //     lang === 'en'
    //         ? `audio_${formatWordForAudio(word)}.mp3`
    //         : `audio_${reading}_${word}.mp3`
    // }`;

    const audioFileName = `audio_${formatWordForAudio(word)}.mp3`;

    gtts.save(`${path2dir}/${audioFileName}`, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(`Audio saved as audio_${word}.mp3`);
        }
    });
}
