const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('User');

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// all possible options we can have
// const passportJWTOptions = {
// 	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// 	secretOrKey: "Public key || secret",
// 	issuerer: "insuerer here",
// 	audience:"audience here",
// 	algorithms: ["RSA256"],
// 	ignoreExpiration: false,
// 	passsReqToCallback: false,
// 	jsonWebTokenOptions: {
// 		complete: false,
// 		clockTolerance: "",
// 		maxAge: "2d", //2 days
// 		clockTimestamp: "100",
// 		nonce: "String here for open ID"
// 	}
// }

// TODO
const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: PUB_KEY,
	algorithms: ["RS256"]
}

// define the strategy
const strategy = new JWTStrategy(options, (payload, done) => {
	User.findOne({ _id: payload.sub })
		.then(user => {
			if(!user){
				return done(null, false)
			}
			return done(null, user)
		})
		.catch(err => done(err, false))
})

// TODO
module.exports = (passport) => {
	passport.use(strategy)
}
