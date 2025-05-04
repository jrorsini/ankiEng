import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

async function scrapePageContent(word) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // console.time(`Page content ${chalk.green(`scrapped`)}`);
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    );
    await page.goto(`https://youglish.com/pronounce/${word}/japanese`);

    const pageContent = await page.content();
    await browser.close();
    return pageContent;
}

function extractTranscriptAndVideoURL(pageContent) {
    const $ = cheerio.load(pageContent);
    const transcript = $('#r_caption').text();
    const video_url = $('iframe').attr('src');

    return { transcript, video_url };
}

export async function getYouglishEmbededVideoLinkAndTranscript(word) {
    const pageContent = await scrapePageContent(word);
    return extractTranscriptAndVideoURL(pageContent);
}
