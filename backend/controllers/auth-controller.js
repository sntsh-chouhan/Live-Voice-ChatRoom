const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');

class AuthController{
    async sendOtp(req, res){
        const {phone} = req.body;

        if(!phone){
            res.status(400).json({message: 'phone filled is required'});
        }
        // generating OTP
        const otp = await otpService.generateOtp();
        // console.log(otp);

        // hashing the OTP
        const ttl= 1000*60*2;
        const expires = Date.now()+ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        // sending otp
        try{
            // await otpService.sendBySms(phone, otp);
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp
                
            });
        } catch(err){
            console.log(err);
            res.status(500).json({message: 'message sending failed'});
        }
    }

    // verifying otp
    async verifyOtp(req, res){
        const {otp, hash, phone} = req.body;

        if(!otp || !hash || !phone){
            res.status(400).json({message: 'All feild required'});
        }

        const [hashedOtp, expires] = hash.split('.');
        if(Date.now() > +expires){
            res.status(400).json({message: "otp expires"});
        }

        const data = `${phone}.${otp}.${expires}`;

        const isvalid = otpService.verifyOtp(hashedOtp, data);

        if(!isvalid){
            res.status(400).json({message: "Invalid OTP"});
        }

        let user;

        try{
            user = await userService.findUser({phone});
            if(!user){
                user = await userService.createUser({phone}) 
            }
        }catch(err){
            console.log(err);
            console.log("dataabse err");
            res.status(500).json({message: 'Database err'})
        }
        
        // JWT token
        const {accessToken, refreshToken} = tokenService.generateToken({
            _id: user._id,
            activated:false
        });

        await tokenService.storeRefreshToken(refreshToken, user._id)

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000*60*24*30,
            httpOnly: true
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000*60*24*30,
            httpOnly: true
        });



        const userDto  = new UserDto(user);
        res.json({user: userDto, auth: true});
    }

    async refresh(req, res){
        // getting refreshtoken from cookie, and verifing it
        // cheking token from db
        // fiinally generating new token to use

        const {refreshToken: refreshTokenFromCookie} = req.cookies;

        let userData;
        try{
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );

        }catch(err){
            return res.status(401).json({message: 'invalid token'});
        }

        try{
            const token = tokenService.findRefreshToken(
                userData._id,
                refreshTokenFromCookie
            );

            if(!token){
                return res.status(401).json({message: 'invalid token'});
            }
        }catch(err){
            return res.status(500).json({message: 'internal error'});
        }

        const user = await userService.findUser({_id: userData._id});
        if(!user){
            return res.status(404).json({message: 'no user'});
        }

        const {refreshToken, accessToken} = tokenService.generateToken({
            _id:userData._id
        });

        try{
            await tokenService.updataRefreshToken(userData._id, refreshToken);
        }catch(err){
            return res.status(500).json({message: 'internal error'});
        }

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000*60*24*30,
            httpOnly: true
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000*60*24*30,
            httpOnly: true
        });

        const userDto  = new UserDto(user);
        res.json({user: userDto, auth: true});
        
    }

    async logout(req, res){
        // deleting refresh token from db and cookie
        const {refreshToken} = req.cookies;
        await tokenService.removeToken(refreshToken);

        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');

        res.json({user: null, auth: false});
        
    }

}


module.exports = new AuthController();