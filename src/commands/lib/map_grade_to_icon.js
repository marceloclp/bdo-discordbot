/**
 * Returns an icon based on the grade of an item.
 * 
 * @param {number || string} grade The item's grade.
 */
module.exports = (grade) => {
    const icons = {
        '0': ':white_medium_square:',
        '1': ':green_heart: ',
        '2': ':blue_heart: ',
        '3': ':yellow_heart: ',
        '4': ':heart: ',
    }
    return icons[grade]
}