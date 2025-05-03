// 'https://www.youtube.com/embed/CxouIJKVpaw?playsinline=1&iv_load_policy=3&rel=0&showinfo=0&controls=1&fs=0&start=34&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fyouglish.com&widgetid=1&forigin=https%3A%2F%2Fyouglish.com%2Fpronounce%2F%25E4%25B8%25A1%25E5%259B%25BD%2Fjapanese&aoriginsup=1&vf=6';
// Output: "https://youtu.be/CxouIJKVpaw?t=34s"
function convertYouTubeEmbedToShort(url) {
    const urlObj = new URL(url);
    const videoId = urlObj.pathname.split('/')[2]; // "CxouIJKVpaw"
    const startTime = urlObj.searchParams.get('start'); // "34"

    let shortUrl = `https://youtu.be/${videoId}`;
    if (startTime) {
        shortUrl += `?t=${startTime}s`;
    }

    return shortUrl;
}
