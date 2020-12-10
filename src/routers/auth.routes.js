const express = require("express");
const passport = require("passport");
require("dotenv").config();

const router = express.Router();

const userController = require("../controllers/user-controller");
const { getUserRegister } = require('../utils/RequestsAPI');

router.get('/signup', (req, res) => {
	let scopes = process.env.SCOPES;
	let my_client_id = process.env.CLIENT_ID;
	let redirect_uri = process.env.SIGNUP_URI;

	res.redirect('https://accounts.spotify.com/authorize' +
		'?response_type=code' +
		'&client_id=' + my_client_id +
		(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
		'&redirect_uri=' + encodeURIComponent(redirect_uri));
});

router.get('/signup/spotify', async (req, res) => {
	const code = req.query.code;

	const formData = await getUserRegister(code, process.env.SIGNUP_URI);

	if (!formData.error) {
		res
			.status(200)
			.json({data: formData,error: null});
	} else {
		res
			.status(500)
			.json({data: null, error: formData.error});
	}
});
router.get('/', (req,res) =>{
	res.send("hello heroku");
})
router.post("/signup", userController.signUp);

router.post("/login", userController.login);

router.post(
	"/logout",
	passport.authenticate("bearer",{ session: false}),
	userController.logout
);

module.exports = router;