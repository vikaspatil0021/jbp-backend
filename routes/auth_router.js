import express from "express";

import { register, verify_email, login, logout, verify_session } from "../controllers/auth_controller.js";

const auth_router = express.Router();


auth_router.post("/register", register);
auth_router.post("/login", login);
auth_router.post("/verify_email", verify_email);
auth_router.post("/logout", logout);
auth_router.get("/verify_session", verify_session);


export default auth_router; 