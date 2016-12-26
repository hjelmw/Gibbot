const functions = require('./functions.js');
const credentials = require('./credentials.json');
const Discord = require('discord.js');
const HashMap = require('hashmap');

const client = new Discord.Client();
var permitted = new HashMap();
var list;
var command;
var user;
var time;
var reply = '';
var value = 0;


client.on('message', message =>{
	list = message.content.split(' ');
	command = list[0];
	user = list[1];
	time = list[list.length - 1];
	reply = ''
	value = 0;	

	//check if permission expired
	permitted.forEach(function(value, key) {
		//Does user still have permission
		if((value-((new Date).getTime())/1000/60) <= 0) {			
			permitted.remove(key);		
		}
	});
	
	if(command === '!permit' && user != '' && (!isNaN(time))) {
		if(message.author.id === credentials.user.id) {
			if (time === null) {time = 60;}

			message.mentions.users.map((user => {
				permitted.set(user.id, (new Date).getTime()+(60*time*1000));
			}));

			message.reply('The following users have been granted permission: \n')
			permitted.forEach(function(value, key) {
				value = (value-((new Date).getTime()))/1000/60;
				reply += '<@' + key + '>' + ' : ' + value + ' Minutes left' + '\n';
			}); 
			//End markdown
			message.channel.sendMessage(reply);
		}
		else {
			message.reply('You are not <@' + credentials.user.id + '>');
		}
	}
	else if(message.content === '!permissions') {
		message.reply('Authorized users: \n');
		permitted.forEach(function(value, key) {
			value = Math.floor((value-((new Date).getTime()))/1000/60);
			reply += '<@' + key + '>' + ' : ' + value + ' Minutes left' + '\n';
		}); 
		//End markdown
		message.channel.sendMessage(reply);
	}
	
	else if(message.content === '!open') {
		permitted.forEach(function(value, key) {
			if(message.author.id === key){
				//Does user still have permission
				if((value-((new Date).getTime())/1000/60)>=0) {
					//functions.open_door(id, pwd);
					message.reply(' ok');
				}
				else {
					message.reply('Permission expired `' + user + '`');
					permitted.remove(key);
				}
			}
				
		});
	}

	else if(command === '!remove' && user !='') {
		if(message.author.id === credentials.user.id) {
			permitted.forEach(function(value, key) {
				if (key === user.id) {
					permitted.remove(key);
					message.reply('Ok, deleted <@' + user.id + '>');
				}
			});
		}
		else {
			message.reply('You are not <@' + credentials.user.id + '>');
		}
	}

	})
	

client.login(credentials.token);