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

  //1) Read out the entries from the database.
  req.db.all('SELECT * FROM servers WHERE (serverStatus = 1)', function (err,rows) {
      var servers = rows;

    //2) Pass that out to our res.render
      res.render('pages/index', { servers: servers }); 
  }); //End db.all


}