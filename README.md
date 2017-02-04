# Gibbot
permition based door opener for residents at Chalmers studentbostäder using node.js and discord

## How to use
1. Change name of credentials_template.json to credentials.json and replace with your own data
2. npm install (discord.js might complain about opus. Ignore this)
3. node bot.js

##foreverjs
It seems very possible to run this bot using [foreverjs](https://github.com/foreverjs/forever) in order to prevent exceptions and general hiccups from bringing it down. No extensive testing has been done however so use at your own risk. 

1. forever start bot.js
2. forever stop bot.js
