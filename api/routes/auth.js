import express from "express";
import {
  postLogin,
  postRegister,
  postLogout,
  putChangePassword,
} from "../controllers/auth.js";

export const authRoutes = express.Router();

authRoutes.post("/login", postLogin);
authRoutes.put("/changePassword", putChangePassword);
authRoutes.post("/register", postRegister);
authRoutes.post("/logout", postLogout);
