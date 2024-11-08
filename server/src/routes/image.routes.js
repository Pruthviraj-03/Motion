import { Router } from "express";
import { upload } from "../utils/multer.utils.js";
import { generateGif } from "../controllers/image.controller.js";

const router = Router();

router.route("/generate-gif").post(upload.single("image"), generateGif);

export { router };
