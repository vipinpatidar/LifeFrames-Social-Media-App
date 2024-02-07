import express from "express";
import {
  getStories,
  postStories,
  deleteStories,
  getFindLoggedInUserStories,
} from "../controllers/stories.js";
//Authentication
import { isAuthenticated } from "../middleware/isAuth.js";

export const storiesRoutes = express.Router();

storiesRoutes.get("/get", isAuthenticated, getStories);

storiesRoutes.get("/find/:userId", isAuthenticated, getFindLoggedInUserStories);

storiesRoutes.post("/add", isAuthenticated, postStories);

storiesRoutes.delete("/delete/:storyId", isAuthenticated, deleteStories);
