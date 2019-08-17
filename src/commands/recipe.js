const BDOScraper = require('bdo-scraper')
const { debug, locale } = require('./../config.json')
const { map_grade_to_icon, parseTable } = require('./lib')

const sendSuccess = (msg, recipes, item, num, author = msg.author.toString()) => {
    const header = [
        `__**${item.name}**__`,
        item.description,
        [
            `**Type:** ${item.type}`,
            `**Grade:** ${map_grade_to_icon(item.grade)}`,
            `**Weight:** ${item.weight}`,
        ].join(' | '),
    ].filter(e => e).join('\n')

    const tables = recipes.map(recipe => {
        const { materials } = recipe
        const ids   = materials.map(e => e.id)
        const names = materials.map(e => e.name)
        const nums  = materials.map(e => e.amount.toString())
        const nums2 = num ? materials.map(e => (e.amount * parseInt(num)).toString()) : []
        const links = materials.map(e => `https://bdocodex.com${e.link}`)

        return parseTable([
            { header: 'ID', data: ids },
            { header: `Name (${locale.toUpperCase()})`, data: names },
            { header: 'Amount', data: nums },
            { header: `Amount (${num})`, data: nums2 },
        ]).split('\n').map((e, i) => {
            if (i === 0)
                return e
            return `${e} <${links[i-1]}>`
        }).join('\n')
    })

    const res = [
        author + '\n',
        header,
        tables.map((e, i) => `\n**RECIPE #${i+1}**\n${e}`).join('\n'),
        `\n${item.link}`
    ].join('\n')

    msg.channel.send(res)
}

const sendError = (msg, id, uri, author = msg.author.toString()) => {
    const res = [
        `Oops, ${author}, it seems item **${id}** doesn't exist. Maybe check the link below :)`,
        `<${uri}>`
    ].join('\n')
    msg.channel.send(res)
}

module.exports = (msg, args) => {
    if (debug)
        console.log(`[!recipe] ${msg.author.username} => ${args.join(' ')}`)

    const [id, num] = args
    const uri       = `https://bdocodex.com/${locale}/item/${id}/`

    BDOScraper.load(uri).then(item => {
        if (!item) {
            sendError(msg, id, uri)
            return
        }

        const data = {
            name:        item.getName(),
            type:        item.getType(),
            grade:       item.getGrade(),
            weight:      item.getWeight(),
            description: item.getDescription(),
            link:        item._uri,
        }

        item.getRecipesFromItem().then(recipes => {
            sendSuccess(msg, recipes, data, num)
        })
    })
}