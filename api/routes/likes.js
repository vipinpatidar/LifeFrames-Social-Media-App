import express from "express";
import {
  deleteLike,
  getLikesOfPost,
  postAddLike,
} from "../controllers/likes.js";
import { isAuthenticated } from "../middleware/isAuth.js";

export const likesRoutes = express.Router();

likesRoutes.get("/get", isAuthenticated, getLikesOfPost);

likesRoutes.post("/add", isAuthenticated, postAddLike);

likesRoutes.delete("/remove", isAuthenticated, deleteLike);
