const functions = require('./functions.js');
const credentials = require('./credentials.json');
const Discord = require('discord.js');
const HashMap = require('hashmap');
const dateformat = require('dateformat');
const client = new Discord.Client();

var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });
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
		if(message.author.id === credentials.user.id) {
			if (isNaN(time)) {time = 60;}

			message.mentions.users.map((user => {
				permitted.set(user.id, (new Date).getTime()+(60*(time)*1000));
			}));

			message.reply('The following users have been granted permission: \n');
			permitted.forEach(function(value, key) {
				value = (value-((new Date).getTime()))/1000/60;
				reply += '<@' + key + '>' + ' : ' + Math.floor(value) + ' Minutes left' + '\n';
			}); 
			//End markdown
			message.channel.sendMessage(reply);
		}
		else {
			message.reply('You are not <@' + credentials.user.id + '>');
		}
	}

	else if(message.content === '!permissions') {
		if(permitted.has(message.author.id)) {
			message.reply('Authorized users: \n');
			permitted.forEach(function(value, key) {
				value = Math.floor((value-((new Date).getTime()))/1000/60);
				reply += '<@' + key + '>' + ' : ' + value + ' Minutes left' + '\n';
			}); 
			//End markdown
			message.channel.sendMessage(reply);
		}
		else {
			message.reply('You do not have permission to do that ' + message.content);
		}
	}
	
	else if(message.content === '!open') {

		if((currentTime/1000) - ((new Date).getTime()/1000) <= 0 ) {
			currentTime = (((new Date).getTime())+(1000*30));

			if(permitted.has(message.author.id) || message.author.id === credentials.user.id){
				//Does user still have permission
				if(((permitted.get(message.author.id))-((new Date).getTime())/1000/60)>=0 
					|| message.author.id === credentials.user.id) {
					message.reply('Ok, please wait...');
					
					nightmare
	            		.goto('https://www.chalmersstudentbostader.se/login/')
	            		.wait('#page')

	            		//Fill out credentials
	            		.insert('input[name="log"]' , credentials.id)
	            		.insert('input[name="pwd"]', credentials.pwd)
	            		.click('.btn-primary')

	            		//Wait until <a>öppna port</a> can be seen by nightmare
	            		.wait('#page > div > div > div > div.container > div > div.span8 > div.row-fluid.equal > div:nth-child(2) > div > div.BoxContent > div.f2-widget.Stealth.Aptuslogin.Aptusport > a') 

	            		//Server does not seem to grant access if wait is too low :/
	            		.wait('#page > div > div > div > div.container > div > div.span4 > div.Box.Skugga.Label > div.BoxContent > div.f2-widget.Kontaktuppgifter > div > div.span7 > dl > dd')
	            		//Click on 'öppna port'
	           			.evaluate(function() {
	           				//Change <a> tag so it does not cause a pop-up
	           				var link = document.querySelector('#page > div > div > div > div.container > div > div.span8 > div.row-fluid.equal > div:nth-child(2) > div > div.BoxContent > div.f2-widget.Stealth.Aptuslogin.Aptusport > a')
	           				link.target = "";
	           				return null;
						})
	           			.click('#page > div > div > div > div.container > div > div.span8 > div.row-fluid.equal > div:nth-child(2) > div > div.BoxContent > div.f2-widget.Stealth.Aptuslogin.Aptusport > a')
	            		
	            		.wait('#GridViewDoors_ctl08_btnOpen')
	            		//Open the door
	            		.click('#GridViewDoors_ctl08_btnOpen')
	            		.wait(5000)
	            		.end()

				        //report error
				        .run(function(error, result) {
				        	if (error) {
				            	message.reply('Something went wrong: ');
				              	message.channel.sendMessage(error);
				                console.error(error);
				              } else {
								message.reply('Done');
				              }
				        });
				        
					}
					else {
						message.reply('Permission expired!');
						permitted.remove(key);
					}
				}
				else {
					message.reply('You don\'t have permission to do that!');
				}	
		}
		else {
			message.reply('You need to wait another: ' + Math.floor(((currentTime/1000) - ((new Date).getTime())/1000)) + ' seconds')
		}	
	}

	else if(command === '!remove' && user !='') {
		if(message.author.id === credentials.user.id) {
			message.mentions.users.map((user => {
				permitted.remove(user.id);
				message.reply('Ok, deleted <@' + user.id + '>');
			}));
					
		}
		else {
			message.reply('You are not <@' + credentials.user.id + '>');
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
	

client.login(credentials.token);