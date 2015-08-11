module.exports = function (req,res) {
      var createdAt = new Date().getTime() / 1000 >> 0; 
      var userID = req.user.id;
      console.log(userID);

      var newUser = [userID, createdAt, createdAt];


      req.db.get('SELECT * FROM users where user = ?', userID, function (err,row) { 
        if(!row) {
            req.db.run('INSERT INTO users (user,createdOn,lastLoggedIn) VALUES(?,?,?)', newUser, function (err) {
              console.log(err);
            });
          }
      });
      res.redirect('/');
  }