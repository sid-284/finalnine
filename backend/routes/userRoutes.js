import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getAdmin, getCurrentUser, getWishlist, addToWishlist, removeFromWishlist, updateUserProfile } from "../controller/userController.js"
import { wishlistLimiter } from "../middleware/rateLimiter.js"
import adminAuth from "../middleware/adminAuth.js"

let userRoutes = express.Router()

userRoutes.get("/getcurrentuser",isAuth,getCurrentUser)
userRoutes.get("/getadmin", isAuth, adminAuth, getAdmin)
userRoutes.get('/wishlist', isAuth, wishlistLimiter, getWishlist);
userRoutes.post('/wishlist/add', isAuth, wishlistLimiter, addToWishlist);
userRoutes.post('/wishlist/remove', isAuth, wishlistLimiter, removeFromWishlist);
userRoutes.post('/updateprofile', isAuth, updateUserProfile);


export default userRoutes