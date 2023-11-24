function revealText(elementId) {
    const revealing_text = document.getElementById(elementId).innerHTML;
    document.getElementById(elementId).innerHTML = revealing_text.replace(
        /\|(.*?)\|/gi,
        (e) => `<b>${e.slice(1, -1)}</b>`
    );
}

function highlightToFill(elementId) {
    const revealing_text = document.getElementById(elementId).innerHTML;
    document.getElementById(elementId).innerHTML = revealing_text.replace(
        /\|(.*?)\|/gi,
        (e) => `<b>${e.slice(1, -1).replace(/[\w]/g, '_')}</b>`
    );
}
