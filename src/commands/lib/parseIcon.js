/**
 * Formats a string into a valid icon according to Discord markdown.
 * 
 * @param {string} icon Icon code.
 */
module.exports = (icon) => {
    return `:${icon}: `
}