/*****************************************
  At present unimplemented function for
  reference. Will be used by system
  server to query all entries in DB
  every 2-3 minutes and upate information
  accordingly

******************************************/


var steamServerStatus = require('steam-server-status');

module.exports = function(ip,port) {

steamServerStatus.getServerStatus(ip, port, function (serverInfo) {
        if (serverInfo.error) {
            console.log(serverInfo.error);
        } else {
            console.log("game: " + serverInfo.gameName);
            console.log("server name: " + serverInfo.serverName);
            console.log("players: " + serverInfo.numberOfPlayers + "/" + serverInfo.maxNumberOfPlayers)
        }
}); //End steamServerStatus.getServerStatus


}