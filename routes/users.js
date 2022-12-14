const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/utils');

// TODO
router.get('/protected', passport.authenticate("jwt", {session: false}),(req, res, next) => {
	res.json({
		success: true,
		message: "You have access to this protected route"
	})
});

router.get('/custom', utils.authMiddleware, (req, res, next) => {
	console.log(req)
	res.json({
		success: true,
		message: "You have access to this protected route"
	})
});

// TODO
router.post('/login', function(req, res, next){
	User.findOne({ username: req.body.username })
		.then(user => {
			if(!user){
				res.status(401).json({
					success: false,
					message: "Invalid user!"
				})
			}

			// validate the user
			const isValid = utils.validPassword(
				req.body.password,
				user.hash,
				user.salt
			)

			// isuing the jwt if user is valid
			if(!isValid){
				return res.status(401).json({
					success: false,
					message: "Invalid password"
				})
			}

			const tokenObject = utils.issueJWT(user)
			res.status(200).json({
				success: true,
				user: user,
				token: tokenObject.token,
				expires: tokenObject.expires
			})
		})
		.catch(err => next(err))
});

// TODO
router.post('/register', function(req, res, next){
	const saltHash = utils.genPassword(req.body.password)

	const salt = saltHash.salt
	const hash = saltHash.hash

	const newUser = new User({
		username: req.body.username,
		hash: hash,
		salt: salt
	})

	try {
		newUser.save()
			.then(user => {
				const jwt = utils.issueJWT(user)

				res.status(201).json({
					success: true,
					user: user,
					token: jwt.token,
					expires: jwt.expires
				})
			})
	} catch (error) {
		res.json({
			success: false,
			message: error
		})
	}

});

module.exports = router;