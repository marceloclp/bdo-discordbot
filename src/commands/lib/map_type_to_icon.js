/**
 * Returns a discord icon based on an item's type.
 * 
 * @param {string} type The item's type in en locale.
 */
module.exports = (type) => {
    const icons = {
        'Equipment':          ':crossed_swords: ',
        'Installable Object': ':couch: ',
        'Special Items':      ':moneybag: ',
        'Crafting Materials': ':gem: ',
        'General':            ':large_orange_diamond: ',
        'Consumable':         ':tropical_drink: ',
    }
    if (icons.hasOwnProperty(type))
        return icons[type]
    return ':black_small_square: '
}