import { Router } from "express";
import {
  refreshAccessToken,
  userLogin,
  logoutUser,
} from "../controllers/user.controller.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import passport from "passport";
import("../utils/Passport.utils.js");
const router = Router();

router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.route("/google/callback").get(
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login",
  })
);

router.route("/login/success").get(authMiddleWare, userLogin);

router.route("/logout").get(authMiddleWare, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

export { router };
