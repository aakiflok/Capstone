const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require("../models/UserModel");

passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload:  any, done:any) {
      return User.findOne({ where: { id: jwtPayload.id } })
        .then((user: any) => {
          return done(null, user);
        })
        .catch((err: any) => {
          return done(err);
        });
    }
  )
);