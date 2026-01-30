import { exec } from 'child_process';
import util from 'util';

export function getVideoIdAndStartTimeFromYoutubeURL(url) {
    console.log(`l'url en question ${url}`);

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
        const videoId = urlObj.pathname.split('/')[2]; // i.e. "CxouIJKVpaw"
        const startTime = urlObj.searchParams.get('start'); // i.e. "34"

        let shortUrl = `https://youtu.be/${videoId}`;
        if (startTime) shortUrl += `?t=${startTime}`;

        return shortUrl;
    } else {
        return url;
    }
}

// convert seconds to HH:MM:SS
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

// yt-dlp "<VIDEO_URL>" --download-sections "*00:02:15-00:03:10" -o "clip.mp4"

function generate_yt_dlp_cmd(word, videoId, number_of_seconds) {
    const start = secondsToHHMMSS(
        number_of_seconds <= 5 ? 0 : number_of_seconds - 4
    );
    const end = secondsToHHMMSS(number_of_seconds + 10);
    const cmd = `yt-dlp \
                --download-sections "*${start}-${end}" \
                --cookies-from-browser safari \
                -x --audio-format mp3 \
                -o "${path2SaveFile}/temp_source_audio_${word}_${videoId}_audio.mp3" \
                "https://www.youtube.com/watch?v=${videoId}"
                `;
    // const cmd = `yt-dlp -x --audio-format mov -o "${path2SaveFile}/nonTreated-audio_${word}_${videoId}_audio.mp3" --cookies-from-browser safari "https://www.youtube.com/watch?v=${videoId}" --download-sections "*${start}-${end}"`;
    return cmd;
}

function generate_ffmpeg_cmd(word, videoId) {
    const outputName = `source_audio_${word}_${videoId}_audio`;
    return `ffmpeg -i "${path2SaveFile}/temp_${outputName}.mp3"  "${path2SaveFile}/nonTreated-${outputName}.mov";`;
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

export async function downloadVideoAudio(word, videoLink) {
    const { videoId, startTime } =
        getVideoIdAndStartTimeFromYoutubeURL(videoLink);

    console.log(`Lien :`, videoLink);
    console.log(`Video ID :`, videoId);
    console.log(`Start Time :`, startTime);

    console.log(word);

    let formattedWord = word
        .replace(/\[sth\/sb\]/gi, 'sth or sb')
        .replace(/\[sth\]/gi, 'sth')
        .replace(/\[sb\]/gi, 'sb');

    const cmd1 = generate_yt_dlp_cmd(formattedWord, videoId, startTime);
    const cmd2 = generate_ffmpeg_cmd(formattedWord, videoId);

    // await runCommands(cmd1);
    await runCommands(cmd1, cmd2);
}
