import { db } from "../db/connect.js";

export const getLikesOfPost = async (req, res, next) => {
  try {
    const postId = req.query.postId;

    const selectQuery = "SELECT userId FROM likes WHERE postId = ?";

    const userIds = await db.query(selectQuery, [postId]);
    const userIdArr = userIds.map((elem) => elem.userId);

    res.status(200).json(userIdArr);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const postAddLike = async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const userId = req.userId;

    const insertQuery = "INSERT INTO likes (userId, postId) VALUES (?,?)";

    await db.query(insertQuery, [userId, postId]);

    res.status(200).json("Liked Post");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteLike = async (req, res, next) => {
  try {
    const postId = req.query.postId;
    const userId = req.userId;

    //  console.log(postId);

    const deleteQuery = "DELETE FROM likes WHERE userId = ? AND postId = ?";

    await db.query(deleteQuery, [userId, postId]);

    res.status(200).json("Removed Like");
  } catch (error) {
    res.status(500).json(error);
  }
};
