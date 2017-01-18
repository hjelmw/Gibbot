const functions = require('./functions.js');
const credentials = require('./credentials.json');
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
var BlCounter = 0;

client.on('message', message =>{
	list = message.content.split(' ');
	command = list[0];
	user = list[1];
	time = list[list.length - 1];
	reply = '';

	//check if permission expired
	permitted.forEach(function(value, key) {
		//Does user still have permission
		if(((value/1000/60)-((new Date).getTime())/1000/60) <= 0) {			
			permitted.remove(key);		
		}
	});
	
	if(command === '!permit' && user != ''){

		//Assume action was denied
		var status = false;
		
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
		}
		else {
			message.reply('You are not <@' + credentials.user.id + '>');
		}
		//Log action
		functions.log_action(message.author.id, message.author.username, command, status);
	}

	else if(message.content === '!permissions') {
		var status = false;
		if(permitted.has(message.author.id)) {
			
			message.reply('Authorized users: \n');
			permitted.forEach(function(value, key) {
				value = Math.floor((value-((new Date).getTime()))/1000/60);
				reply += '<@' + key + '>' + ' : ' + value + ' Minutes left' + '\n';
			}); 
			
			message.channel.sendMessage(reply);
			status = true;
		}
		else {
			message.reply('You don\'t have permission to do that!');
		}

		functions.log_action(message.author.id, message.author.username, command, status);
	}
	
	else if(message.content === '!open') {
		var status = false;
		if((currentTime/1000) - ((new Date).getTime()/1000) <= 0 ) {

			currentTime = (((new Date).getTime())+(1000*30));

			if(permitted.has(message.author.id) || message.author.id === credentials.user.id){
				
				//Does user still have permission
				if(((permitted.get(message.author.id))-((new Date).getTime())/1000/60)>=0 
					|| message.author.id === credentials.user.id) {
					
					message.reply('Ok, please wait...');
					
					//Action was allowed
					status = true;
					
					//Open the door
					/* 
					TODO 
					make open_door asynchronous

					*/
					functions.open_door(credentials.login.id, credentials.login.pwd, function(result){
						message.channel.sendMessage(result);
					});	        
				} else {
						message.reply('Permission expired!');
						permitted.remove(key);
					}
				}
				else {
					message.reply('You don\'t have permission to do that!');
				}	
		}
		else {

			message.reply('You need to wait another: ' + Math.floor(((currentTime/1000) - ((new Date).getTime())/1000)) + ' seconds');
			
			//Different from false or true
			status = "timeout";	
		}
		functions.log_action(message.author.id, message.author.username, command, status);
	}

	else if(command === '!remove' && user !='') {
		var status = false;
		if(message.author.id === credentials.user.id) {

			message.mentions.users.map((user => {
				status = true;
				permitted.remove(user.id);

				message.reply('Ok, deleted <@' + user.id + '>');

				functions.log_action(message.author.id, message.author.username, command, status);	
			}));					
		}
		else {
			message.reply('You are not <@' + credentials.user.id + '>');
			functions.log_action(message.author.id, message.author.username, command, status);
		}
	}

	else if(message.content === '!help'){
		/*
			2016-01-08 => user = namn, id = 1321313131, action = !open, result = denied
			2016-01-08 => user = namn2, id = 1323231321, action = !open, result = granted
					
	


		*/
		message.reply(new Date().toISOString(). replace(/T/, ' ').replace(/\..+/, ''));
		
		var reply = 'Available commands: \n\n'
		+ '`!permit` grants a user permission to open door. Only available to <@'+credentials.user.id+'>\n' 
		+ '`!permissions` returns a list of permitted users. Only available to currently permitted users\n'
		+ '`!remove` removes a user from the list of permitted users. Only available to <@'+credentials.user.id+'>\n'
		+ '`!open` opens the door. Only available to permitted users.\n\n'

		+ 'All actions are logged';
		message.channel.sendMessage(reply);
	}

	

})
	

client.login(credentials.bot.token);