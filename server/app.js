import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import("./src/utils/Passport.utils.js");

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

import { router as userRouter } from "./src/routes/user.routes.js";
import { router as imageRouter } from "./src/routes/image.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v2/images", imageRouter);

// http://localhost:8000/api/v1/users/google/callback

export { app };
