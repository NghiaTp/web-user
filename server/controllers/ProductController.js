import ProductModel from "../models/ProductModel.js";
import fs from 'fs';


//add product

const addProduct = async (req,res) => {
    let image_filename = `${req.file.filename}`;

    const product = new ProductModel({
        name:req.body.name,
        description:req.body.description,
        price: req.body.price,
        image: image_filename,
        category: req.body.category,
        brand: req.body.brand
    });

    try {
        await product.save();
        res.json({success:true, message:'Product Added'})
    } catch (error) {
        console.log("Error ->", error);
        res.json({success:false, message: 'Product Added Error'})
    }
}

// list product

const listProduct = async(req,res) => {
    try {
        const products = await ProductModel.find({});
        res.json({success: true, data:products})
    } catch (error) {
        console.log('Error -> ', error);
        res.json({success: false, message:'List Product Error'})
    }
}

//delete Product

const delProduct = async(req,res) => {
    try {
        const product = await ProductModel.findById(req.body.id);
        fs.unlink(`uploads/${product.image}`,()=>{});
        await ProductModel.findOneAndDelete({_id:req.body.id});
        res.json({success: true, mesaage: 'Delete success'})
    } catch (error) {
        console.log("Error --> ", error);
        res.json({success: false, mesaage: 'Delete failed'})
    }
}

export{addProduct, listProduct, delProduct} 