
## ⚠️Update⚠️
This bot is no longer working since CHS made updates to their website 😭. Check out my the next iteration instead! [chs-studentbostader-api]()


# Gibbot 🤖
Permission based door opener for residents at Chalmers studentbostäder written in [node.js](), [nightmare](https://github.com/segmentio/nightmare) and communicating via [Discord](). The bot uses web scraping to find its way through the CHS website with the goal of opening one of the buildings front doors.

#### Feature list
* Remotely opens the door of Gibraltargatan 94 (Emilsborg) 🔑🚪
* Permission based ✋🤖
* Could at one point play music 🎙️🤖🎵 (why though❓🤔)

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
