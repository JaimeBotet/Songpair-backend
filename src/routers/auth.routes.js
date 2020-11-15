import express from 'express';

const router = express.Router();

router.get('/test', (req, res) => {
	return res
		.status(200)
		.json({
			data: 'Test okay!',
			error: null
		});
});

export default router;