import gTTS from 'gtts';

export default async function saveWordAudio(lang, word, reading) {
    const gtts = new gTTS(
        lang === 'en'
            ? `${word
                  .split(',')[0]
                  .replace(/\[sth\/sb\]/gi, 'something or somebody')
                  .replace(/\[sth\]/gi, 'something')
                  .replace(/\[sb\]/gi, 'somebody')}`
            : word,
        lang
    ); // lang : ja, en

    const path2dir = `/Users/jean-rogerorsini/Library/Application Support/Anki2/User 1/collection.media`;

    const audioFileName = `${
        lang === 'en'
            ? `audio_${word
                  .replace(/\[sth\/sb\]/gi, 'something or somebody')
                  .replace(/\[sth\]/gi, 'something')
                  .replace(/\[sb\]/gi, 'somebody')}.mp3`
            : `audio_${reading}_${word}.mp3`
    }`;
    gtts.save(`${path2dir}/${audioFileName}`, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(
                `Audio saved as ${
                    'jp' ? `audio_${reading}_${word}.mp3` : `audio_${word}.mp3`
                }`
            );
        }
    });
}
