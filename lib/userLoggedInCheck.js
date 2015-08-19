/*****************************************
  Use authStatus function to check to see
  if our user is logged in. If they aren't,
  make them stop what they're doing and
  redirect them.

******************************************/

module.exports = function (req,res,next) {
  var authStatus = res.locals.authStatus;


  if(!authStatus) {
    //User needs to log in first
    res.redirect('/auth/steam');
    return;
  }
  next();
};