import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.registerUser);

router.patch("/update-fcm-token/:id", userController.updateMyProfileFcmTokenInDB);

export const userRoutes = router;
