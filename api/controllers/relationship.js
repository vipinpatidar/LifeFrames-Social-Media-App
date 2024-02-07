import { db } from "../db/connect.js";

export const getRelationships = async (req, res, next) => {
  try {
    const followedUserId = req.query.followedUserId;

    // here follower userId is for Current user or logged in user
    // followed userId for whom logged in user follows
    const selectQuery =
      "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    const relationsIds = await db.query(selectQuery, [followedUserId]);

    const followerUserIds = relationsIds.map(
      (relation) => relation.followerUserId
    );
    res.status(200).json(followerUserIds);
  } catch (error) {
    res.status(500).json(error);
  }
};

/* basically we are checking that when a logged in user clicked on a profile in url we get opened profile id (followedUserId)(/profile/19) 

so we are sending to client that when logged in user clicked on a profile who followed this opened profile or as we sending array of followerUserIds to client

then we check that logged is user in that array or not it is show following if not follow

*/

export const postAddRelationships = async (req, res, next) => {
  try {
    const followedUserId = req.body.followedUserId;
    const followerUserId = req.userId;

    const insertQuery =
      "INSERT INTO relationships (followerUserId, followedUserId) VALUES (?,?)";

    await db.query(insertQuery, [followerUserId, followedUserId]);

    res.status(200).json("Followed user successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteRelationships = async (req, res, next) => {
  try {
    const followedUserId = req.query.followedUserId;
    const followerUserId = req.userId;

    //  console.log(followedUserId);

    const deleteQuery =
      "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?";

    await db.query(deleteQuery, [followerUserId, followedUserId]);

    res.status(200).json("Removed Like");
  } catch (error) {
    res.status(500).json(error);
  }
};
