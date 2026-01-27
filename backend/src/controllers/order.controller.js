import {Product} from "../models/product.model.js";
import {Order} from "../models/order.model.js";
import {Review} from "../models/review.model.js";

export const createOrder = async (req, res) => {
    try {
        const user = req.user;
        const {orderItems, totalPrice, shippingAddress, paymentResult} = req.body;
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({error: "No order items"})
        }

//     validate products and stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(404).json({error: `Product ${item.name} not found`})
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({error: `Insufficient stock for ${product.name} `})
            }
        }

        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice,
        })

        // update stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: {stock: -item.stock},
            });
        }
        res.status(201).json({message: 'Order successfully created', order})
    } catch (err) {
        console.error("Error creating order", err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getUserOrders = async (req, res) => {
    try {
    const orders = await Order.find({clerkId: req.user.clerkId}).populate("orderItem.product")
        .sort({createdAt: -1});

        // check if each order has been reviewed
        const ordersWithReviewStatus = await Promise.all(
            orders.map(async (order) => {
                const review = await Review.findOne({ orderId: order._id });

                return {
                    ...order.toObject(),
                    hasReviewed: !!review,
                };
            })
        );


        res.status.json({orders: ordersWithReviewStatus});
    }
    catch (err) {
        console.error("Error fetching user orders", err)
        res.status(500).json({message:"Internal Server Error"})
    }
}