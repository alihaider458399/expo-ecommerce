import {Order} from "../models/order.model.js";
import {Review} from "../models/review.model.js";

export const createReview = async (req, res) => {
    try {
        const {orderId,productId,rating} = req.body;
        if (!rating || rating <1 || rating > 5) {
            return res.status(400).json({error: "Rating must be 1 to 5"});
        }
        const user = req.user;
    //     verify order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({error: "Order not found"});
        }
        if(order.clerkId !== user.clerkId) {
            return res.status(403).json({error: "Not Authorized to review"});
        }
        if(order.status !== "delivered") {
            return res.status(400).json({error: "Can only review to delivered orders"});
        }

    //   to review to all product separately like popup for all
    //     verify product in the order
        const productInOrder = order.orderItems.find(item => item.product.toString() === productId.toString());
        if (!productInOrder) {
            return res.status(400).json({error: "Product not found in this order"});
        }

    //     check if review already exists
        const existingReview = await Review.findOne({productId, userId:user._id})
        if (existingReview) {
            return res.status(400).json({error: "Already Reviewed"});
        }

        const review = await Review.create({
            productId,
            userId:user._id,
            orderId,
            rating,
        });
        res.status(201).json({message:"Review created successfully",review});
    }

    catch (error) {
        console.error("Error reviewing the product", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}
export const deleteReview = async (req, res) => {
    try {
    const{reviewId} = req.params;
    const user = req.user;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({error: "Review not found"});
    }
    if(review.userId.toString() !== user._id.toString()) {
        return res.status(403).json({error: "Not Authorized to delete review"});
    }
    const productId = review.productId;
    await Review.findByIdAndDelete(productId);
    res.status(200).json({message:"Review deleted"});
    }
    catch (error) {
        console.error("Error deleting the review", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}