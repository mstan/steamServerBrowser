module.exports = function (req,res) {
	var ip = req.body.ip;
	var port = req.body.port;
	var serverName = 'new server';

	//Implement user auth. Pass creator to the database so the entry is "signed" by the user
	//var creator = req.user.id; 

	var hostInfo = [ip, port];
	var newServer = [ip,port,serverName];

	req.db.get('SELECT * FROM servers WHERE ip=? AND port=?', hostInfo, function (err,row) {
		//If the server already exists, don't add a duplicate
		if(row) {
			res.redirect('/new' + '?msg=Entry already exists!');
		} else {
						//Add new entry
							req.db.run('INSERT INTO servers (ip,port,serverName) VALUES(?,?,?)', newServer, function (err) {
								console.log(err);
								if (err) { res.redirect('/new' + '?msg=Error Adding Entry') }

									res.redirect('new' + '?msg=Added');
							}); //end req.db.run
		} //end else

	}); // end req.db.get

};