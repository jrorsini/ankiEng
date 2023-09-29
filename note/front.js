setTimeout(() => {
    console.log("hello front");

    // replace "|" by "b" tags for revealing_text.
    document.getElementById("revealing_text").style.opacity = 1;
    const revealing_text = document.getElementById("revealing_text").innerHTML;
    const revealing_text_match = revealing_text.match(/\|.+\|/gi);

    // Call the function with the target sentence element
    const sentenceBreakDown = document.getElementById("revealing_text");
    fadeWords(sentenceBreakDown);

    // wcn for => word_char_number
    let wcn = document.getElementById("word_char_number").innerHTML;

    document.getElementById("word_char_number").innerHTML =
        wcn.slice(0, 1).toUpperCase() + wcn.slice(1).replace(/[a-z]/gi, "_");
}, 100);
