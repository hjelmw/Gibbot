const functions = require('./functions.js');
const credentials = require('./credentials.json');
const Discord = require('discord.js');
const HashMap = require('hashmap');
const client = new Discord.Client();

//Not required but nice to have
var permitted = new HashMap();

client.on('message', message =>{
	var list = message.content.split(' ');
	var command = list[0];
	var user = list[1];



	if(command === '!permit' && user != ''){
		//Only correct user grants permissions
		if(message.author.username === credentials.user.username 
			&& message.author.discriminator === credentials.user.discriminator) {

			permitted.set(user, (new Date).getTime());
			message.reply('``@'+user + '`` has permission to open door for 1 hour');
		}
	}

	else if(message.content === '!permissions') {
		permitted.forEach(function(value, key) {
			message.reply(key + ' : ' + value);
		});	
	}

	else if(message.content === '!open') {
		permitted.forEach(function(value, key) {
			if((message.author.username + '#' + message.author.discriminator) === key){
				message.reply('ok');
			}

			});
		}
		else {message.reply('You do not have permission to open the door!')}
	})

client.login('MjYyMDEyODk5MTk3ODQ1NTA0.Cz9WSA.nBlCJy9nlzD7KLOWZvG9TvrRxmo');