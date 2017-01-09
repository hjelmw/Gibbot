const jsonfile = require('jsonfile')
const credentials = require('./credentials.json');
var dateFormat = require('dateformat');

module.exports = {
    log_action : function (id, name, action, status) {
        var now = new Date();
        dateFormat(now, "isoDateTime");
                
        var log = {
            'date': now, 
            'name': name, 
            'id': id, 
            'action': action, 
            'result': status
        };

        jsonfile.writeFile(credentials.log.filename, log, {spaces: 4, flag: 'a'}, function (err) {
            if(err) {
                console.log(err);
            }
        });

    },


    open_door : function(id, pwd) {
        
        var Nightmare = require('nightmare');
        var nightmare = Nightmare({ show: true });
  
        nightmare
            .goto('https://www.chalmersstudentbostader.se/login/')
            .wait('#page')

            //Fill out credentials
            .insert('input[name="log"]' , credentials.login.id)
            .insert('input[name="pwd"]', credentials.login.pwd)
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
            .wait('#page')
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
    },

    ping_host : function(ip) {
        var ping = require('net-ping');
        var session = ping.createSession();
        
        //non-zero value means something went wrong
        session.pingHost (ip, function (error, target) {
        if (error) {
            return 1;
        } 
        else {
            return 0;
        }
    });
    }
}