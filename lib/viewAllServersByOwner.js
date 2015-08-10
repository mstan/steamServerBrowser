/*****************************************
  This page can only be loaded if the user
  passes an authStatus check. If they are
  logged in, they must have  steamID
  associated with their cookie. Take that
  user ID and return all db entries that
  this user created.

******************************************/



module.exports = function (req,res) {
  var owner = parseInt ( req.user.id ) ;

  req.db.all('SELECT * FROM servers WHERE owner = ?', owner, function (err,rows) {
    console.log(err);

    var servers = rows;

    res.render('pages/viewAllServers', {servers: servers});


  });
};