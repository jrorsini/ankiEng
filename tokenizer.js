import kuromoji from 'kuromoji';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const moduleURL = new URL(import.meta.url);
const modulePath = dirname(fileURLToPath(moduleURL));

export function getTokenizer() {
    return new Promise((resolve, reject) => {
        kuromoji
            .builder({ dicPath: `${modulePath}/node_modules/kuromoji/dict` })
            .build(async function (err, tokenizer) {
                if (err) reject(err);
                resolve(tokenizer);
            });
    });
}

export const tokenizer = await getTokenizer();
