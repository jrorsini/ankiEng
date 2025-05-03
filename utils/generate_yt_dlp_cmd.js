function getYoutubeStartTimeSeconds(url) {
    const parsedUrl = new URL(url);
    const timeParam = parsedUrl.searchParams.get('t');

    if (!timeParam) return 0;

    if (/^\d+$/.test(timeParam)) {
        // Just seconds, like ?t=90
        return parseInt(timeParam, 10);
    }

    // Handle format like 1h2m30s
    const regex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
    const match = timeParam.match(regex);

    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds;
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

export function generate_yt_dlp_cmd(word, youtube_link) {
    const youtubeURL = youtube_link.split('?')[0];
    const outputName = `temp_${word}_audio`;

    return `yt-dlp -x --audio-format mp3 -o "${outputName}.%(ext)s" "${youtubeURL}"`;
}

export function generate_ffmpeg_cmd(word, youtube_link) {
    let number_of_seconds = getYoutubeStartTimeSeconds(youtube_link);

    const start = secondsToHHMMSS(number_of_seconds - 2);
    const end = secondsToHHMMSS(number_of_seconds + 8);
    const outputName = `${word}_audio.mp3`;

    return `ffmpeg -i temp_${outputName} -ss ${start} -to ${end} ${outputName} && rm temp_${outputName}`;
}
