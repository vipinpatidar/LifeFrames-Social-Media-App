import mysql from "mysql";
import util from "util";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "socialapp",
  password: process.env.DATABASE_PASSWORD,
  charset: "utf8mb4",
});

// promise wrapper to enable async await with MYSQL
db.query = util.promisify(db.query).bind(db);
db.connect = util.promisify(db.connect).bind(db);

// connect to the database
// db.connect(function (err) {
//   if (err) {
//     console.log("error connecting: " + err.stack);
//     return;
//   }
//   console.log("connected as... " + db.threadId);
// });
