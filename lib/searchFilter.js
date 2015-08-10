    /************************************************************************************* 
      This is a searchFilter function built for modifying what items are passed back to 
      our end user based on criteria. SQLite3 wrapper is unable to handle certain parameter
      passes, such as ASC or DESC when handed off to the wrapper directly. Therefore, we
      will be building our own string to pass to the DB instead. This allows us to 
      implement our own search functions with optionally added criteria and allow it to be
      passed 'statically'. 

      Explanation of parameters:

      map = Current server map. This parameter is optional, and has been built with fuzzy
      search in mind. All strings are prepended and appended with % and are passed to be 
      LIKE any object in our database.
        EXAMPLES: %cp_steel% will pass for finding the map "cp_steel"
                  %gorge% will pass for finding cp_gorge, cp_5gorge, and ctf_gorge
                  %pl_% will find all payload maps.

      minPlayers = Minimum amount of players the user is willing to accept. We pass their 
      minPlayers suggestion and a greater than or equal to comparision to the amount of
      currentPlayers on the server. Somebody who passes 16 here is not looking for that
      one empty server with two people screwing around.

      maxPlayers = Maximum amount of players the server allows. We perform a less than
      or equal to comparison here. Somebody who passes 24 here is not interested in 
      playing on a 32 man server.

      serverNotFull = Boolean check to see if the server is going to allow for more players.
      This is a comparison operation to see if currentPlayers is greater than or equal to
      maxPlayers. We do not do an equal operation only because SourceMod allows servers to
      hide slots for sake of reserved slots. 25/24 is a possible report back from a server,
      and we do not want the full server check to miss these servers and report "more than
      full" to our end user. They aren't interested in that.

      orderByParmater = Checkbox value to allow our user to sort by a particular priority.
      They can choose server names in alphabetical order, or could do maps by name name
      order. Perhaps they are more interested in sorting by how filled servers are.

      orderByDESC = Boolean option. By default, SQLITE will take all values and return 
      them in ASC order when sorting. Checking this appends the string to specify that 
      we want to sort by descrending.
        
    **************************************************************************************/



module.exports = function (req,res) {
    //User defined parameters
    var map = '%' + req.body.map + '%';
    var minPlayers = req.body.minPlayers;
    var maxPlayers = req.body.maxPlayers; 
    var serverNotFull = req.body.serverNotFull || false;
    var orderByParameter = req.body.orderByParameter || null;
    var orderByDESC = req.body.orderByDESC || null;


    // Base string with search parameters
    var queryString = 'SELECT * FROM servers WHERE (serverStatus = 1 AND currentPlayers >= ' + minPlayers + 
                      ' AND maxPlayers <= ' + maxPlayers + 
                      ' AND map LIKE ' + "'" + map  + '\'' +
                      ' )' +
                      ' ORDER BY ' + orderByParameter;


    //Sqlite defaults to sort by ASC. if this doesn't run, the no sort by parameterization will default to ASC.
    if(orderByDESC) {
      queryString = queryString + ' DESC';
    }


  //1) Read out the entries from the database.
  req.db.all(queryString, function (err,rows) {
      var servers = rows;

      //If serverNotFull is true, remove all entries where currentPlayers = maxPlayers
      if (serverNotFull) {
        var filteredServerList = servers.filter(function (server) {
          if (server.currentPlayers >= server.maxPlayers) {
            return false;
          } else {
            return true;
          }

        }); //Take our base array and modify it with this new one.
        var servers = filteredServerList;
      }//end if

    //2) Pass that out to our res.render
      res.render('pages/index', { servers: servers }); 
  }); //End db.all
};