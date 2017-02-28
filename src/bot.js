const functions = require('./functions.js');
const credentials = require('../credentials.json');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const HashMap = require('hashmap');
const client = new Discord.Client();

var permitted = new HashMap();
var queue = new HashMap();
var currentTime = 0;
var list;
var command;
var user;
var time;
var reply;
var value;
var channel;
var dispatcher = '';
var stream = '';
//Don't remember what this is for, might delete
var BlCounter = 0;
/*
client.on('ready', () => {
	console.log('On');
	functions.log_action(client.id, client.author.username, 'Online', true);
});
*/
client.on('message', message =>{
	list = message.content.split(' ');
	command = list[0];
	arg1 = list[1];
	time2 = list[list.length - 1];
	reply = '';

	//check if permission expired
	permitted.forEach(function(value, key) {
		//Does user still have permission
		if(((value/1000/60)-((new Date).getTime())/1000/60) <= 0) {			
			permitted.remove(key);		
		}
	});
	
if(command === '!permit' && arg1 != ''){

	//Assume action was denied
	var status = false;
		
	if(message.author.id === credentials.user.id) {
			//No time was given
		if (isNaN(arg2)) {arg2 = 60;}

		message.mentions.users.map((user => {
			permitted.set(user.id, (new Date).getTime()+(60*(arg2)*1000));
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
	}
	else {
		message.reply('You are not <@' + credentials.user.id + '>');
	}
	//Log action
	functions.log_action(message.author.id, message.author.username, message.content, status);
	}

	else if(message.content === '!permissions') {
		var status = false;
		if(permitted.has(message.author.id) || message.author.id === credentials.user.id) {
			message.reply('Authorized users: \n');

			permitted.forEach(function(value, key) {
				
				value = Math.floor((value-((new Date).getTime()))/1000/60);		
				reply += '<@' + key + '>' + ' : ' + value + ' Minutes left' + '\n';
			});

			if(reply != null) {message.channel.sendMessage(reply);}
			else{message.channel.sendMessage('No permitted users');}
			status = true;
		}
		else {
			//Escape ' character
			message.reply('You don\'t have permission to do that!');
		}

		functions.log_action(message.author.id, message.author.username, command, status);
	}
	
	else if(message.content === '!open') {
		var status = false;
			
		if(permitted.has(message.author.id) || message.author.id === credentials.user.id){

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
			
			else {
				message.reply('You need to wait another: ' + Math.floor(((currentTime/1000) - ((new Date).getTime())/1000)) + ' seconds');
				status = 'timeout';
			}	

		}
		else {
			message.reply('You do not have permission to do that!');
			status = false;
		}
		functions.log_action(message.author.id, message.author.username, command, status);
	}

	else if(command === '!remove' && arg1 !='') {

		var status = false;
		if (arg1.includes('https://www.youtube.com/watch?v=')) {
			queue.remove(arg1);
			message.reply('Ok, removed ' + arg1 + ' from the queue');
		}

		else if(message.author.id === credentials.user.id) {

			message.mentions.users.map((user => {
				status = true;
				permitted.remove(user.id);

				message.reply('Ok, deleted <@' + user.id + '>');
			}));					
		}
		else {
			message.reply('You are not <@' + credentials.user.id + '>');
		}
		functions.log_action(message.author.id, message.author.username, message.content, status);
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

		functions.log_action(message.author.id, message.author.username, message.content, true);
	}

	else if(message.content === '!log'){
		var status = false;
		if(message.author.id === credentials.user.id) {

			status = true;
			message.channel.sendFile('./log.json');

		}
		else {

			message.reply('You are not <@' + credentials.user.id + '>');

		}

		functions.log_action(message.author.id, message.author.username, command, status);
	}

	else if(command === '!play'){
		channel = message.member.voiceChannel;

		channel.join().then(connection => {
			
			stream = ytdl("https://www.youtube.com/watch?v=Y97u-U0nvJM", {filter : 'audioonly'});
       		dispatcher = connection.playStream(stream, );
		}).catch(console.error);

		functions.log_action(message.author.id, message.author.username, command, status);
	}

	else if(command === '!queue'){
		if (arg1.includes('https://www.youtube.com/watch?v=')) {
			
			queue.set(arg1, message.author.id);
			message.channel.sendMessage('<@' + message.author.id+'> ' + 'Added ' + arg1 + ' to the queue');
		}
		else {
			message.channel.sendMessage('Not a valid link, I currently only accept links of the format `https://www.youtube.com/watch?v=ID`')
		}

		functions.log_action(message.author.id, message.author.username, command, status);
	}


	

	/*
	else if(message.content === '90') {
		var channel = message.member.voiceChannel;

		channel.join().then(connection => {
			
				const dispatcher = connection.playFile('./90.mp3');
			
			}).catch(console.error);

		
	}*/
})

	

client.login(credentials.bot.token);