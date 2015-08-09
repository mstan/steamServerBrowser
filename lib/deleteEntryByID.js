module.exports = function (req,res) {
    var id = req.body.id;

	//Implement user auth. Compare user with "signed" entry in db to make sure they are authorized to issue this.
	//var creator = req.user.id; 

    req.db.run('DELETE FROM servers WHERE id=?', id, function (err) {
        res.redirect('/?msg=Deleted');
    });
};