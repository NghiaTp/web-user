import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  loginAdmin,
} from "../controllers/UserController.js";
import multer from "multer";

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/:userId", getUserProfile);
userRouter.put("/:userId", upload.single("avatar"), updateUserProfile);
userRouter.post("/admin/login", loginAdmin);

export default userRouter;
