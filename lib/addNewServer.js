var GET = function (req,res) {
  res.render('pages/addNewServer');
};


/************************************************************************
  POST function reads in IP, description and a port from the user. The system will
  provide a placeholder name, 'new server'. This is to easily 
  recognized servers that have not been updated and recently added to the
  DB. min and maxPlayers are also set to null.

  Furthermore, serverStatus is hardcoded to 0 on addition. This is done
  so that these new servers that have not yet been validated by the system
  don't show up. The system will ping this server, and if it does not
  receive an error, it will update infomration about the server's name,
  currentPlayers/maxPlayers, and set the status to 1. Therefore, if a 
  server is not behaving or is not up, it doesn't ever get passed to
  our end user.


*************************************************************************/


var POST = function (req,res) {
  var ip = req.body.ip;
  var port = req.body.port;
  var serverName = 'new server';
  var owner = req.user.id;
  var description = req.body.description;

  var createdAt = new Date().getTime() / 1000 >> 0; //Time in milliseconds. Let's convert this to seconds by /1000. SRL to convert this from float to int.  

  //Implement user auth. Pass creator to the database so the entry is "signed" by the user
  //var creator = req.user.id; 

  var hostInfo = [ip, port];
  var newServer = [ip,port,serverName,owner,description,createdAt];


  req.db.get('SELECT * FROM servers WHERE ip=? AND port=?', hostInfo, function (err,row) {
    console.log(err);
    //If the server already exists, don't add a duplicate
    if(row) {
      res.redirect('/new' + '?msg=Entry already exists!');
    } else {
            //Add new entry
              req.db.run('INSERT INTO servers (ip,port,serverName,owner,description,createdAt) VALUES(?,?,?,?,?,?)', newServer, function (err) {
                console.log(err);
                if (err) { res.redirect('/new' + '?msg=Error Adding Entry') }

                  res.redirect('new' + '?msg=Added');
              }); //end req.db.run
    } //end else

  }); // end req.db.get

};

module.exports = {
  GET: GET,
  POST: POST
}