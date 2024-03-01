const {validateUser, createUser, loginUser, getProfile} = require('../service/user.service');
const { createToken,comparePassword, verifyToken } = require('../util/credentials');
const validator =require('validator');
const transporter = require('../service/EmailService/transporter');

const signup = async (req,res)=>{
    const {username,email,password } = req.body;
    try{
     if(!username || !email || !password){
        return res.status(400).json({
            success: false,
            message:"All fields are required"
        })
    }
    if(username.length < 3){
        return res.status(400).json({
            success: false,
            message:"Username must be at least 4 characters"
        })
    }
    if(password.length < 6){
        return res.status(400).json({
            success: false,
            message:"Password must be at least 6 characters"
        })
    }
    const exitUser = await validateUser(username,email);
    if(exitUser){
        return res.status(400).json({
            success: false,
            message:"User name or Email Already Exists"
        })
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({
            success: false,
            message:"Email is not valid format."
        })
    }
    const user = await createUser(username,email,password);
    const confirmationCode = user.id;
    //Send confirmation email
    const mailOptions = {
        from: 'rajshivam691@gmail.com',
        to: email,
        subject: 'Email Confirmation',
        html:`
        <p>Dear ${username},</p>
        <p>Thank you for signing up! Please click the following link to confirm your email:</p>
        <a href="http://yourwebsite.com/confirm/${confirmationCode}">Confirm Email</a>
        <p>If you did not sign up for our service, please ignore this email.</p>
        <p>Best Regards,<br>Your Application Team</p>

        `
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info);
      });

    return res.status(201).json({
        success: true,
        message:"User created successfully",
        data:user,
    })
        
   }catch(error){
     return res.status(500).json({
         success: false,
         message: error.message
     })
   }

}

const login = async (req,res) => {
    const {email, password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message:"All fields are required"
            })
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message:"Email is not valid format."
            })
        }
        const user = await loginUser(email,password);
        if(!user){
            return res.status(400).json({
                success: false,
                message:"Invalid Credentials"
            })
        }
        const isMatch = await comparePassword(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message:"Password does not match",
            })
        }
        const token = createToken({
            id:user.id,
            username:user.username
        });
        return res.status(200).json({
            success: true,
            message:"User logged in successfully",
            data:user,
            metaData:{
                "accessToken":token
            }
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const profile = async (req,res)=>{
    const authtoken = req.headers.authorization;
    try{
    if(!authtoken){
        return res.status(401).json({
            success: false,
            message:"Unauthorized"
        })
    }
    const token = authtoken.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success: false,
            message:"Unauthorized"
        })
    }
    const decoded = verifyToken(token);
    if(!decoded){
        return res.status(401).json({
            success: false,
            message:"Unauthorized"
        })
    }
    const user = await getProfile(decoded);
    return res.status(200).json({
        success: true,
        message:"User profile",
        data:{
            username:user.username,
            email:user.email
        }
    })
   }
   catch(error){
    return res.status(500).json({
        success: false,
        message: error.message
    })
   }
}
module.exports = {
    signup,
    login,
    profile
}