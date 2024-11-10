import OpenAI from 'openai';
import chalk from 'chalk';

const openai = new OpenAI();

export async function wordAndSynonymNuanceDiff(word, synonym) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `Hello, I need you to explain to me. 
                In a grammar quizz, for this question: ${question} I chose to fill the "[ _ ]" blank part with ${wrong_answer} instead of ${right_answer}. 
                Could you explain to me why I was wrong`,
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
}
