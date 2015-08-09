module.exports = function (req,res) {
    server = req.server;

   //Implement user auth. Compare user with "signed" entry in db to make sure they are authorized to issue this.
	//var creator = req.user.id; 

    var id = req.body.id;
    var ip = req.body.ip;
    var port = req.body.port;
    var serverStatus = 0; //Our user just modified information about this server. They are invalidating it. Our server will ping it in 2 minutes and then revalidate it.

    var passToDB = [ip,port,serverStatus,id];

    req.db.run('UPDATE servers SET ip=?, port=?, serverStatus=? WHERE id=?', passToDB, function (err) {
        res.redirect('/viewEntry/' + id + '?msg=Updated');       
    });

};