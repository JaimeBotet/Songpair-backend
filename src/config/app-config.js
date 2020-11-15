import dotenv from 'dotenv';
import fs from 'fs';

const result = dotenv.config();

if (result.error) {
	console.log("⚠️  Couldn't find .env file, creating one from .env.example");
	fs.copyFileSync('.env.example', '.env');
	dotenv.config();
}

export default {
	app: {
		port: process.env.APP_PORT,
		accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
		refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
		clientDomain: process.env.CLIENT_DOMAIN,
	},
	db: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		pass: process.env.DB_PASS,
		name: process.env.DB_NAME
	}
};