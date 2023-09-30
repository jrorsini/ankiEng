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

    // replace "|" by "b" tags for revealing_text.
    document.getElementById("revealing_text").style.opacity = 1;
    const revealing_text = document.getElementById("revealing_text").innerHTML;
    const revealing_text_match = revealing_text.match(/\|.+\|/gi);

    // Call the function with the target sentence element
    const sentenceBreakDown = document.getElementById("revealing_text");
    fadeWords(sentenceBreakDown);
}, 100);
