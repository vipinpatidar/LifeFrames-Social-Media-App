import express from "express";
import { getAllUsers, getUser, putUpdateUser } from "../controllers/users.js";
import { isAuthenticated } from "../middleware/isAuth.js";

export const usersRoutes = express.Router();

usersRoutes.get("/all", isAuthenticated, getAllUsers);

usersRoutes.get("/find/:userId", isAuthenticated, getUser);
usersRoutes.put("/update", isAuthenticated, putUpdateUser);
