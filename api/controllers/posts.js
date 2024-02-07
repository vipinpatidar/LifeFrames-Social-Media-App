import { db } from "../db/connect.js";
import moment from "moment";

export const getPosts = async (req, res, next) => {
  try {
    const openProfileId = req.query.openProfileId;

    const userId = req.userId;
    //  console.log(userId);

    // AS userId because post also have id field in an object can not be to id
    let selectPostsQuery;
    const values = [];

    //Yup undefined is coming as string
    if (openProfileId !== "undefined") {
      selectPostsQuery = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`;
      values.push(openProfileId);
    } else {
      // here follower userId is for Current user or logged in user
      // followed userId for whom logged in user follows
      selectPostsQuery = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =? ORDER BY p.createdAt DESC`;
      values.push(userId, userId);
    }

    const posts = await db.query(selectPostsQuery, values);

    // console.log(posts);

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const postAddNewPost = (req, res) => {
  try {
    const description = req.body.description;
    const userId = req.userId;
    const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    const image = req.body.image;

    // console.log(description, userId, createdAt);
    // console.log(image);

    const insertQuery =
      "INSERT INTO posts (description, image, userId, createdAt) VALUES (?, ?, ?, ?)";

    db.query(insertQuery, [description, image, userId, createdAt]);

    res.status(200).json("Post created successfully!");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const deleteQuery = "DELETE FROM posts WHERE userId= ? AND id= ?";

    const deletePost = await db.query(deleteQuery, [userId, postId]);

    if (deletePost.affectedRows > 0) {
      return res.status(200).json("Post deleted successfully!");
    } else {
      return res.status(403).json("You are not allowed to delete");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
