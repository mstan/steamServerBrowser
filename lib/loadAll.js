module.exports = function (req,res) {

  //1) Read out the entries from the database.
  req.db.all('SELECT * FROM servers WHERE (serverStatus = 1)', function (err,rows) {
      var servers = rows;

    //2) Pass that out to our res.render
      res.render('pages/index', { servers: servers }); 
  }); //End db.all


}