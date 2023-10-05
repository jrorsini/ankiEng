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
    document.getElementById("example_fr").classList.add(wordTypeClass);

    // replace "|" by "b" tags for revealing_text.
    revealText();

    // replace "|" by "b" tags for example_fr.
    const example_fr = document.getElementById("example_fr").innerHTML;
    const example_fr_match = example_fr.match(/\|.+\|/gi);

    document.getElementById("example_fr").innerHTML = example_fr.replace(
        /\|.+\|/gi,
        `<b id="example_fr_b">${example_fr_match[0].slice(1, -1)}</b>`
    );
}, 100);
