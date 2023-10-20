setTimeout(() => {
    const wordTypeColor = {
        n: 'noun_type_color',
        v: 'verb_type_color',
        a: 'adjv_type_color',
    };
    // get word type
    const wordTypeClass =
        wordTypeColor[
            document.getElementById('word_type').innerHTML.slice(0, 1)
        ];

    document.getElementById('revealing_text').classList.add(wordTypeClass);
    document.getElementById('answer').classList.add(wordTypeClass);

    // const example_en = document
    //     .getElementById('revealing_text')
    //     .innerHTML.replace(
    //         /\|+[\w\s]+\|/gi,
    //         (m) => `<b class="example_en_b">${m.slice(1, -1)}</b>`
    //     );
    // document.getElementById('revealing_text').innerHTML = example_en;

    // Call the function with the target sentence element
    revealText();
}, 100);
