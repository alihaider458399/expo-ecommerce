import mongoose, {Schema} from "mongoose";



const reviewSchema = new mongoose.Schema({
    productId:{type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    orderId:{type:mongoose.Schema.Types.ObjectId,ref:'Order'},
    rating:{type:Number,min:1, max:5},
},{timestamps:true});

export const Review = mongoose.model("Review",reviewSchema);