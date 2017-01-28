const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true }); //Maybe this has to be set to true, no clue actually
const jsonfile = require('jsonfile');
const dateFormat = require('dateformat');
const credentials = require('../credentials.json');

module.exports = {
    log_action : function (id, name, action, result) {

        var now = dateFormat(new Date(), "yyyy-mm-dd, hh:MM:ss");
                
        var log = {
            'date': now, 
            'name': name, 
            'id': id, 
            'action': action, 
            'result': result
        };

        jsonfile.writeFile(credentials.log.filename, log, {spaces: 4, flag: 'a'}, function (err) {
            if(err) {
                console.log(err);
            }
        });

        console.log(now + " | " + name + " with id: " + id +" used command " + action + "result was " + result);
    },


    open_door : function(id, pwd, callback) {
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
            
            //Actually open the door
            .click('#GridViewDoors_ctl08_btnOpen')

            //Wait for page to reload fully
            .wait('#GridViewDoors_ctl08_btnOpen')
            
            //Then exit
            .end()

            //report error
            .then(function (error, result) {
                
                //do a callback when we are done
                if(error) {
                    console.log(error);
                    callback(error)
                }
                else {
                    console.log('Door was opened');
                    callback("done");
                }
                
            });
    }
}
