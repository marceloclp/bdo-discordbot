/**
 * Formats a string into a list according to the Discord markdown guidelines.
 * 
 * @param {string} header Header text.
 */
module.exports = (header) => {
    return `**${header}:**\n`
}