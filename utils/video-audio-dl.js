import { exec } from 'child_process';
import util from 'util';

function getVideoIdAndStartTime(url) {
    const parsedUrl = new URL(
        url.charAt(url.length - 1) === 's' ? url.slice(0, -1) : url
    );
    const timeParam = parsedUrl.searchParams.get('t');
    const videoId = parsedUrl.pathname.split('/')[1]; // "CxouIJKVpaw"

    let startTime;
    if (!timeParam) startTime = 0;

    if (/^\d+$/.test(timeParam)) {
        // Just seconds, like ?t=90
        startTime = parseInt(timeParam, 10);
    }
    return { videoId, startTime };
}

function formatYoutubeVideoLink(url) {
    /**
     * lien youglish : https://www.youtube.com/embed/CxouIJKVpaw?playsinline=1&iv_load_policy=3&rel=0&showinfo=0&controls=1&fs=0&start=34&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fyouglish.com&widgetid=1&forigin=https%3A%2F%2Fyouglish.com%2Fpronounce%2F%25E4%25B8%25A1%25E5%259B%25BD%2Fjapanese&aoriginsup=1&vf=6
     * lien youtube : https://youtu.be/OZTlixpmE_o?t=633
     */

    if (url.length > 35) {
        const urlObj = new URL(url);
        const videoId = urlObj.pathname.split('/')[2]; // "CxouIJKVpaw"
        const startTime = urlObj.searchParams.get('start'); // "34"

        let shortUrl = `https://youtu.be/${videoId}`;
        if (startTime) shortUrl += `?t=${startTime}`;

        return shortUrl;
    } else {
        return url;
    }
}

function secondsToHHMMSS(seconds) {
    const h = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, '0');
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');
    return `${h}:${m}:${s}`;
}

const execPromise = util.promisify(exec);

const path2SaveFile = `/Users/jean-rogerorsini/Library/Application Support/Anki2/User 1/collection.media`;

function generate_yt_dlp_cmd(word, videoId) {
    return `yt-dlp -x --audio-format mp3 -o "${path2SaveFile}/temp_youglish_${word}_${videoId}_audio.mp3" "https://www.youtube.com/watch?v=${videoId}"`;
}

function generate_ffmpeg_cmd(word, number_of_seconds, videoId) {
    const start = secondsToHHMMSS(
        number_of_seconds <= 5 ? 0 : number_of_seconds - 5
    );
    const end = secondsToHHMMSS(number_of_seconds + 15);
    const outputName = `youglish_${word}_${videoId}_audio.mp3`;
    console.log(`seconds :`, number_of_seconds);
    console.log(`start :`, start);
    console.log(`end :`, end);

    return `ffmpeg -i ${path2SaveFile}/temp_${outputName} -ss ${start} -to ${end} ${path2SaveFile}/${outputName}; rm -rf ${path2SaveFile}/temp_${outputName}`;
}

async function runCommands(cmd1, cmd2) {
    try {
        console.log('➡️ Running yt-dlp...');
        await execPromise(cmd1);

        console.log('🎬 yt-dlp done. Now running ffmpeg...');
        await execPromise(cmd2);

        console.log('✅ All commands finished.');
    } catch (err) {
        console.error('❌ Error:', err.stderr || err.message);
    }
}

export async function videoAudioDL(word, videoLink) {
    const { videoId, startTime } = getVideoIdAndStartTime(videoLink);

    console.log(`Lien :`, videoLink);
    console.log(`Video ID :`, videoId);
    console.log(`Start Time :`, startTime);

    const cmd1 = generate_yt_dlp_cmd(word, videoId);
    const cmd2 = generate_ffmpeg_cmd(word, startTime, videoId);

    await runCommands(cmd1, cmd2);
}
