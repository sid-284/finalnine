import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { allOrders, placeOrder, placeOrderRazorpay, updateStatus, userOrders, verifyRazorpay, placeOrderRazorpayGuest, verifyRazorpayGuest } from '../controller/orderController.js'
import adminAuth from '../middleware/adminAuth.js'

const orderRoutes = express.Router()

//for User
orderRoutes.post("/placeorder",isAuth,placeOrder)
orderRoutes.post("/razorpay",isAuth,placeOrderRazorpay)
// Guest checkout endpoints (no auth)
orderRoutes.post("/razorpay-guest", placeOrderRazorpayGuest)
orderRoutes.post("/userorder",isAuth,userOrders)
orderRoutes.post("/verifyrazorpay",isAuth,verifyRazorpay)
orderRoutes.post("/verifyrazorpay-guest", verifyRazorpayGuest)
 
//for Admin
orderRoutes.post("/list", isAuth, adminAuth, allOrders)
orderRoutes.post("/status", isAuth, adminAuth, updateStatus)

export default orderRoutes