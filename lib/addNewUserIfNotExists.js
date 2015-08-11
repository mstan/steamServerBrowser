/*****************************************
 When a user signs in through Steam, we
 want to know if that user has signed in
 bebfore. If they have, the user (row)
 will exist, so we do nothing and just 
 redirect. If that users does not exist,
 however, create a new entry for them.

 user will be identified by their steamID.
 We get the current time to identify when
 they first logged into the site.

 Since this is the first time they logged
 in, it is also the most recent, therefore
 we pass createdAt twice given that the
 teim of creation was the last logged in
 time.
******************************************/



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