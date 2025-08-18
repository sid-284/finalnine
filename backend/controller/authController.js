import User from "../model/userModel.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import { genToken, genToken1 } from "../config/token.js";


export const registration = async (req,res) => {
  try {
    const {name , email, firebaseUid, avatar} = req.body;
    console.log('Registration attempt:', { name, email, firebaseUid, avatar });
    
    // Check if user exists by email
    const existUserByEmail = await User.findOne({email})
    if(existUserByEmail){
        return res.status(400).json({message:"User already exists with this email"})
    }
    
    // Check if user exists by firebaseUid
    const existUserByFirebase = await User.findOne({firebaseUid})
    if(existUserByFirebase){
        return res.status(400).json({message:"User already exists with this Firebase UID"})
    }
    
    if(!validator.isEmail(email)){
         return res.status(400).json({message:"Enter valid Email"})
    }
    if(!firebaseUid){
        return res.status(400).json({message:"Firebase UID is required"})
    }

    const user = await User.create({name, email, firebaseUid, avatar});
    let token = await genToken(user._id)
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    console.log('User created successfully:', user._id);
    return res.status(201).json(user)
  } catch (error) {
    console.log("registration error:", error)
    return res.status(500).json({message:`registration error ${error.message}`})
  }
    
}


export const login = async (req,res) => {
    try {
        let {email, firebaseUid, name, avatar} = req.body;
        console.log('Login attempt:', { email, firebaseUid, name, avatar });
        
        // Validate required fields
        if (!email || !firebaseUid) {
            console.log('Missing required fields:', { email: !!email, firebaseUid: !!firebaseUid });
            return res.status(400).json({message:"Email and Firebase UID are required"});
        }
        
        let user = await User.findOne({email}) 
        if(!user){
            // If user doesn't exist, create them (Firebase already authenticated them)
            console.log('User not found, creating new user from login');
            try {
                user = await User.create({
                    name: name || email.split('@')[0], // Use name or email prefix as fallback
                    email,
                    firebaseUid,
                    avatar: avatar || ''
                });
                console.log('User created from login:', user._id);
            } catch (createError) {
                console.error('User creation error:', createError);
                return res.status(500).json({message:"Failed to create user account"});
            }
        } else {
            // For Firebase auth, we check by firebaseUid instead of password
            if(firebaseUid && user.firebaseUid !== firebaseUid){
                console.log('Firebase UID mismatch:', { provided: firebaseUid, stored: user.firebaseUid });
                return res.status(400).json({message:"Authentication failed"})
            }
            
            // update name/avatar if provided (for Google login)
            let updated = false;
            if (name && user.name !== name) { user.name = name; updated = true; }
            if (avatar && user.avatar !== avatar) { user.avatar = avatar; updated = true; }
            if (updated) {
                try {
                    await user.save();
                } catch (saveError) {
                    console.error('User save error:', saveError);
                    return res.status(500).json({message:"Failed to update user profile"});
                }
            }
        }
        
        let token = await genToken(user._id)
        res.cookie("token",token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    console.log('Login successful:', user._id);
    return res.status(201).json(user)

    } catch (error) {
         console.error("login error:", error)
    return res.status(500).json({message:`Login error: ${error.message}`})
        
    }
    
}
export const logOut = async (req,res) => {
try {
    res.clearCookie("token")
    return res.status(200).json({message:"logOut successful"})
} catch (error) {
    console.error("logOut error:", error)
    return res.status(500).json({message:`LogOut error: ${error.message}`})
}
    
}


export const googleLogin = async (req,res) => {
    try {
        let {name , email, firebaseUid, avatar} = req.body;
        console.log('Google login attempt:', { name, email, firebaseUid, avatar });
        
        let user = await User.findOne({email}) 
        if(!user){
            console.log('Creating new user from Google login');
            user = await User.create({
                name,
                email,
                firebaseUid,
                avatar
            });
            console.log('User created from Google login:', user._id);
        } else {
            // update name/avatar/firebaseUid if changed
            let updated = false;
            if (name && user.name !== name) { user.name = name; updated = true; }
            if (avatar && user.avatar !== avatar) { user.avatar = avatar; updated = true; }
            if (firebaseUid && user.firebaseUid !== firebaseUid) { user.firebaseUid = firebaseUid; updated = true; }
            if (updated) await user.save();
        }
       
        let token = await genToken(user._id)
        res.cookie("token",token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    console.log('Google login successful:', user._id);
    return res.status(200).json(user)

    } catch (error) {
         console.error("googleLogin error:", error)
    return res.status(500).json({message:`googleLogin error: ${error.message}`})
    }
    
}


export const adminLogin = async (req,res) => {
    try {
        let {email , password} = req.body
        console.log('Admin login attempt:', { email, password });
        console.log('Expected admin email:', process.env.ADMIN_EMAIL);
        console.log('Expected admin password:', process.env.ADMIN_PASSWORD);
        
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            console.log('Admin login successful');
            let token = await genToken1(email)
            res.cookie("token",token,{
                httpOnly:true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
                maxAge: 1 * 24 * 60 * 60 * 1000
            })
            return res.status(200).json({ message: 'Admin login successful', token })
        }
        console.log('Admin login failed - invalid credentials');
        return res.status(400).json({message:"Invalid credentials"})

    } catch (error) {
        console.log("AdminLogin error:", error)
        return res.status(500).json({message:`AdminLogin error ${error.message}`})
        
    }
    
}

