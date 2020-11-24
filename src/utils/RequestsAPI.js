require("dotenv").config();
const axios = require("axios");

const getToken = async function(code, uri) {
    try {
        const token = await axios({
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            params: {
                grant_type: "authorization_code",
                code: code,
                redirect_uri: uri,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return {data: token.data, error: null};
    } catch (e) {
        return {data: null, error: e.response.data.error_description};
    }
}

exports.getUserRegister = async function(code, uri) {
    const token = await getToken(code, uri);

    if (!token.error) {
        try {
            const user = await axios({
                method: 'GET',
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer '+ token.data.access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return {data: user.data, error: null};
        } catch (e) {
            return {data: null, error: e.response.data.error.message};
        }
    } else {
        return {data: null, error: token.error}
    }
}