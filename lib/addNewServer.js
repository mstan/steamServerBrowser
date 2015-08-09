module.exports = function (req,res) {
	var ip = req.body.ip;
	var port = req.body.port;
	var serverName = 'new server';

	//Implement user auth. Pass creator to the database so the entry is "signed" by the user
	//var creator = req.user.id; 

	var hostInfo = [ip, port, serverName];

	req.db.run('INSERT INTO servers (ip,port,serverName) VALUES(?,?,?)', hostInfo, function (err) {
		console.log(err);
		if (err) { res.redirect('/new' + '?msg=Error Adding Entry') }

			res.redirect('new' + '?msg=Added');
	});

};