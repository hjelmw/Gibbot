const functions = require('./functions.js');
const credentials = require('../credentials.json');
const Discord = require('discord.js');
const HashMap = require('hashmap');
const client = new Discord.Client();
const moment = require('moment');

var permitted = new HashMap();
//Because message changes when bot responds we need to store available commands 
var commands = ["!permit", "!delete", "!open", "!permissions", "!help"];
// July 9th 2017, 8:50:10 pm
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
    Console.log("An error occured: " + error);
});

client.on("message", (message) => {
    //Split message into command, users, time so we have them readily available
    list = message.content.split(' ');
    command = list[0];
    user = list[1];
    time = list[list.length - 1];
    reply = '';
    //Check if permission expired
    permitted.forEach((value, key) => {
        //Remove expired users
        //TODO replace with moment
        if (((value / 1000 / 60) - (new Date).getTime() / 1000 / 60) <= 0) permitted.remove(key);
    });
    var messageHandler = new Promise((resolve, reject) => {
        if (list.length > 1 && commands.indexOf(command) > -1) { //Check that message is from user and not bot
            if (message.author.id !== credentials.user.id) reject("You are not <@' + credentials.user.id + '>");
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
                case "!delete":
                    message.mentions.users.map((user => {
                        permitted.remove(user.id);
                        reply += ('Ok, deleted <@' + user.id + '>');
                    }));
                    resolve(reply);
                    break;
            }
        } else {
            switch (message.content) { //actions witout parameters
                case "!open":
                    //opens needs extra check for permission
                    if (message.author.id !== credentials.user.id) reject("You are not <@' + credentials.user.id + '>");
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
                        if (!isNaN) reply += '<@' + key + '>' + ' : ' + value + ' Minutes left' + '\n';
                        else reply += 'None';
                    });
                    resolve(reply);
                    break;
                case "!help":
                    resolve('Available commands: \n\n'
                        + '`!permit` grants a user permission to open door. Only available to <@' + credentials.user.id + '>\n'
                        + '`!permissions` returns a list of permitted users. Only available to currently permitted users\n'
                        + '`!remove` removes a user from the list of permitted users. Only available to <@' + credentials.user.id + '>\n'
                        + '`!open` opens the door. Only available to permitted users. This command will start a 30 second cooldown timer.\n\n'
                        + 'You can find the source code at https://github.com/M4nnogroth/Gibbot\n');
                    break;
                case "!uptime":
                    resolve("I have been online since: `"
                        + startTime.format('MMMM Do YYYY, h:mm:ss a')
                        + "`, about " + startTime.fromNow() + "\n"
                        + requestCounter + " requests handled");
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

client.on("disconnect",() => {
    console.log("Connection timed out, reconnecting...");
    client.connect();
});

client.login(credentials.bot.token);
