import { Router } from "express";
import { upload } from "../utils/multer.utils.js";
import { generateGif } from "../controllers/image.controller.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/generate-gif")
  .post(authMiddleWare, upload.single("image"), generateGif);

export { router };
