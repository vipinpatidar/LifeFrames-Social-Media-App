import { db } from "../db/connect.js";

export const getStories = async (req, res, next) => {
  try {
    const userId = req.userId;

    const selectQuery = `SELECT s.*, u.id AS userId, name FROM stories AS s JOIN users AS u ON (u.id = s.userId) LEFT JOIN relationships AS r ON (s.userId = r.followedUserId) WHERE r.followerUserId= ? OR s.userId =?`;

    const stories = await db.query(selectQuery, [userId, userId]);

    //  console.log(stories);

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getFindLoggedInUserStories = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const selectQuery = "SELECT * FROM stories WHERE userId = ?";

    const userStories = await db.query(selectQuery, [userId]);

    //  console.log(userStories);

    res.status(200).json(userStories);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const postStories = async (req, res, next) => {
  try {
    const image = req.body.image;
    const userId = req.userId;
    const insertQuery = "INSERT INTO stories (image, userId) VALUES (?,?)";

    await db.query(insertQuery, [image, userId]);

    res.status(200).json("Story added successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteStories = async (req, res, next) => {
  try {
    const storyId = req.params.storyId;
    const userId = req.userId;

    const deleteQuery = "DELETE FROM stories WHERE id = ? AND userId = ?";

    await db.query(deleteQuery, [storyId, userId]);

    res.status(200).json("Story deleted successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
};
