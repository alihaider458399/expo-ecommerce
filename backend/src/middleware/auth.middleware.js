import {requireAuth} from "@clerk/express";
import {ENV} from "../config/env.js";
import {User} from "../models/user.model.js";



export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
    try {
    const clerkId = req.auth().userId;
    if(!clerkId){
        res.status(401).json({message:"Unauthorized Token"});
    }

    const user = await User.findOne({clerkId})
        if(!user){
            res.status(404).json({message:"User not found"});
        }

        req.user = user;
        console.log(req.user);
        next();
    }
    catch (error) {
        console.error("Error in protectRoutes",error);
        res.status(500).json({message:"Internal Server Error"});
    }
    }
];

export const adminOnly = (req, res, next) => {
    if(req.user) {
        return res.status(401).json({message:"Unauthorized - user not found"});
    }
if(req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({message:"Forbidden - admin access only"});
}
next()
}

