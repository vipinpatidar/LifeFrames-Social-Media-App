import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/connect.js";

export const postRegister = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const name = req.body.name;

    //Check if username is already registered
    const selectQuery = "SELECT * FROM users WHERE username = ?";

    const [data] = await db.query(selectQuery, [username]);

    // console.log(data.username);

    if (data) {
      return res.status(404).json({
        error: "Username already exists! Please use another username.",
      });
    }

    //If username is not exist CREATE USER
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery =
      "INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)";

    await db.query(insertQuery, [username, email, hashedPassword, name]);

    res.status(200).json("User created successfully");
  } catch (error) {
    // console.log(error);
    res.status(404).json({ error: error.message });
  }
};

export const postLogin = async (req, res) => {
  try {
    const username = req.body.username;
    const passwordF = req.body.password;

    // Check if username is not exist
    const selectQuery = "SELECT * FROM users WHERE username = ?";
    const [user] = await db.query(selectQuery, [username]);

    if (!user) {
      return res.status(409).json({
        error:
          "User not found! Please Create a account or use correct username.",
      });
    }

    const doMatch = await bcrypt.compare(passwordF, user.password);

    if (!doMatch) {
      return res.status(409).json({
        error: "Password mismatch! Please enter correct password.",
      });
    }

    // console.log(user);

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      process.env.SECRET_KEY
    );
    // Remove password take other properties
    const { password, ...otherProp } = user;

    res
      .cookie("accessToken", token)
      .status(200)
      .json({ message: "Successfully logged in", user: otherProp });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const postLogout = async (req, res) => {
  try {
    res
      .clearCookie("accessToken", {
        secure: true,
        sameSite: "none",
      })
      .json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const putChangePassword = async (req, res) => {
  try {
    const email = req.body.email;
    const passwordF = req.body.password;

    // Check if username is not exist
    const selectQuery = "SELECT * FROM users WHERE email = ?";
    const [user] = await db.query(selectQuery, [email]);

    if (!user) {
      return res.status(409).json({
        error: "User not found! Please enter correct email.",
      });
    }
    const hashedPassword = await bcrypt.hash(passwordF, 10);

    const updateQuery = "UPDATE users SET password = ? WHERE email = ?";

    await db.query(updateQuery, [hashedPassword, email]);

    res.status(200).json("User created successfully");
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
