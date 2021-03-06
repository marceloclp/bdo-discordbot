# BDO Discord Bot

A bot for Discord that displays information about Black Desert Online retrieved from BDOCodex. Powered by [bdo-scraper](https://github.com/marceloclp/bdo-scraper) and built with Discord.js.

## Installation

To host your own version of the Bot, you can follow these steps:
1) Go to the [Discord Dev Portal](https://discordapp.com/developers/applications/) page and click on "New Application".
2) Fill out the name for your bot. You can change it later.
3) After created, add the Bot to your server by replacing the `CLIENTID` in the following uri `https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8` with your Bot's client id which can be found on the page.
4) Click to reveal the Client Secret and copy it.
5) Download this repository and install the latest version of [NodeJS](https://nodejs.org/en/).
6) Go to the repository folder and open the `src/config.json`.
7) Paste your client secret into the token slot.
8) Open the cmd on the root folder and type `npm install` and wait for the download to finish.
9) Finally type `npm start` and the bot should start.

## Configuration

As of now you can change the `prefix` and the primary language of the bot by going to `src/config.json`. For the primary language, change `locale` to one of the following
```javascript
"us" // => english
"pt" // => portuguese
``` 

## Usage

Currently the bot is only capable of looking up items based on a search term, and get data from an id.

#### `!search <search term>`
Displays a list of the items with the most similar names to the search term provided.
![!search](https://github.com/marceloclp/bdo-discordbot/blob/master/docs/bot-search.png?raw=true)

#### `!tem <item id>`
Displays information about the item corresponding to the id provided.
(The image bellow is outdated, the current command is `!item`, not `!id`.)
![!item](https://github.com/marceloclp/bdo-discordbot/blob/master/docs/bot-id.png?raw=true)

#### `!recipe <item id> <craft amount (optional)>`
Displays the recipes for the item corresponding to the id provided. Be careful to provide the `id` for an item, rather than the `id` for a recipe.

**NOTE:** Currently, it only supports __cooking__ recipes. Anything else may cause the bot to crash.
![!recipe](https://github.com/marceloclp/bdo-discordbot/blob/master/docs/bot-recipe.png?raw=true)