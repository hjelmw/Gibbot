
## ⚠️Update⚠️
This bot is no longer working since Chalmers Studentbostäder have made updates to their website. Please consider checking out my more recent attempt at wrapping an API around the functions provided to tenants of CHS! [chs-studentbostader-api](https://github.com/whjelm/chs-studentbostader-api)


# Gibbot 🤖
Permission based door opener for residents at Chalmers studentbostäder.

#### Feature list
* Remotely opens the front door of Gibraltargatan 94 (Emilsborg) 🔑🚪
* Written in [node.js](https://nodejs.org/en/)
* Web scraping with [nightmare.js](http://www.nightmarejs.org/)👻
* Communicates via [discord.js](https://discord.js.org/#/)💬
* Permission based ✋🤖
* Could at one point play music 🎙️🤖

See attached images for examples.

## How to use
1. Change name of credentials_template.json to credentials.json and replace with your own data
2. npm install (discord.js might complain about opus. Ignore this)
3. npm start

# Images
![simsalabim](https://raw.githubusercontent.com/whjelm/Gibbot/master/img/door_open_gibbot.jpg)
![amazing functionality](https://raw.githubusercontent.com/whjelm/Gibbot/master/img/permit_user.jpg)



## TODO
* Optimize login, currently very slow
