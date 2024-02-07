import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      const error = new Error("Unauthenticated access");
      error.statusCode = 401;
      throw error;
    }

    const decodedToke = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToke) {
      const error = new Error("Invalid authorization");
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodedToke.userId;
    next();
  } catch (error) {
    res.status(401).json(error);
  }
};
