module.exports = function (req,res) {
  var owner = parseInt ( req.user.id ) ;

  req.db.all('SELECT * FROM servers WHERE owner = ?', owner, function (err,rows) {
    console.log(err);

    var servers = rows;

    res.render('pages/viewAllServers', {servers: servers});


  });
};