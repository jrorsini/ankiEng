// 'https://www.youtube.com/embed/CxouIJKVpaw?playsinline=1&iv_load_policy=3&rel=0&showinfo=0&controls=1&fs=0&start=34&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fyouglish.com&widgetid=1&forigin=https%3A%2F%2Fyouglish.com%2Fpronounce%2F%25E4%25B8%25A1%25E5%259B%25BD%2Fjapanese&aoriginsup=1&vf=6';
// Output: "https://youtu.be/CxouIJKVpaw?t=34s"
export function convertYouTubeEmbedToShort(url) {
    console.log('url :', url);

    const urlObj = new URL(url);
    const videoId = urlObj.pathname.split('/')[2]; // "CxouIJKVpaw"
    const startTime = urlObj.searchParams.get('start'); // "34"

    let shortUrl = `https://youtu.be/${videoId}`;

    console.log(shortUrl);
    console.log(videoId);
    if (startTime) shortUrl += `?t=${startTime}s`;

    return { videoId, shortUrl };
}

// Fetched applescript youtube link converting handler from link like this : https://www.youtube.com/watch?v=Zd7rS7s6sts&list=PL5bLw9Uguvv1VRVl3gHBt-FcM__k3UY9L&index=5&t=95
// to this : https://youtu.be/Zd7rS7s6sts?t=95
export function convertYoutubeURL(longUrl) {
    const url = new URL(longUrl);

    // Extract video ID
    const videoId = url.searchParams.get('v');

    // Extract timestamp if present
    const timestamp = url.searchParams.get('t');

    // Build short URL
    let shortUrl = `https://youtu.be/${videoId}`;
    shortUrl += timestamp ? `?t=${timestamp}` : ``;

    return shortUrl;
}
