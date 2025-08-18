import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    firebaseUid:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false // Optional since we're using Firebase auth
    },
    avatar:{
        type:String,
        default:""
    },
    cartData:{
        type:Object,
        default:{}
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isAdmin: { type: Boolean, default: false },
},{timestamps:true , minimize:false})

const User = mongoose.model("User",userSchema)

export default User