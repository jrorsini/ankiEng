function isPhrasalVerb(inputStr) {
    // List of common particles in phrasal verbs
    const particles = [
        "up",
        "down",
        "in",
        "out",
        "on",
        "off",
        "over",
        "under",
        "back",
        "away",
        "around",
        "through",
        "together",
        "apart",
        "forward",
        "out",
        "off",
    ];

    // Split the input string into words
    const words = inputStr.trim().split(/\s+/);

    // Check if the last word is a particle
    const lastWord = words[words.length - 1];
    if (particles.includes(lastWord)) {
        return true;
    }

    // Check if the last two words form a phrasal verb
    if (words.length > 1) {
        const lastTwoWords = words.slice(words.length - 2);
        const verbParticle = lastTwoWords.join(" ");
        if (particles.includes(lastTwoWords[1])) {
            return true;
        }
    }

    return false;
}

export default isPhrasalVerb;
