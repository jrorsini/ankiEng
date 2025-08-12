import OpenAI from 'openai';
// import chalk from 'chalk';
import 'dotenv/config';
import axios from 'axios';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

export async function getJapaneseWordSampleSentence(word) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `Donne-moi une phrase exemple (assez simple/accessible) utilisant le mot "${word}" selon le format suivant en encadrant avec les balises <b></b> juste le mot en question dans la phrase exemple et sa traduction dans l'exemple en français (et juste cela s'il te plaît) : [phrase exemple en japonais]<br/>[phrase exemple traduite en français]`,
            },
        ],
        model: 'gpt-3.5-turbo',

        // {jp: [phrase exemple en japonais], fr: [phrase exemple traduite en français]}
    });
    return completion.choices[0].message.content;
}

export async function getJapaneseWordComposition(word) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `
                Donne-moi une explication concise de la composition du mot ${word} selon le format suivant :
                    ✅ [kanji 1] = [sens simple en français]   
                    ✅ [kanji 2] = [sens simple en français]
                    🔁 [${word}] = [interprétation intuitive du mot, en une phrase courte en français]
                    🎥 Astuce mnémotechnique : 
                Ne donne rien d’autre.`,
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
}

export async function getJapaneseSourceTranscriptTranslation(transcript) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `Donne-moi la traduction en Français de la phrase suivante "${transcript}" ET JUSTE la traduction`,
            },
        ],
        model: 'gpt-3.5-turbo',
    });
    return completion.choices[0].message.content;
}

export async function getKanjiMnmemotechnique(kanji) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `
                    Donne-moi un moyen mnémotechnique simple et visuel pour retenir le kanji [${kanji}], en décomposant ses composants si possible. 
                    Donne une explication claire, une petite histoire ou image mentale pour l’associer à son sens, et une phrase mnémotechnique facile à retenir.
                `,
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
}

export async function getJapaneseWordCompositionOld(word) {
    // ref: https://chatgpt.com/c/6825b540-f71c-8000-830d-3723215cffef
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `
                Donne-moi une explication concise de la composition du mot ${word} selon le format suivant :
                    ✅ [kanji 1] = [sens simple en français]   
                    ✅ [kanji 2] = [sens simple en français]
                    🔁 [${word}] = [interprétation intuitive du mot, en une phrase courte en français]
                    🎥 Astuce mnémotechnique : 
                Ne donne rien d’autre.`,
            },
        ],
        model: 'gpt-4.1',
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
