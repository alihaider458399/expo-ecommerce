import mongoose from 'mongoose'

const orderItemsSchema = new mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    name: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    quantity: {type: Number, required: true, min: 1},
    image: {type: String, required: true},
})

const shippingAddressSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: String, required: true},
    phone: {type: String, required: true},
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clerkId: {type: String, required: true},
    orderItems: [orderItemsSchema],
    shippingAddress: {type: shippingAddressSchema, required: true},
    paymentResult: {id: String, status: String},
    totalPrice: {type: Number, required: true},
    orderStatus: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending",
    },
    deliveredAt: {type: Date},
    shippingAt: {type: Date},
}, {timestamps: true})

export const Order = mongoose.model('Order', orderSchema)