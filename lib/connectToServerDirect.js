module.exports = function (req,res) {
  var connectIP = req.body.ip;

  var steamConnectURL = 'steam://connect/' + connectIP + '/';

  res.redirect(steamConnectURL);
};