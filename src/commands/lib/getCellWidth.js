/**
 * Returns the maximum width of a virtual cell.
 * 
 * @param {array} arr Array of strings to be reduced into the largest string.
 */
module.exports = (arr) => {
    return arr.reduce((acc, cur) => {
        if (acc > cur.length)
            return acc
        return cur.length
    }, -1)
}