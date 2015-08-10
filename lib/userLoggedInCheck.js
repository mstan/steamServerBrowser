module.exports = function (req,res,next) {
  var authStatus = res.locals.authStatus;


  if(!authStatus) {
    //User needs to log in first
    res.redirect('/auth/steam');
  }
  next();
};