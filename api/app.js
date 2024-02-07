import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";

//Routes
import { authRoutes } from "./routes/auth.js";
import { commentsRoutes } from "./routes/comments.js";
import { likesRoutes } from "./routes/likes.js";
import { postsRoutes } from "./routes/posts.js";
import { usersRoutes } from "./routes/users.js";
import { relationsRoutes } from "./routes/relationship.js";
import { storiesRoutes } from "./routes/stories.js";
import { cleanUnUploadedImage } from "./utils/clearImages.js";
//Dotenv configuration

const app = express();
const port = process.env.PORT || 8080;
export const __dirname = dirname(fileURLToPath(import.meta.url));

//Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const suffix = Date.now();
    cb(null, suffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

//Middleware

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

//MULTER
const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post("/api/upload", upload.single("postImg"), (req, res, next) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

//ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/relations", relationsRoutes);
app.use("/api/stories", storiesRoutes);

// cleanUnUploadedImage();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
