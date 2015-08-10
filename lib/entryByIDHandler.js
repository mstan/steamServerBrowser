/*****************************************
  ./lib/entryByIDHandler.js

  These functions exist for the authorized
  creator of an entry. These actions allow
  the user to:

  viewEntry - View the 'admin' page

  updateEntry - Update the IP and port
  (Updating either will set serverStatus
  to 0, thus it will be absent from the
  server list until such a time that our
  server will re-check the information
  and validate it again)

  deleteEntry - Remove the entry from the
  database entirely

  They are accessible by referencing
  this module and using 
  entryByIDHandler.FUNCTION

******************************************/


var viewEntry = function view(req,res) {
    server = req.server;
    res.render('pages/viewEntryAdmin', {server: server});
};

var updateEntry = function (req,res) {
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

var deleteEntry = function(req,res) {
    var id = req.body.id;

  //Implement user auth. Compare user with "signed" entry in db to make sure they are authorized to issue this.
  //var creator = req.user.id; 

    req.db.run('DELETE FROM servers WHERE id=?', id, function (err) {
        res.redirect('/?msg=Deleted');
    });
};

module.exports = {
  viewEntry: viewEntry,
  updateEntry: updateEntry,
  deleteEntry: deleteEntry
}

