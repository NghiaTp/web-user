import {  listCategory,addNewCategory, updateCategory, deleteCategory} from "../controllers/CategoriesController.js";
import { listBrand, addNewBrand, updateBrand, deleteBrand } from "../controllers/BrandController.js";
import express from "express";
import multer from "multer";

const categoriesRouter = express.Router();
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Định nghĩa routes
categoriesRouter.get("/categories-list", listCategory);
categoriesRouter.post( "/categories-add", upload.single("image"),addNewCategory);
categoriesRouter.put('/categories-update/:id', upload.single('image'), updateCategory);
categoriesRouter.delete('/categories-delete/:id', deleteCategory)
categoriesRouter.get("/brands-list", listBrand);
categoriesRouter.post( "/brands-add", upload.single("image"),addNewBrand);
categoriesRouter.put('/brands-update/:id', upload.single('image'), updateBrand);
categoriesRouter.delete('/brands-delete/:id', deleteBrand)



export default categoriesRouter;
