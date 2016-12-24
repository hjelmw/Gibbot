const functions = require('./functions.js');
const credentials = require('./credentials.json');
const Discord = require('discord.js');
const HashMap = require('hashmap');
const client = new Discord.Client();

var permitted = new HashMap();
var reply = '';

client.on('message', message =>{
	var list = message.content.split(' ');
	var command = list[0];
	var user = list[1];

	var value = 0;


	//check if permission expired
	permitted.forEach(function(value, key) {
		if((message.author.username + '#' + message.author.discriminator) === key){
			//Does user still have permission
			if(Math.floor((value-((new Date).getTime())/1000/60) <= 0)) {
				permitted.remove(key);		
			}
		}
	});

	if(command === '!permit' && user != ''){
		//Only correct user grants permissions
		if(message.author.username === credentials.user.username 
			&& message.author.discriminator === credentials.user.discriminator) {
			
			//user should be name#number
			var usercheck = user.split('#');
			if(usercheck[0] != '' && !isNaN(usercheck[1])) {
				permitted.set(user, (new Date).getTime()+(60*60*1000));
				message.reply('``@'+user + '`` Has permission to open door for 1 hour');
			}
			else {
				message.reply('Not a valid user `' + user + '`');
			}
		}
		else {
			message.reply('You are not `'+credentials.user.username + '#' + credentials.user.discriminator + '`');
		}
	}

	else if(message.content === '!permissions') {
		message.reply('Authorized Users: ');
		permitted.forEach(function(value, key) {
			value = Math.floor((value-((new Date).getTime()))/1000/60);
			reply += '``'+key + ' : ' + value + ' Minutes left' + '\n';
		});
		//End markdown
		reply += '``';
		message.reply(reply);
	}

	else if(message.content === '!open') {
		permitted.forEach(function(value, key) {
			if((message.author.username + '#' + message.author.discriminator) === key){
				//Does user still have permission
				if(Math.floor((value-((new Date).getTime())/1000/60)>0)) {
					//functions.open_door(id, pwd);
					message.reply('ok');
				}
				else {
					message.reply('Permission expired `' + user + '`');
					permitted.remove(key);
				}
			}

			});
		}
	})

client.login(credentials.token);