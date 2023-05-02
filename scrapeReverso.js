import Reverso from "reverso-api";
const reverso = new Reverso();

reverso.getTranslation("clear", "english", "french", (err, response) => {
    if (err) throw new Error(err.message);

    // console.log(response.translations);
    // console.log(response.context.examples);
});

reverso.getContext("clear", "english", "french", (err, response) => {
    if (err) throw new Error(err.message);

    console.log(response);
});
