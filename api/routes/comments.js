import express from "express";
import { getComments, postNewComment } from "../controllers/comments.js";
import { isAuthenticated } from "../middleware/isAuth.js";

export const commentsRoutes = express.Router();

commentsRoutes.get("/get", isAuthenticated, getComments);
commentsRoutes.post("/add", isAuthenticated, postNewComment);
