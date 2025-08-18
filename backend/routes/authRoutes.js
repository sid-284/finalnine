import express from "express"
import { adminLogin, googleLogin, login, logOut, registration } from "../controller/authController.js"
import User from "../model/userModel.js"
import { authLimiter } from "../middleware/rateLimiter.js"

const authRoutes = express.Router()

authRoutes.post("/registration", authLimiter, registration)
authRoutes.post("/login", authLimiter, login)
authRoutes.get("/logout", logOut)
authRoutes.post("/googlelogin", authLimiter, googleLogin)
authRoutes.post("/adminlogin", authLimiter, adminLogin)

// Test route to check users in database
authRoutes.get("/test-users", async (req, res) => {
    try {
        const users = await User.find({}).select('name email firebaseUid createdAt');
        res.json({ count: users.length, users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default authRoutes