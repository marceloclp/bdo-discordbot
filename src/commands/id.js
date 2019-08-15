const BDOScraper        = require('bdo-scraper')
const { debug, locale } = require('./../config.json')

const {
    map_grade_to_icon,
    map_type_to_icon,
    padding,
    getCellWidth,
} = require('./lib')

const formatArr = (arr, header, icon) => {
    if (!arr.length)
        return null
    
    return [
        `**${header}:**`,
        arr.map(str => `${icon}${str}`).join('\n'),
        ''
    ].join('\n')
}

const formatStats = (stats) => {
    if (stats.damage === null)
        return null

    const width = getCellWidth(Object.values(stats))

    return [
        `**Stats:**`,
        [':dagger: `',            `| Damage (AP)      | ${stats.damage     + padding(width, stats.damage)} |\``    ].join(''),
        [':shield: `',            `| Defense (DP)     | ${stats.defense    + padding(width, stats.defense)} |\``   ].join(''),
        [':bow_and_arrow: `',     `| Accuracy         | ${stats.accuracy   + padding(width, stats.accuracy)} |\``  ].join(''),
        [':rabbit: `',            `| Evasion          | ${stats.evasion    + padding(width, stats.evasion)} |\``   ].join(''),
        [':helmet_with_cross: `', `| Damage Reduction | ${stats.dreduction + padding(width, stats.dreduction)} |\``].join(''),
        ''
    ].join('\n')
}

const formatMsg = (author, item) => {
    return [
        // Forces textbox to be highlighted for the user who made the request.
        `${author}\n`,

        // Item name (item english name)
        `**__${item.name}__**` + (item.name_en ? ` *(${item.name_en})*` : ''),
        item.description,

        [
            `**Type:** ${map_type_to_icon(item.type)}`,
            `**Grade:** ${map_grade_to_icon(item.grade)}`,
            `**Weight:** ${item.weight}\n`,
        ].join(' | '),

        formatArr(item.item_effects,   'Item Effects',        ':small_blue_diamond: '),
        formatArr(item.enhanc_effects, 'Enhancement Effects', ':small_orange_diamond: '),
        formatStats(item.stats),

        item.link
    ].filter(e => e).join('\n')
}

const cmd = (msg, id) => {
    if (debug) {
        console.log([
            `[!id] ${msg.author.username} => ${id}`
        ].join('\n'))
    }

    const isLocaleEn = locale === 'en'
    const uri        = `https://bdocodex.com/${locale}/item/${id}`

    BDOScraper.loadMultiple([
        `${uri}.`,
        !isLocaleEn ? uri.replace(locale, 'en') : null
    ].filter(e => e)).then(scrapers => {
        let item = {}

        scrapers.forEach(scraper => {

            // Default language scraper.
            if (scraper._uri.substr(-1) === '.') {
                item.name           = scraper.getName()
                item.grade          = scraper.getGrade()
                item.stats          = scraper.getStats()
                item.weight         = scraper.getWeight()
                item.item_effects   = scraper.getItemEffects()
                item.enhanc_effects = scraper.getEnhancementEffects()
                item.description    = scraper.getDescription()
                item.link           = uri

                if (isLocaleEn)
                    item.type = scraper.getType()
            }

            // English scraper if english is not the default language.
            else {
                item.type    = scraper.getType()
                item.name_en = scraper.getName()
            }

        })

        msg.channel.send(formatMsg(msg.author.toString(), item))
    })
}

module.exports = cmd