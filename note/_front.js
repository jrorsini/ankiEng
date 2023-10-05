setTimeout(() => {
    const wordTypeColor = {
        n: "noun_type_color",
        v: "verb_type_color",
        a: "adjv_type_color",
    };
    // get word type
    const wordTypeClass =
        wordTypeColor[
            document.getElementById("word_type").innerHTML.slice(0, 1)
        ];

    document.getElementById("revealing_text").classList.add(wordTypeClass);
    document.getElementById("answer").classList.add(wordTypeClass);

    // Call the function with the target sentence element
    revealText();
}, 100);
