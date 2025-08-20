import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId: {
        type:String,
        required: true
    },
    items: {
          type:Array,
        required: true
    },
    amount: {
        type:Number,
        required: true
    },
    address: {
        type:Object,
        required: true
    },
    status: {
        type:String,
        required: true,
        default:'Order Placed'
    },
    paymentMethod: {
        type:String,
        required: true
    },
    payment: {
        type:Boolean,
        required: true,
        default:false
    },
    // Razorpay payment identifiers and metadata
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    paymentVerifiedAt: { type: Date },
    paymentNotes: { type: Object, default: {} },
    date: {
        type: Number,
        required:true
    }
},{timestamps:true}) 

const Order = mongoose.model('Order' , orderSchema)

export default Order