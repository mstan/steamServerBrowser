module.exports = function (req,res) {
		//User defined parameters
		var map = '%' + req.body.map + '%'; //Prepend and append string with % wildcards. This also works for empty strings that become %%, which match everything.
		var minPlayers = req.body.minPlayers; //We compare minimum player desired count to the server's currentPlayers
		var maxPlayers = req.body.maxPlayers; 
		var serverNotFull = req.body.serverNotFull || false;


		var passToDB = [minPlayers,maxPlayers,map];



  //1) Read out the entries from the database.
  req.db.all('SELECT * FROM servers WHERE (serverStatus = 1 AND currentPlayers >= ? AND maxPlayers <= ? AND map LIKE ? )', passToDB, function (err,rows) {
      var servers = rows;

      //If serverNotFull is true, remove all entries where currentPlayers = maxPlayers
      if (serverNotFull) {
      	var filteredServerList = servers.filter(function (server) {
      		if (server.currentPlayers >= server.maxPlayers) {
      			return false;
      		} else {
      			return true;
      		}

      	}); // filteredServerList function
      	var servers = filteredServerList;
      }//end if

    //2) Pass that out to our res.render
      res.render('pages/index', { servers: servers }); 
  }); //End db.all

}