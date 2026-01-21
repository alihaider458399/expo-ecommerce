import {Inngest} from "inngest";
import {connectDB} from "./db.js";
import {User} from "../models/user.model.js";

export const inngest = new Inngest({id:"ecommerce-app"})

const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event: "clerk/user.created"},
    async ({event}) => {
        await connectDB();
    const {id,email_addresses, first_name, last_name, image_url} = event.data;


    const newUser = {
        clerkId:id,
        email:email_addresses[0]?.email_address,
        first_name:`${first_name || ""} ${last_name || ""}` || "User",
        image_url:image_url,
        addresses:[],
        wishlist:[]
    }

    await User.create(newUser)
    }
)

// delete user
const deleteUserFromDB = inngest.createFunction(
    {id:"delete-user"},
    {event: "clerk/user.deleted"},
    async ({event}) => {
        await connectDB();
        const {id} = event.data;
        await User.deleteOne({clerkId:id})
    }
)

// update user
const updateUser = inngest.createFunction(
    {id:"update-user"},
    {event: "clerk/user.updated"},
    async ({event}) => {
        await connectDB();
        const {id,first_name, last_name, image_url} = event.data;
    await User.findOneAndUpdate({
        clerkId:id,
        first_name:`${first_name || ""} ${last_name || ""}` || "User",
        imageUrl:image_url || '',
    })
    }
)


export const functions = [syncUser,deleteUserFromDB,updateUser];

