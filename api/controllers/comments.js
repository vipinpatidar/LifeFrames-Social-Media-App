import { db } from "../db/connect.js";
import moment from "moment";

export const getComments = async (req, res, next) => {
  try {
    const postId = req.query.postId;

    const selectQuery =
      "SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ? ORDER BY c.createdAt DESC";

    const comments = await db.query(selectQuery, [postId]);

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const postNewComment = async (req, res) => {
  try {
    const description = req.body.description;
    const userId = req.userId;
    const postId = req.body.postId;
    const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const insertQuery =
      "INSERT INTO comments (description, createdAt, userId, postId) VALUES (?, ?, ?, ?)";

    db.query(insertQuery, [description, createdAt, userId, postId]);

    res.status(200).json("comment added successfully!");
  } catch (error) {
    res.status(500).json(error);
  }
};
