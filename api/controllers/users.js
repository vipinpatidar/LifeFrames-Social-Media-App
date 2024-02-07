import { db } from "../db/connect.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const loggedInUserId = req.userId;

    const selectQuery = "SELECT * FROM users";

    const usersArr = await db.query(selectQuery);

    const otherUsers = usersArr.filter((user) => user.id !== loggedInUserId);

    // console.log(otherUsers);
    res.status(200).json(otherUsers);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const selectQuery = "SELECT * FROM users WHERE id = ?";

    const [user] = await db.query(selectQuery, [userId]);

    const { password, ...otherInfo } = user;

    // console.log(otherInfo);

    res.status(200).json(otherInfo);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const putUpdateUser = async (req, res) => {
  try {
    const name = req.body.name;
    const city = req.body.city;
    const website = req.body.website;
    const profilePic = req.body.profilePic;
    const coverPic = req.body.coverPic;
    const userId = req.userId;

    const updateQuery =
      "UPDATE users SET name = ?, city = ?, website = ?, profilePic = ?, coverPic = ? WHERE id =?";

    const update = await db.query(updateQuery, [
      name,
      city,
      website,
      profilePic,
      coverPic,
      userId,
    ]);

    if (update.affectedRows > 0) {
      return res.status(200).json("Updated user information");
    } else {
      return res.status(403).json("You cannot update this user");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
