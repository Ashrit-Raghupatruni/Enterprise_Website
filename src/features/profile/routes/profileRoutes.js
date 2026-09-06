import express from "express";
import { requireLogin, requireUser } from "../../../middleware/jwtmiddleware.js";
import { ProfileController } from "../controllers/profileController.js";

const router = express.Router();
const profileController = new ProfileController();

// User-only profile and address management endpoints
router.get('/profile', requireLogin, requireUser, profileController.getProfile.bind(profileController));
router.post('/profile', requireLogin, requireUser, profileController.updateProfile.bind(profileController));
router.post('/profile/address', requireLogin, requireUser, profileController.address.bind(profileController));
router.get('/profile/addresses', requireLogin, requireUser, profileController.getAddresses.bind(profileController));

export default router;