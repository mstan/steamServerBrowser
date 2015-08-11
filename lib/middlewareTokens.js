/* ============================ 

    The following exist to
    globalize some of our vars

    authStatus - BOOL - 0/1
    depending on whether user
    is logged in

    res.locals.msg - defined either
    by query or null. Always defined
    so EJS will never pass back
    error undefined.

    res.locals.user/req.user -
    Exists for when information
    is needed about our user.

   ============================ */

module.exports = function (req,res,next) {

/* ============================ 

    Declare our variable, assume
    user doesn't exist by 
    setting to 0.

    Run an if statement, that
    if the user does exist,
    we will clobber the value
    with a 1.
   ============================ */  

  //Is there a user here?
  var authStatus = 0;
  if(req.user) { authStatus = 1; }
  res.locals.authStatus = authStatus;

  //Other information to pass. Was there a message? Do we have a user?
  res.locals.msg = req.query.msg || null;
  res.locals.user = req.user || null;
  
  next();
};