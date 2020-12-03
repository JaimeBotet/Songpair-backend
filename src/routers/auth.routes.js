require("dotenv").config();
const { Router } = require("express");
const { getUserRegister } = require('../utils/RequestsAPI');
const passport = require("passport");

const router = Router();

const userController = require("../controllers/user-controller");

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

//First I need to clarify about the redirection after the spotify login is successful.
router.post("/signup", userController.signUp);

router.post("/login", userController.login);

router.post(
	"/logout",
	passport.authenticate("jwt", { session: false }),
	userController.logout,
);
  
router.get(
	"/user/me",
	passport.authenticate("jwt", { session: false }),
	userController.me,
);

module.exports = router;