import puppeteer from 'puppeteer';

// Navigate the page to a URL.

async function getPronunciationDiagram(word) {
    console.clear();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Open Google and search for pronunciation

    // https://www.google.com/search?client=safari&rls=en&q=malignant+pronunciation&ie=UTF-8&oe=UTF-8
    await page.goto(
        `https://www.google.com/search?client=safari&rls=en&q=${word}+pronunciation&ie=UTF-8&oe=UTF-8`,
        { waitUntil: 'domcontentloaded' }
    );

    // Extract text from the first <h1> element
    const headingText = await page.evaluate(() => {
        const element = document.querySelector('.TQ7enb'); // Select first <h1>
        return element ? element.textContent.trim() : 'Not found'; // Get text content
    });

    console.log('Heading:', headingText);

    await browser.close();
}

// Example usage
await getPronunciationDiagram('malignant');
