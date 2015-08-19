var async = require('async');

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
    /************************************************************************************* 
      These are user defined parameters that come from the page.
    **************************************************************************************/
    var map = '%' + req.body.map + '%';
    var minPlayers = req.body.minPlayers;
    var maxPlayers = req.body.maxPlayers; 
    var serverNotFull = req.body.serverNotFull || false;
    var orderByParameter = req.body.orderByParameter || null;
    var orderByDESC = req.body.orderByDESC || null;

    var authStatus = res.locals.authStatus;
    var mapRaw = req.body.map; // Because we are storing this in the database, we need an unappended version to pass.    
    if (req.user) {
     var userID = req.user.id;     
    }


    /************************************************************************************* 
      We are passing our system a set of pre-defined, default search criteria to sit as 
      defaults in the entry forms. There is also an if-statement here that, if the user 
      is authenticated, that we are going to  clobber defaultSearchVars with whatever 
      our user has last submitted to the system. 
    **************************************************************************************/
    var defaultSearchVars = require('./defaultSearchVars.js');  
  

    if(authStatus) {

        req.db.get('SELECT * FROM users WHERE user = ?', userID, function (err,row) {
          console.log(row);
           user = row;
 
           defaultSearchVars = {
              map: user.mapPref,
              currentPlayers: user.currentPlayersPref,
              maxPlayers: user.maxPlayersPref,
              serverNotFull: user.serverNotFullPref,
              orderByDESC: user.orderByDESCPref

            }

        });

    } //end if

    /************************************************************************************* 
     TODO: Modify the following to which the updating last user set parameters is run
     in sync (not async) such that the system is updated with the user's last search
     preferences before rendering the page.

     Not doing so will make the "default" parmameters on the page always load up what was 
     just in the same, and you basically get a loop of annoying outdated info. 

     Setting the two functions to run in order will resolve this.
    **************************************************************************************/


    /************************************************************************************* 
     In order to call back later what the last values our user passed to the system was,
     we are going to bundle them up and send it to the user database entry each time
     the user submits.

     This function has been declared as a variable so it will not run right away. This 
     is done so we can attempt to manipulate flow by using the async module. This way,
     the database will have the most recent entry to read from, as opposed to the entry
     before the most recent write from this operation.     
    **************************************************************************************/

    var userPrefs = [minPlayers,maxPlayers,mapRaw,serverNotFull,orderByDESC,userID];

    req.db.run('UPDATE users SET currentPlayersPref= ?, maxPlayersPref=?, mapPref=?, serverNotFullPref=?, orderByDESCPref=? WHERE user = ?', userPrefs, function (err) {
      });


     /************************************************************************************* 
     SQLite3 lacks the ability to handle dynamic passes of ASC or DESC. Therefore, we need
     to build our string manually. 
    **************************************************************************************/


    // Base string with search parameters
    var queryString = 'SELECT * FROM servers WHERE (serverStatus = 1 AND currentPlayers >= ' + minPlayers + 
                      ' AND maxPlayers <= ' + maxPlayers + 
                      ' AND map LIKE ' + '\'' + map  + '\'' +
                      ' )' +
                      ' ORDER BY ' + orderByParameter;

    /************************************************************************************* 
     SQLite3 will always sort by ascending if the parameter is not specified. We only
     need to specify it is it is DESC. Therefore, an if statement exists to append the 
     string with DESC if the user asks for it by setting orderByDESC = true;
    **************************************************************************************/

    if(orderByDESC) {
      queryString = queryString + ' DESC';
    }   


    /************************************************************************************* 
     Run the search query, matching all the servers who fit this criteria and hand it 
     back to our system as an array.

     If serverNotFull was checked, go through that list and remove all servers where
     the currentPlayer count is greater than or equal to MaxPlayers.
     (Refer to serverNotFull boolean for more information)

     This function has been declared as a variable so it will not run right away. This 
     is done so we can attempt to manipulate flow by using the async module. This way,
     the database will have the most recent entry to read from, as opposed to the entry
     before the most recent write from updateUserPref's operation.
    **************************************************************************************/


  //1) Read out the entries from the database.
  req.db.all(queryString, function (err,rows) {
      var servers = rows;

      //If serverNotFull is true, remove all entries where currentPlayers = maxPlayers
        //If this function is run, filteredServerList is a new array with the following servers removed
      if (serverNotFull) {
        var filteredServerList = servers.filter(function (server) {
          //Remove each value where current >= max
          if (server.currentPlayers >= server.maxPlayers) {
              return false;
          } else {
              return true;
          }

        }); 
        //We are still inside of our if statement. Assuming it run, we have an array that has been updated. Let's clobber servers with this new one.
        var servers = filteredServerList; 
      }//end if

    //2) Pass that out to our res.render
      res.render('pages/index', { servers: servers, defaultSearchVars: defaultSearchVars }); 
  }); //End db.all





};