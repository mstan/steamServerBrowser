var steamServerStatus = require('steam-server-status');

/*****************************************
  At present unimplemented function for
  reference. Will be used by system
  server to query all entries in DB
  every 2-3 minutes and upate information
  accordingly

******************************************/


//Build a function that cycles through each database entry and cycles through each one, updating its information in accordance to what the server responds with



  // 1) Grab all servers from the database.
  var getServerList = function (req,res,next) {

        req.db.all('SELECT * FROM servers', function (err,rows) {
            servers = rows;
        });

        next();
  };


  /* Needs to save array, write back to database */

  var updateEachEntry = function (req,res,next) {
      // 2) Run a forEach for each instance.
      var updatedServerList = servers.forEach( function (server) {
          //Use steamServerStatus module to scrape each server
          steamServerStatus.getServerStatus (server.ip, server.port , function (serverInfo) {
           // 3) Did the server error out? If so, it's not up. Time to setStatus=0 and remove it from the list. Don't worry about other info       
              if(serverInfo.error) {
                  server.serverStatus = 0;
                  console.log(server.serverName + ' server invalidated');
              } else {
           // 4) Did the server not error out? Presumably, it's good to go then, let's start updating information about it.      
                  server.serverName = serverInfo.serverName;
                  server.currentPlayers = serverInfo.numberOfPlayers;
                  server.maxPlayers = serverInfo.maxNumberOfPlayers;
                  server.map = serverInfo.map;
                  serverStatus = 1; //Server is giving vallid callbacks, thus validate it for our server list
                  console.log(server.serverName + ' server updated');
              } //end else
          }); //End steamServerStatus
        }); //end servers.forEach

      next();
  };

  var renderPage = function (req,res,next) {
      res.redirect('/');
  };


module.exports = {
  getServerList: getServerList,
  updateEachEntry: updateEachEntry,
  renderPage: renderPage


}