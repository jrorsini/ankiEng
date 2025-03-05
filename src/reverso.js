import Reverso from 'reverso-api';
const reverso = new Reverso();

export async function getTranslationFromReverso(userInput) {
    let data = await reverso.getTranslation(
        userInput,
        'english',
        'french',
        (err, response) => {
            if (err) throw new Error(err.message);

            return response;

            // console.log(response);
            // console.log(response.context);
            // console.log(response.context.examples[0]);
        }
    );

    return [...new Set(data.translations)];
}
