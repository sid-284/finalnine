import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import razorpay from 'razorpay'
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config()
const currency = 'inr'

// Validate Razorpay configuration
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay configuration missing. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
}

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
    const requestId = `rzp_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    try {
        console.log(`[${requestId}] placeOrderRazorpay - start`);
        // Validate userId is present
        if (!req.userId) {
            console.log(`[${requestId}] placeOrderRazorpay - Missing userId in request`);
            return res.status(401).json({message: 'User not authenticated properly'});
        }
        
        const {items , amount , address} = req.body;
        const userId = req.userId;
        console.log(`[${requestId}] placeOrderRazorpay - payload`, {
            itemsCount: Array.isArray(items) ? items.length : 0,
            amount,
            hasAddress: !!address,
            userId
        });
        
        // Validate required fields
        if (!items || !amount || !address) {
            console.log(`[${requestId}] placeOrderRazorpay - missing fields`);
            return res.status(400).json({message: 'Missing required fields: items, amount, or address'});
        }
        
        console.log(`[${requestId}] placeOrderRazorpay - Creating order for userId: ${userId}`);
        
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
        
        console.log(`[${requestId}] placeOrderRazorpay - DB order saved: ${newOrder._id}`);

        // Sanitize and validate amount
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            console.log(`[${requestId}] placeOrderRazorpay - invalid amount`, { numericAmount });
            return res.status(400).json({ message: 'Invalid amount' });
        }
        const paiseAmount = Math.round(numericAmount * 100); // integer paise, rounded
        console.log(`[${requestId}] placeOrderRazorpay - amount calc`, { numericAmount, paiseAmount });

        // Resolve keys/mode per request
        const { mode, key_id, key_secret } = resolveRazorpayKeys();
        if (!mode || !key_id || !key_secret) {
            console.log(`[${requestId}] placeOrderRazorpay - missing payment configuration`, { modePresent: !!mode, keyPresent: !!key_id, secretPresent: !!key_secret });
            return res.status(500).json({ message: 'Payment configuration missing' });
        }
        const maskedKey = key_id ? `${key_id.slice(0,7)}...` : 'missing';
        console.log(`[${requestId}] placeOrderRazorpay - resolved mode`, { mode, keyPrefix: maskedKey });

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
        console.log(`[${requestId}] placeOrderRazorpay - create options`, { amount: options.amount, currency: options.currency, receipt: options.receipt });
        
        try {
            const razorpayOrder = await rp.orders.create(options);
            console.log(`[${requestId}] placeOrderRazorpay - Razorpay order created`, { orderId: razorpayOrder.id, mode, keyPrefix: maskedKey });
            // persist razorpay order id for later admin view
            await Order.findByIdAndUpdate(newOrder._id, { razorpayOrderId: razorpayOrder.id });
            return res.status(200).json({
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                receipt: razorpayOrder.receipt,
                key: key_id
            });
        } catch (razorpayError) {
            console.log(`[${requestId}] placeOrderRazorpay - Razorpay error`, {
                message: razorpayError?.message,
                statusCode: razorpayError?.statusCode,
                description: razorpayError?.error?.description,
                code: razorpayError?.error?.code
            });
            try {
                await Order.findByIdAndDelete(newOrder._id);
                console.log(`[${requestId}] placeOrderRazorpay - cleaned DB order ${newOrder._id}`);
            } catch (cleanupError) {
                console.log(`[${requestId}] placeOrderRazorpay - cleanup failed`, { error: cleanupError.message });
            }
            return res.status(401).json({ message: 'Failed to create payment order', details: razorpayError?.error?.description || razorpayError?.message || 'Authentication failed' });
        }
    } catch (error) {
        console.log(`[${requestId}] placeOrderRazorpay - General error:`, error.message);
        return res.status(500).json({message: error.message})
    }
}

export const verifyRazorpay = async (req,res) =>{
    const requestId = `rzpver_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    try {
        console.log(`[${requestId}] verifyRazorpay - start`);
        // Validate userId is present
        if (!req.userId) {
            console.log(`[${requestId}] verifyRazorpay - Missing userId in request`);
            return res.status(401).json({message: 'User not authenticated properly'});
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.userId;
        console.log(`[${requestId}] verifyRazorpay - payload`, { razorpay_order_id, hasPaymentId: !!razorpay_payment_id, hasSignature: !!razorpay_signature, userId });

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            console.log(`[${requestId}] verifyRazorpay - missing fields`);
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        const { key_secret } = resolveRazorpayKeys();
        if (!key_secret) {
            console.log(`[${requestId}] verifyRazorpay - missing secret`);
            return res.status(500).json({ message: 'Payment configuration missing' });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', key_secret)
            .update(body)
            .digest('hex');
        console.log(`[${requestId}] verifyRazorpay - signature compare`, { expectedSignaturePrefix: expectedSignature.slice(0,8), providedSignaturePrefix: razorpay_signature.slice(0,8) });

        if (expectedSignature !== razorpay_signature) {
            console.log(`[${requestId}] verifyRazorpay - invalid signature`);
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        // Fetch razorpay order to retrieve our DB receipt (order id)
        const { key_id, key_secret: ks } = resolveRazorpayKeys();
        const rp = new razorpay({ key_id, key_secret: ks });
        let orderInfo;
        try {
            orderInfo = await rp.orders.fetch(razorpay_order_id);
            console.log(`[${requestId}] verifyRazorpay - fetched razorpay order`, { id: orderInfo?.id, receipt: orderInfo?.receipt, status: orderInfo?.status });
        } catch (e) {
            console.log(`[${requestId}] verifyRazorpay - Failed to fetch order from Razorpay:`, e?.message);
            return res.status(500).json({ message: 'Payment verification failed (lookup)' });
        }

        const dbOrderId = orderInfo?.receipt;
        if (!dbOrderId) {
            console.log(`[${requestId}] verifyRazorpay - missing receipt in order`);
            return res.status(500).json({ message: 'Payment verification failed (missing receipt)' });
        }

        await Order.findByIdAndUpdate(dbOrderId, { 
            payment: true,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paymentVerifiedAt: new Date(),
            status: 'Paid'
        });
        await User.findByIdAndUpdate(userId, { cartData: {} });
        console.log(`[${requestId}] verifyRazorpay - marked order paid & cleared cart`, { dbOrderId, userId });

        return res.status(200).json({ message: 'Payment verified successfully' });
    } catch (error) {
        console.log(`[${requestId}] verifyRazorpay - General error:`, error.message)
        return res.status(500).json({message: error.message})
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