import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import razorpay from 'razorpay'
import dotenv from 'dotenv'
dotenv.config()
const currency = 'inr'

// Validate Razorpay configuration
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay configuration missing. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
}

// Helper to resolve Razorpay keys and mode
const resolveRazorpayKeys = () => {
    const explicitMode = (process.env.RAZORPAY_MODE || '').toLowerCase().trim();

    const liveId = (process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_LIVE_KEY_ID || '').trim();
    const liveSecret = (process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_LIVE_KEY_SECRET || '').trim();

    const testId = (process.env.RAZORPAY_TEST_KEY_ID || '').trim();
    const testSecret = (process.env.RAZORPAY_TEST_KEY_SECRET || '').trim();

    const hasLive = !!(liveId && liveSecret);
    const hasTest = !!(testId && testSecret);

    let mode = 'live';
    let key_id = liveId;
    let key_secret = liveSecret;

    if (explicitMode === 'test' && hasTest) {
        mode = 'test';
        key_id = testId;
        key_secret = testSecret;
    } else if (!hasLive && hasTest) {
        mode = 'test';
        key_id = testId;
        key_secret = testSecret;
    } else if (!hasLive && !hasTest) {
        return { mode: null, key_id: null, key_secret: null };
    }

    return { mode, key_id, key_secret };
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Optional fallback (test) instance
const hasTestKeys = !!(process.env.RAZORPAY_TEST_KEY_ID && process.env.RAZORPAY_TEST_KEY_SECRET);
const razorpayTestInstance = hasTestKeys ? new razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET
}) : null;

console.log('Razorpay instance created with key_id:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');

// for User
export const placeOrder = async (req,res) => {
     try {
         // Validate userId is present
         if (!req.userId) {
             console.log('placeOrder - Missing userId in request');
             return res.status(401).json({message: 'User not authenticated properly'});
         }
         
         const {items , amount , address} = req.body;
         const userId = req.userId;
         
         // Validate required fields
         if (!items || !amount || !address) {
             return res.status(400).json({message: 'Missing required fields: items, amount, or address'});
         }
         
         console.log('placeOrder - Creating order for userId:', userId);
         
         const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod:'COD',
            payment:false,
            date: Date.now()
         }

         const newOrder = new Order(orderData)
         await newOrder.save()
         
         console.log('placeOrder - Order saved successfully:', newOrder._id);

         await User.findByIdAndUpdate(userId,{cartData:{}})

         return res.status(201).json({message:'Order Placed', orderId: newOrder._id})
    } catch (error) {
        console.log('placeOrder error:', error.message)
        res.status(500).json({message:'Order Place error'})
    }
}

export const placeOrderRazorpay = async (req,res) => {
    try {
        // Validate userId is present
        if (!req.userId) {
            console.log('placeOrderRazorpay - Missing userId in request');
            return res.status(401).json({message: 'User not authenticated properly'});
        }
        
        const {items , amount , address} = req.body;
        const userId = req.userId;
        
        // Validate required fields
        if (!items || !amount || !address) {
            return res.status(400).json({message: 'Missing required fields: items, amount, or address'});
        }
        
        console.log('placeOrderRazorpay - Creating order for userId:', userId);
        
        const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod:'Razorpay',
            payment:false,
            date: Date.now()
        }

        const newOrder = new Order(orderData)
        await newOrder.save()
        
        console.log('placeOrderRazorpay - Order saved successfully:', newOrder._id);

        // Sanitize and validate amount
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        const paiseAmount = Math.round(numericAmount * 100); // integer paise, rounded
        // Resolve keys/mode per request
        const { mode, key_id, key_secret } = resolveRazorpayKeys();
        if (!mode || !key_id || !key_secret) {
            return res.status(500).json({ message: 'Payment configuration missing' });
        }

        const rp = new razorpay({ key_id, key_secret });

        const options = {
            amount: paiseAmount,
            currency: 'INR',
            receipt: newOrder._id.toString(),
            payment_capture: 1,
            notes: {
                order_id: newOrder._id.toString(),
                user_id: userId.toString()
            }
        }
        
        try {
            const razorpayOrder = await rp.orders.create(options);
            console.log('placeOrderRazorpay - Razorpay order created:', razorpayOrder.id, 'mode:', mode, 'key prefix:', key_id?.slice(0,7));
            return res.status(200).json({
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                receipt: razorpayOrder.receipt,
                key: key_id
            });
        } catch (razorpayError) {
            console.log('Razorpay order creation error:', {
                message: razorpayError?.message,
                statusCode: razorpayError?.statusCode,
                description: razorpayError?.error?.description,
                code: razorpayError?.error?.code
            });
            try {
                await Order.findByIdAndDelete(newOrder._id);
                console.log('placeOrderRazorpay - Cleaned up failed order');
            } catch (cleanupError) {
                console.log('placeOrderRazorpay - Failed to cleanup order:', cleanupError.message);
            }
            return res.status(401).json({ message: 'Failed to create payment order', details: razorpayError?.error?.description || razorpayError?.message || 'Authentication failed', mode });
        }
    } catch (error) {
        console.log('placeOrderRazorpay - General error:', error.message);
        return res.status(500).json({message: error.message})
    }
}


export const verifyRazorpay = async (req,res) =>{
    try {
        // Validate userId is present
        if (!req.userId) {
            console.log('verifyRazorpay - Missing userId in request');
            return res.status(401).json({message: 'User not authenticated properly'});
        }
        
        const userId = req.userId
        const {razorpay_order_id} = req.body
        
        if (!razorpay_order_id) {
            return res.status(400).json({message: 'Razorpay order ID is required'});
        }
        
        console.log('verifyRazorpay - Verifying payment for userId:', userId, 'orderId:', razorpay_order_id);
        
        try {
            const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
            console.log('verifyRazorpay - Razorpay order info:', orderInfo.status);
            
            if(orderInfo.status === 'paid'){
                await Order.findByIdAndUpdate(orderInfo.receipt,{payment:true});
                await User.findByIdAndUpdate(userId , {cartData:{}})
                console.log('verifyRazorpay - Payment verified successfully');
                res.status(200).json({message:'Payment Successful'})
            }
            else{
                console.log('verifyRazorpay - Payment not completed, status:', orderInfo.status);
                res.status(400).json({message:'Payment Failed - Payment not completed'})
            }
        } catch (razorpayError) {
            console.log('Razorpay verification error:', razorpayError);
            res.status(500).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        console.log('verifyRazorpay - General error:', error.message)
         res.status(500).json({message: error.message})
    }
}






export const userOrders = async (req,res) => {
      try {
        // Validate userId is present
        if (!req.userId) {
            console.log('userOrders - Missing userId in request');
            return res.status(401).json({message: 'User not authenticated properly'});
        }
        
        const userId = req.userId;
        console.log('userOrders - Fetching orders for userId:', userId);
        
        const orders = await Order.find({userId})
        console.log('userOrders - Found orders count:', orders.length);
        
        return res.status(200).json(orders)
    } catch (error) {
        console.log('userOrders error:', error.message)
        return res.status(500).json({message:"userOrders error"})
    }
}




//for Admin



    
export const allOrders = async (req,res) => {
    try {
        const orders = await Order.find({})
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"adminAllOrders error"})
        
    }
    
}
    
export const updateStatus = async (req,res) => {
    
try {
    const {orderId , status} = req.body

    await Order.findByIdAndUpdate(orderId , { status })
    return res.status(201).json({message:'Status Updated'})
} catch (error) {
     return res.status(500).json({message:error.message
            })
}
}