/*****************************************
  Render the view page for our user.
******************************************/

var GET= function (req,res) {
    res.render('pages/viewEntryPublic');
};

/************************************************************************
  This reads in the IP from the webpage and passes a direct steam://
  protocol link back to our user. This is convenient for single-click
  connects when a user views an entry.

*************************************************************************/

var directConnect = function (req,res) {
  var connectIP = req.body.ip;

  var steamConnectURL = 'steam://connect/' + connectIP + '/';

  res.redirect(steamConnectURL);
};

module.exports = {
  GET: GET,
  directConnect: directConnect
};