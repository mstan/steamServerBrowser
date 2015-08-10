/*****************************************
  Steam authentication strategy

******************************************/


var SteamStrategy = require('../node_modules/passport-steam/lib/passport-steam').Strategy

module.exports = new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: '<TOKEN>'
  },
  function (identifier, profile, done) {
    process.nextTick(function () {

      //For ease of access, take the full identifier and also bind the steamid to just our profile.id
      profile.id = profile._json.steamid;
      return done(null, profile);
    });
  }
)