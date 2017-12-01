const functions = require('./functions.js');
const credentials = require('../credentials.json');
const Discord = require('discord.js');
const HashMap = require('hashmap');
const client = new Discord.Client();
const moment = require('moment');

var permitted = new HashMap();
//Because message changes when bot responds we need to store available commands 
var commands = ["!permit", "!remove", "!open", "!permissions", "!help"];
// July 9th 2017, 8:50:10 pm
var canOpen = true;
var startTime = moment();
var requestCounter = 1;
var currentTime = 0;
var list;
var command;
var user;
var time;
var reply = '';
var value = 0;

client.on("error", (error) => {
    console.log("An error occured: " + error);
});

client.on("message", (message) => {
    //Split message into command, users, time so we have them readily available
    list = message.content.split(' ');
    command = list[0];
    user = list[1];
    time = list[list.length - 1];
    reply = '';
    //console.log(message);
    //Check if permission expired
    permitted.forEach((value, key) => {
        //Remove expired users
        if (((value / 1000 / 60) - (new Date).getTime() / 1000 / 60) <= 0) permitted.remove(key);
    });
    var messageHandler = new Promise((resolve, reject) => {
        if (list.length > 1 && commands.indexOf(command) > -1) { //Check that message is from user and not bot
            if (message.author.id !== credentials.user.id) return reject("You are not <@' + credentials.user.id + '>");
            console.log(command);
            switch (command) { //actions with parameters
                case "!permit":
                    if (isNaN(time)) time = 60; //No time was given
                    message.mentions.users.map(user => {
                        permitted.set(user.id, (new Date).getTime() + (60 * (time) * 1000));
                    });
                    message.reply('The following users have been granted permission: \n');
                    //Print hashmap
                    permitted.forEach((value, key) => { //forEach is blocking
                        value = (value - ((new Date).getTime())) / 1000 / 60;
                        reply += '<@' + key + '>' + ' : ' + Math.floor(value) + ' Minutes left' + '\n';
                    });
                    //Action was allowed
                    resolve(reply);
                    break;
                case "!remove":
                    //could not remove self or user is not admin
                    if (message.author.id !== credentials.user.id) return reject("You do not have permission to do that");
                    message.mentions.users.map((user => {
                        permitted.delete(user.id);
                        reply += ('Ok, removed <@' + user.id + '>' + '\n');
                    }));
                    resolve(reply !== "" ? reply : "Ok, removed <@" + message.author.id + ">");
            }
        } else {
            switch (message.content) { //actions witout parameters
                case "!open":
                    if (message.author.id !== credentials.user.id || permitted.has(message.author.id)) return reject("You do not have permission to do that");
                    else if(currentTime - ((new Date).getTime()) > 0) return reject('You need to wait another: ' + Math.floor(((currentTime/1000) - ((new Date).getTime())/1000)) + ' seconds');
                    currentTime = (new Date).getTime()+(1000*30);
                    
                    message.reply('Ok, please wait...');
                    functions.open_door(credentials.login.id, credentials.login.pwd, (data) => {
                        //Wait for callback
                        resolve(data);
                    });
                    break;
                case "!permissions":
                    message.reply('Authorized users: \n');
                    permitted.forEach(function (value, key) {
                        value = Math.floor((value - ((new Date).getTime())) / 1000 / 60);
                        if (!isNaN(value)) reply += '<@' + key + '>' + ' : ' + value + ' Minutes left' + '\n';
                    });
                    resolve(reply !== "" ? reply : "There are no permitted users");
                    break;
                case "!uptime":
                    resolve("I have been online since: `"
                        + startTime.format('MMMM Do YYYY, h:mm:ss a')
                        + "`, about " + startTime.fromNow() + "\n"
                        + requestCounter + " requests handled");
                    break;
                case "!help":
                    resolve('Available commands: \n\n'
                        + '`!help` displays this message\n'
                        + '`!uptime` returns elapsed time since the bot was started and handled requests during that time\n\n'
                        + '`!permit` grants a user permission to open door. Only available to <@' + credentials.user.id + '>\n'
                        + '`!permissions` returns a list of permitted users. Only available to currently permitted users\n'
                        + '`!remove` removes a user from the list of permitted users. Only available to <@' + credentials.user.id + '>\n'
                        + '`!open` opens the door. Only available to permitted users. This command will start a 30 second cooldown timer.\n\n'
                        + 'You can find the source code at https://github.com/M4nnogroth/Gibbot\n');
                    break;
            }
        }
    });
    messageHandler.then(res => {
        requestCounter++;
        message.channel.sendMessage(res);
    }).catch(err => {
        message.channel.sendMessage(err);
        console.log(err);
    });
});

client.on("disconnect", () => {
    console.log("Connection timed out, reconnecting...");
    //client.connect();
});

client.login(credentials.bot.token);
