import cloudinary from "../config/cloudinary.js";
import {Product} from "../models/product.model.js";
import {Order} from "../models/order.model.js";
import {User} from "../models/user.model.js";

// Product controllers
export const createProduct = async (req, res) => {
    try {
        const {name, description, price, stock, category} = req.body;

        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({message: "All fields are required"});
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({message: "At least one image is required"});
        }
        if (req.files.length > 3) {
            return res.status(400).json({message: "Max 3 images are allowed"});
        }

        //     upload images promise
        const uploadPromise = req.files.map(file => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products",
            });
        })
        // wait until all uploads finish
        const uploadResults = await Promise.all(uploadPromise);

        //     get secure_url from the upload results
        const imageUrl = uploadResults.map(result => result.secure_url)


        //     creating our product
        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            image: imageUrl

        })
        res.status(200).json(product)
    } catch (error) {
    console.error("Error while creating product", error
    )
        res.status(500).json({message:"Internal server error"});
    }

}
export const getAllProducts = async (req, res) => {
try{
    // -1 means in desc order most recent product first
    const products = await Product.find().sort({createdAt: -1})
    res.status(200).json(products)
}
catch(error){
    console.error("Error while fetching products",error)
    res.status(500).json({message:"Internal server error"});
}
}

export const updateProduct = async (req, res) => {
    try {
    const {id} = req.params;
    const {name, description, price, stock, category} = req.body;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({message: "Product not found"});
    }
    if(name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if(category) product.category = category;
    if (stock !== undefined) product.stock = parseFloat(stock);


    // updating image urls or images
        if(req.files && req.files.length > 0) {
        if(req.files.length > 3) {
           return res.status(400).json({message: "Max 3 images are allowed"});
            }
            //     upload images promise
            const uploadPromise = req.files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
            })
            // wait until all uploads finish
            const uploadResults = await Promise.all(uploadPromise);
        product.images = uploadResults.map(result => result.secure_url)
        }

        await product.save();
        res.status(200).json(product);
    }
    catch(error){
        console.error("Error while updating products",error)
        res.status(500).json({message:"Internal server error"});
    }

}



//Order controllers
export const getAllOrders = async (req, res) => {
    try {
        // populate is used to create like a relation mean it reffers to somethign and late on we can fetch data like pointer pointing to something

        const orders = await Order.find().populate("user", "name email").populate("orderItems.product").sort({createdAt: -1})
        res.status(200).json(orders)

    } catch (error) {
    console.error("Error while fetching orders", error)
        res.status(500).json({message:"Internal server error"});
    }


}

export const updateOrderStatus = async (req, res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;

        if(!["pending","shipped","delivered"].includes(status)) {
            return res.status(400).json({message:"Invalid status"});
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({message: "Order not found"});
        }

        order.orderStatus = status;

        if (status === "shipped" && !order.shippedAt) {
            order.shippedAt = new Date();
        }
        if (status === "delivered" && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }

//     save order status
        await order.save();

        res.satus(200).json({message:"Order successfully updated",order});


    }
    catch (error) {
        console.error("Error while updating order status", error)
        res.status(500).json({message:"Internal server error"});
    }

}

//customer controllers
export const getAllCustomers = async (req, res) => {
    try {
        const customer = await User.find().sort({createdAt: -1})
        res.status(200).json(customer)
    }
    catch(error){
        console.error("Error while getting customers",error)
        res.status(500).json({message:"Internal server error"});
    }
}

export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
        {
            $group: {
                _id: null,
                total:{$sum:"$totalPrice"},
            },
        },
    ]);

    const totalRevenue = revenueResult[0].total || 0;
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
        res.status(200).json({totalOrders,totalRevenue,totalCustomers,totalProducts});
    }
    catch(error){
    console.error("Error while getting admin dashboards stats", error)
        res.status(500).json({message:"Internal server error"});
    }
}