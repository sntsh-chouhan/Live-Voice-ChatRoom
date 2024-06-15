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

        res.cookie('refreshtoken', refreshToken, {
            maxAge: 1000*60*24*30,
            httpOnly: true
        });

        res.cookie('accesstoken', accessToken, {
            maxAge: 1000*60*24*30,
            httpOnly: true
        });



        const userDto  = new UserDto(user);
        res.json({user: userDto, auth: true});
    }
}


module.exports = new AuthController();