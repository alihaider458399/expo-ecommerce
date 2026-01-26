import {Router} from 'express';
import {protectRoute} from "../middleware/auth.middleware.js";
import {
    addAddress,
    addToWishList,
    deleteAddress,
    getAllAddresses, getWishList, removeFromWishList,
    updateAddress
} from "../controllers/user.controller.js";

const router = Router();

router.use(protectRoute)
// address routes
router.post("/addresses",addAddress)
router.get("/addresses",getAllAddresses)
router.put("/addresses/:addressId",updateAddress)
router.delete("/addresses/:addressId",deleteAddress)

// wishlist routes
router.post("/wishlist",addToWishList)
router.get("/wishlist",getWishList)
router.delete("/wishlist/:productId",removeFromWishList)



export default router;