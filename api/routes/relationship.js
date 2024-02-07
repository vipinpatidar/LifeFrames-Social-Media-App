import express from "express";
import {
  getRelationships,
  postAddRelationships,
  deleteRelationships,
} from "../controllers/relationship.js";
import { isAuthenticated } from "../middleware/isAuth.js";

export const relationsRoutes = express.Router();

relationsRoutes.get("/get", isAuthenticated, getRelationships);

relationsRoutes.post("/add", isAuthenticated, postAddRelationships);

relationsRoutes.delete("/remove", isAuthenticated, deleteRelationships);
