setTimeout(() => {
    // turn card's container's opacity to 1
    document.getElementById('card_back_container').style.opacity = 1;

    // retrieve card flag's number
    const flagNumber = document.getElementById('cardflag').innerText;

    // retrieve non selected flags
    flagList = flagList.filter((f) => f !== flagNumber);

    // remove non selected flag's elements

    var elementToMove = document.getElementById(flagNumber);
    var parentElement = elementToMove.parentNode;
    parentElement.insertBefore(elementToMove, parentElement.firstChild);

    flagList.map((f) => {
        document.getElementById(f) && document.getElementById(f).remove();
    });

    // get word type
    const wordTypeClass =
        wordTypeColor[
            document.getElementById('word_type').innerHTML.slice(0, 1)
        ];

    // get word type
    switch (flagNumber) {
        case 'flag1':
            document.getElementById('example_fr').classList.add(wordTypeClass);
            document.getElementById('answer').classList.add(wordTypeClass);
            revealTextFrench();
            revealText();
            break;

        default:
            document
                .getElementById('revealing_text')
                .classList.add(wordTypeClass);
            document.getElementById('answer').classList.add(wordTypeClass);
            revealText();
            break;
    }
}, 100);
