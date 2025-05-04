// 'https://www.youtube.com/embed/CxouIJKVpaw?playsinline=1&iv_load_policy=3&rel=0&showinfo=0&controls=1&fs=0&start=34&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fyouglish.com&widgetid=1&forigin=https%3A%2F%2Fyouglish.com%2Fpronounce%2F%25E4%25B8%25A1%25E5%259B%25BD%2Fjapanese&aoriginsup=1&vf=6';
// Output: "https://youtu.be/CxouIJKVpaw?t=34s"
export function convertYouTubeEmbedToShort(url) {
    const urlObj = new URL(url);
    const videoId = urlObj.pathname.split('/')[2]; // "CxouIJKVpaw"
    const startTime = urlObj.searchParams.get('start'); // "34"

    let shortUrl = `https://youtu.be/${videoId}`;
    if (startTime) shortUrl += `?t=${startTime}s`;

    return shortUrl;
}

export function getYoutubeStartTimeSeconds(url) {
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

export function secondsToHHMMSS(seconds) {
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

function getBaseYouTubeUrl(url) {
    const baseUrl = url.split('?')[0];
    return baseUrl;
}
