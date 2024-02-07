import express from "express";
import { deletePost, getPosts, postAddNewPost } from "../controllers/posts.js";
//Authentication
import { isAuthenticated } from "../middleware/isAuth.js";

export const postsRoutes = express.Router();

postsRoutes.get("/get", isAuthenticated, getPosts);
postsRoutes.post("/add", isAuthenticated, postAddNewPost);
postsRoutes.delete("/delete/:postId", isAuthenticated, deletePost);
