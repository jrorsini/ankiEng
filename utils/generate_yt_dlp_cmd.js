import {
    secondsToHHMMSS,
    getYoutubeStartTimeSeconds,
    convertYouTubeEmbedToShort,
} from './embed-video-link-handler.js';

export function generate_yt_dlp_cmd(word, youtube_link) {
    const youtubeURL = convertYouTubeEmbedToShort(youtube_link).split('?')[0];
    const outputName = `temp_${word}_audio`;

    return `cd ~/Library/Application\ Support/Anki2/User\ 1/collection.media/; yt-dlp -x --audio-format mp3 -o "${outputName}.%(ext)s" "${youtubeURL}"`;
}

export function generate_ffmpeg_cmd(word, youtube_link) {
    let number_of_seconds = getYoutubeStartTimeSeconds(
        convertYouTubeEmbedToShort(youtube_link)
    );

    const start = secondsToHHMMSS(number_of_seconds - 2);
    const end = secondsToHHMMSS(number_of_seconds + 10);
    const outputName = `youglish_${word}_audio.mp3`;

    return `cd ~/Library/Application\ Support/Anki2/User\ 1/collection.media/; ffmpeg -i temp_${outputName} -ss ${start} -to ${end} ${outputName} && rm temp_${outputName}`;
}
