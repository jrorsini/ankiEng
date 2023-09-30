setTimeout(() => {
    // wcn for => word_char_number
    let wcn = document.getElementById("word_char_number").innerHTML;

    document.getElementById("word_char_number").innerHTML =
        wcn.slice(0, 1).toUpperCase() + wcn.slice(1).replace(/[a-z]/gi, "_");
}, 100);
