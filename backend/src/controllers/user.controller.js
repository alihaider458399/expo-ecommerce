import {User} from "../models/user.model.js"
// Address controllers
export const addAddress = async (req, res) => {
    try{
    const {label, fullName, streetAddress, city, state, zipcode, phoneNumber, isDefault} = req.body

        const user = req.user;
        // if address is default unset all other addresses
        if (isDefault) {
        user.addresses.forEach((address) => {
            address.isDefault = false;
        })
        }

        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipcode,
            phoneNumber,
            isDefault: isDefault || false,
        })
        await user.save()

        res.status(201).json({message:"Address added successfully",addresses:user.addresses})
    }

    catch(err){
        console.error("Error adding address", err)
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const getAllAddresses = async (req, res) => {

    try {
    const user = req.user;
    res.status(200).json({addresses:user.addresses})
    }
    catch(err){
        console.error("Error getting address", err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const updateAddress = async (req, res) => {
    try{
        const {label, fullName, streetAddress, city, state, zipcode, phoneNumber, isDefault} = req.body
        const {addressId} = req.params; 
        const user = req.user;

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(400).json({message:"Address not found"})
        }
        // if address is default unset all other addresses
        if (isDefault) {
            user.addresses.forEach((address) => {
                address.isDefault = false;
            })
        }
        address.label = label || address.label;
        address.fullName = fullName || address.streetAddress;
        address.streetAddress = streetAddress || address.streetAddress;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipcode = zipcode || address.zipcode;
        address.phoneNumber = phoneNumber || address.phoneNumber;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;
    await user.save()
        res.status(201).json({message:"Address updated successfully",address:address})
    }
    catch(err){
        console.error("Error updating address", err)
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const deleteAddress = async (req, res) => {
    try {
    const {addressId} = req.params;
    const user = req.user;
    user.addresses.pull(addressId);
    await user.save();
    res.status(200).json({message:"Address deleted successfully"})
    }
    catch(err) {
        console.error("Error while deleting address", err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

//Wish List controllers
export const addToWishList = async (req, res) => {
    try {
        const {productId} = req.body;
        const user= req.user;
    //     check if product already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({message:"Product already in wishlist"})
        }
        user.wishlist.push(productId);
        await user.save();
        res.status(200).json({message:"Product added to wishlist added"})
    }
    catch(err) {
        console.error("Error while adding to wishlist", err)
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const getWishList = async (req, res) => {
    try {
    const user = req.user;
    res.status(200).json({wishlist:user.wishlist});
    }
    catch(err) {
        console.error("Error while fetching wishlist", err)
        res.status(500).json({message:"Internal Server Error"})
    }}


export const removeFromWishList = async (req, res) => {
    try {
        const productId = req.params;
        const user = req.user;
        user.wishlist.pull(productId);
        await user.save();
        res.status(200).json({message:"Product removed from wishlist"})
    }
    catch(err) {
        console.error("Error while removing from wishlist", err)
        res.status(500).json({message:"Internal Server Error"})
    }
}
