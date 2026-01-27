import {Cart} from "../models/cart.model.js";
import {Product} from "../models/product.model.js";

export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({clerkId: req.user.clerkId}).populate("items.product");

        if (!cart) {
            const user = req.user;
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: []
            })
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart", error)
        res.status(500).json({message: "Internal server error"});
    }
}


export const addToCart = async (req, res) => {
    try {
        const {productId, quantity = 1} = req.body;
        // validate the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({message: "Product not found"});
        }
        //     validate stock of product
        if (product.stock < quantity) {
            return res.status(400).json({message: "Insufficient stock"});
        }
        let cart = await Cart.findOne({clerkId: req.user.clerkId});
        if (!cart) {
            const user = req.user;
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: []
            })

            //     check if item already in cart
            const existingItem = cart.items.find(item => item.product.toString() === productId);
            //     increment quantity
            const newQuantity = existingItem.quantity + 1;
            if (product.stock < newQuantity) {
                return res.status(400).json({message: "Insufficient stock"});
            }
            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({product: productId, quantity})
        }
        await cart.save();
        res.status(200).json({message: "Successfully added to cart"});
    } catch (error) {
        console.error("Error while adding to cart ", error)
        res.status(500).json({message: "Internal server error"});
    }
}

export const updateCartItem = async (req, res) => {
    try {
        const {productId} = req.params;
        const {quantity} = req.body;
        if (quantity < 1) {
            return res.status(400).json({message: "Quantity must be at least 1"});

        }
        const cart = await Cart.findOne({clerkId: req.user.clerkId});
        if (!cart) {
            return res.status(404).json({message: "Cart not found"});
        }
        // find the index of product in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(400).json({message: "Item not found in cart"});
        }

        // stokc and product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }

        if (product.stock < quantity) {
            return res.status(400).json({message: "Insufficient stock"});
        }
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({message: "Successfully cart updated"});

    } catch (error) {
        console.error("Error updating cart", error)
        res.status(500).json({message: "Internal server error"});
    }

}
export const removeFromCart = async (req, res) => {
    try {
        const {productId} = req.params;
        const cart = await Cart.findOne({clerkId: req.user.clerkId});
        if (!cart) {
            return res.status(404).json({message: "Cart not found"});
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId)
        await cart.save();
        res.status(200).json({message: "Successfully removed from cart"});
    }
 catch (error) {
    console.error("Error while adding to cart ", error)
    res.status(500).json({message: "Internal server error"});
}

}
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({clerkId: req.user.clerkId});
        if (!cart) {
            return res.status(404).json({message: "Cart not found"});
        }
        cart.items=[];
        await cart.save();
        res.status(200).json({message: "Cart successfully cleared"});
    }
    catch (error) {
        console.error("Error while adding to cart ", error)
        res.status(500).json({message: "Internal server error"});
    }
}