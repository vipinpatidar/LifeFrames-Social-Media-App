import { db } from "../db/connect.js";
import { __dirname } from "../app.js";
import fs from "fs";

export const cleanUnUploadedImage = async () => {
  try {
    const selectQuery =
      "SELECT u.coverPic, u.profilePic, p.image, s.image AS storyImg FROM users AS u JOIN posts AS p ON (u.id = p.userId) LEFT JOIN stories AS s ON (u.id = s.userId)";

    const images = await db.query(selectQuery);
    const folderPath = __dirname + "/uploads";
    let uploadedImagesArr;

    const imgArr = [];
    images.map((img) => {
      for (let key in img) {
        imgArr.push(img[key]);
      }
    });

    const imageInDB = [...new Set(imgArr)].filter(
      (img) => img !== null && img !== ""
    );

    //! GETTING uploaded images
    function getUploadImages() {
      return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err, files) => {
          if (err) {
            reject(err);
          } else {
            resolve(files);
          }
        });
      });
    }

    uploadedImagesArr = await getUploadImages();

    const filteredUnwantedImages = uploadedImagesArr
      .filter((img) => !imageInDB.includes(img))
      .map((img) => {
        return `${__dirname}/uploads/${img}`;
      });

    //  console.log(filteredUnwantedImages);

    filteredUnwantedImages.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}: ${err.message}`);
        } else {
          console.log(`Deleted file: ${filePath}`);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};
