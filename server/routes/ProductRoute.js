import express from 'express'
import { addProduct, delProduct, listProduct, getProductById, updateProduct, listProductsByStatus, searchProducts, listProductsByBrand, listProductsSortedByPrice, listProductsByCategory } from '../controllers/ProductController.js'
import multer from 'multer'

const productRouter = express.Router();


//Image Storage Engine

const storage = multer.diskStorage({
    destination: "uploads",
    filename:(req,file,cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage});

productRouter.post('/add', upload.array("images", 15),addProduct);
productRouter.get('/list', listProduct),
productRouter.post('/delete', delProduct)
productRouter.get('/detail/:id', getProductById)
productRouter.put('/update/:id', upload.array('images'), updateProduct),
productRouter.get('/status', listProductsByStatus)
productRouter.get('/search', searchProducts)
productRouter.get('/products/brand', listProductsByBrand);
productRouter.get('/products/sort', listProductsSortedByPrice);
productRouter.get('/products/category', listProductsByCategory);
export default productRouter;