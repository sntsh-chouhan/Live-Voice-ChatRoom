const tokenService = require('../services/token-service');

module.exports = async function (req, res, next) {
    // console.log("middle ware req");
    // console.log(req.cookies);
    try {
        // console.log("token tryingg")
        const { accessToken } = req.cookies;
        if (!accessToken) {
            // console.log("no access token")
            throw new Error();
        }
        const userData = await tokenService.verifyAccessToken(accessToken);
        if (!userData) {
            // console.log("here?");
            throw new Error();
        }
        req.user = userData;
        next();
    } catch (err) {
        // console.log("error on middleware")
        res.status(401).json({ message: 'Invalid token mate ' });
    }
};