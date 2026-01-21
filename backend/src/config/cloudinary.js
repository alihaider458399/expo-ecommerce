import {v2 as cloudinary} from "cloudinary"

import { ENV } from "./env.js"


cloudinary.config({
    cloud_name:ENV.CLODINARY_CLOUD_NAME,
    api_key:ENV.CLODINARY_API_KEY,
    api_secret:ENV.CLODINARY_SECRET_API
})


export default cloudinary;         