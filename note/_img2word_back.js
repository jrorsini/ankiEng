setTimeout(() => {
    const wordTypeColor = {
        n: 'noun_type_color',
        v: 'verb_type_color',
        a: 'adjv_type_color',
    };
    // replace "|" by "b" tags for revealing_text.

    // replace "|" by "b" tags for example_fr.
    const example_en = document
        .getElementById('example_en')
        .innerHTML.replace(
            /\|+[\w\s]+\|/gi,
            (m) => `<b class="example_en_b">${m.slice(1, -1)}</b>`
        );
    console.log(example_en);
    document.getElementById('example_en').innerHTML = example_en;
}, 100);
