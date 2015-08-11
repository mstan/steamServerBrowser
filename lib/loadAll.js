var defaultSearchVars = require('./defaultSearchVars.js');

/*****************************************
  Default load function on initial GET.
  This just pulls EVERYTHING from the 
  database that is serverStatus=1

  In a final release, this will most likely
  be deprecated or modified to have more
  concise "default" values to make for a 
  cleaner initial that pulls from much
  less out of our database.

  Preferably, the default query should
  be:

  Stock maps only
  Rotation
  24 slot
  16 player min
  server not full
  sort by most players in server at top

******************************************/

module.exports = function (req,res) {


/*****************************************
 The immediately below code is to make
 the system not alternate default values
 and user values with each GET. 

 We will eventually want to externalize
 this and the searchFilter equivalent
 into its own module.
******************************************/


    var authStatus = res.locals.authStatus;

    if (req.user) {
     var userID = req.user.id;     
    }

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

  //1) Read out the entries from the database.
  req.db.all('SELECT * FROM servers WHERE (serverStatus = 1)', function (err,rows) {
      var servers = rows;

    //2) Pass that out to our res.render
      res.render('pages/index', { servers: servers, defaultSearchVars: defaultSearchVars }); 
  }); //End db.all


}