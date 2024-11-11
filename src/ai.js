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
