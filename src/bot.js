const functions = require('./functions.js');
const credentials = require('../credentials.json');
const Discord = require('discord.js');
const HashMap = require('hashmap');
const client = new Discord.Client();

var permitted = new HashMap();
var currentTime = 0;
var list;
var command;
var user;
var time;
var reply = '';
var value = 0;

client.on('message', message =>{
	//Split message into command, users, time so we have them readily available
	list = message.content.split(' ');
	command = list[0];
	user = list[1];
	time = list[list.length - 1];
	reply = '';
	//Assume action was denied
	var status = false;

	//Check if permission expired
	permitted.forEach(function(value, key) {
		//Remove expired users
		if(((value/1000/60)-((new Date).getTime())/1000/60) <= 0) {			
			permitted.remove(key);		
		}
	});
	
	if(command === '!permit' && user != ''){			
		if(message.author.id === credentials.user.id) {
			//No time was given
			if (isNaN(time)) {time = 60;}

			message.mentions.users.map((user => {
				permitted.set(user.id, (new Date).getTime()+(60*(time)*1000));
			}));

			message.reply('The following users have been granted permission: \n');
				
			//Print hashmap
			permitted.forEach(function(value, key) {
				value = (value-((new Date).getTime()))/1000/60;
				reply += '<@' + key + '>' + ' : ' + Math.floor(value) + ' Minutes left' + '\n';
			}); 
				
			message.channel.sendMessage(reply);
				
			//Action was allowed
			status = true;
		}else {message.reply('You are not <@' + credentials.user.id + '>');}
	}

	else if(message.content === '!permissions') {
		if(permitted.has(message.author.id) || message.author.id === credentials.user.id) {
			message.reply('Authorized users: \n');

			permitted.forEach(function(value, key) {	
				value = Math.floor((value-((new Date).getTime()))/1000/60);
					
				if(!isNaN){
					reply += '<@' + key + '>' + ' : ' + value + ' Minutes left' + '\n';
				}
				else {
					reply += '';
				}
			});

			message.channel.sendMessage(reply);
			status = true;
		}
		//Escape ' character
		else {message.reply('You don\'t have permission to do that!');}
	}
		
	else if(message.content === '!open') {
		if(permitted.has(message.author.id) || message.author.id === credentials.user.id) {
			if(currentTime - ((new Date).getTime()) <= 0)	{
				currentTime = (new Date).getTime()+(1000*30);
			}

			else {
				message.reply('You need to wait another: ' + Math.floor(((currentTime/1000) - ((new Date).getTime())/1000)) + ' seconds');
				return;
			}

			//Does user still have permission
			if(permitted.has(message.author.id) || message.author.id === credentials.user.id) {
				if(currentTime - ((new Date).getTime()) >= 0) {

					message.reply('Ok, please wait...');
					//Action was allowed
					status = true;
					functions.open_door(credentials.login.id, credentials.login.pwd, function(data) {
						//Wait for callback
						message.channel.sendMessage(data);
					});
				}
			}
				
			else {message.reply('You need to wait another: ' + Math.floor(((currentTime/1000) - ((new Date).getTime())/1000)) + ' seconds');}	

		}
			else {message.reply('You do not have permission to do that!');}
	}

	else if(command === '!remove' && user !='') {
		if(message.author.id === credentials.user.id) {

			message.mentions.users.map((user => {
				status = true;
				permitted.remove(user.id);

				message.reply('Ok, deleted <@' + user.id + '>');
			}));					
		}
		else {
			message.reply('You are not <@' + credentials.user.id + '>');
		}
	}

	else if(message.content === '!help'){		
		var reply = 'Available commands: \n\n'
		+ '`!permit` grants a user permission to open door. Only available to <@'+credentials.user.id+'>\n' 
		+ '`!permissions` returns a list of permitted users. Only available to currently permitted users\n'
		+ '`!remove` removes a user from the list of permitted users. Only available to <@'+credentials.user.id+'>\n'
		+ '`!open` opens the door. Only available to permitted users. This command will start a 30 second cooldown timer.\n\n'
			
		+ 'You can find the source code at https://github.com/M4nnogroth/Gibbot\n'
		+ 'All actions are logged';
		message.channel.sendMessage(reply);
	}
	/*
	else if(message.content === 'runninginthe90s') {
		var channel = message.member.voiceChannel;

		channel.join().then(connection => {	
			const dispatcher = connection.playFile('./runninginthe90s.mp3');
			}).catch(console.error);
			
	}*/

		
})

	

client.login(credentials.bot.token);