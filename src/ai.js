import OpenAI from 'openai';
import chalk from 'chalk';

const openai = new OpenAI();

export async function wordAndSynonymNuanceDiff(word, wordType, synonym) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `
                    Hello, I need you to explain to me 
                    why using the ${wordType} "${word}" over "${synonym}" ? 
                    I need to understand the nuance of it.
                `,
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
}

/*

https://mail.google.com/mail/u/0/#search/matt/FMfcgzQbfBzPWJFTffBdjtdfgWDFwvzj

I will give you a Japanese text and a word from that text. Explain what the word means in English (not the sentence, the word).

Don’t just give an English translation; actually explain what the word means in a similar manner to how the word would be explained in a Japanese-to-Japanese dictionary for native Japanese speakers, but in English. Avoid using direct English equivalents of the word. Explain 100% in English, without using any Japanese.

If there are multiple meanings, only explain the "core meaning" of the word (not just what the word means in this particular sentence).

Since the result will be fed directly to a text-to-speech program, so don't repeat the word itself, and skip introductory comments like "I will explain X". Just start explaining straight away.

Explain the entire thing in one sentence. Try to make the explanation as intuitive as possible, using plain language. Keep the explanation short (around 15 words max, but less if that isn't needed).

*/
