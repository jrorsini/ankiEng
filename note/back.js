setTimeout(() => {
    // replace "|" by "b" tags for revealing_text.
    document.getElementById("revealing_text").style.opacity = 1;
    const revealing_text = document.getElementById("revealing_text").innerHTML;
    const revealing_text_match = revealing_text.match(/\|.+\|/gi);

    document.getElementById("revealing_text").innerHTML =
        revealing_text.replace(
            /\|.+\|/gi,
            `<b id="revealing_text_b">${revealing_text_match[0].slice(
                1,
                -1
            )}</b>`
        );

    // replace "|" by "b" tags for example_fr.
    const example_fr = document.getElementById("example_fr").innerHTML;
    const example_fr_match = example_fr.match(/\|.+\|/gi);

    document.getElementById("example_fr").innerHTML = example_fr.replace(
        /\|.+\|/gi,
        `<b id="example_fr_b">${example_fr_match[0].slice(1, -1)}</b>`
    );
    revealText();
}, 100);
