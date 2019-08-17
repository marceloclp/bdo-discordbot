const config  = require('./config.json')
const Discord = require('discord.js')
const cmds    = require('./commands')

const client  = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (msg) => {
    if (msg.author.bot || msg.content[0] !== config.prefix)
        return
    
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g)
    const cmd  = args.shift().toLowerCase()
    
    if      (cmd === 'search') cmds.search(msg, args)
    else if (cmd === 'id')     cmds.id(msg, args.join(' '))
    else if (cmd === 'recipe') cmds.recipe(msg, args)
})

try {
    client.login(config.token)
} catch(err) {
    console.log(err)
}