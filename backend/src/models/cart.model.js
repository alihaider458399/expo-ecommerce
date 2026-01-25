import mongoose from 'mongoose'


const cartItemsSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: {type: Number, min: 1, default: 1},
})



const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    items: [cartItemsSchema],



}, {timestamps: true})

export const Cart = mongoose.model('Cart', cartSchema)

