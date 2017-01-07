
module.exports = {
    log_action : function (id, name, action, status) {
        var log = new Date(year, month, day, hours, minutes) ;

    },


    open_door : function(id, pwd) {
        
        var Nightmare = require('nightmare');
        var nightmare = Nightmare({ show: true });
  
        nightmare
            .goto('https://www.chalmersstudentbostader.se/login/')
            .wait('#page')

            //Fill out credentials
            .insert('input[name="log"]' , id)
            .insert('input[name="pwd"]', pwd)
            .click('.btn-primary')

            //Wait until <a>öppna port</a> can be seen by nightmare
            .wait('#page > div > div > div > div.container > div > div.span8 > div.row-fluid.equal > div:nth-child(2) > div > div.BoxContent > div.f2-widget.Stealth.Aptuslogin.Aptusport > a') 

            //Server does not seem to grant access if wait is too low :/
            .wait(1000)

            //Click on 'öppna port'
            .click('#page > div > div > div > div.container > div > div.span8 > div.row-fluid.equal > div:nth-child(2) > div > div.BoxContent > div.f2-widget.Stealth.Aptuslogin.Aptusport > a')
            .wait(5000)
            .end()

            //report error
            .run(function(error, result) {
              if (error) {
                console.error(error);
              } else {
                console.log(result);
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