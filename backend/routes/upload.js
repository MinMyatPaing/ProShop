import express from "express";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename(req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/\-/g, "").replace(/\:/g, "") +
        file.originalname
    );
  },
});

const checkFileType = (file, cb) => {
  const fileTypes = /jpg|jpeg|png/;
  const isImageFile = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isCorrectMime = fileTypes.test(file.mimetype);

  if (isImageFile && isCorrectMime) {
    cb(null, true);
  } else {
    cb("Image Files Only!");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  const currentPathArray = req.file.path.split("uploads");
  const imageUrl = `uploads${currentPathArray[1]}`.replace("\\", "/");
  res.send(imageUrl);
});

export default router;
