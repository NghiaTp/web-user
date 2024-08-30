import CategoriesModel from "../models/CategoriesModel.js";
import ImagesModel from "../models/ImagesModel.js";
import ProductModel from "../models/ProductModel.js";
import ProductDetailModel from "../models/ProductDetailModel.js";
import fs from "fs";
import mongoose from "mongoose";
import BrandModel from "../models/BrandModel.js";

const addProduct = async (req, res) => {
  const images = req.files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
  }));

  try {
    const category = await CategoriesModel.findById(req.body.category);
    if (!category) {
      return res.json({ success: false, message: "Không tìm thấy danh mục" });
    }

    const brand = await BrandModel.findById(req.body.brand);
    if(!brand){
      return res.json({ success: false, message: "Không tìm thấy thương hiệu" });
    }

    const product = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: category.name,
      brand: brand.name,
    });

    await product.save();

    const savedImages = await Promise.all(
      images.map(async (image) => {
        return ImagesModel.create({
          filename: image.filename,
          originalName: image.originalName,
          productId: product._id,
        });
      })
    );

    product.images = savedImages.map((image) => ({
      filename: image.filename,
      originalName: image.originalName,
    }));
    await product.save();

    const productDetail = new ProductDetailModel({
      productId: product._id,
      ram: req.body.ram,
      rom: req.body.rom,
      card: req.body.card,
      chip: req.body.chip,
      display: req.body.display,
      pin: req.body.pin,
      display_size: req.body.display_size,
      operating_system: req.body.operating_system,
      camera: req.body.camera,
    });

    await productDetail.save();

    product.specifications = productDetail._id;
    await product.save();

    res.json({
      success: true,
      message: "Thêm sản phẩm mới thành công",
      product: product,
      images: savedImages,
    });
  } catch (error) {
    console.log("Error ->", error);
    res.json({ success: false, message: "Thêm sản phẩm mới thất bại" });
  }
};

const listProduct = async (req, res) => {
  try {
    const products = await ProductModel.find({});

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await ImagesModel.find({ productId: product._id });

        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          images: images.map((image) => ({
            filename: image.filename,
            originalName: image.originalName,
          })),
          status: product.status,
          salePrice: product.salePrice,
          discountPercentage: product.discountPercentage
        };
      })
    );

    res.json({ success: true, data: productsWithImages });
  } catch (error) {
    console.log("Error -> ", error);
    res.json({ success: false, message: "List Product Error" });
  }
};

const delProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.body.id);
    if (!product) {
      return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    const images = await ImagesModel.find({ productId: product._id });

    // Xóa các file hình ảnh từ hệ thống file system
    images.forEach((image) => {
      fs.unlink(`uploads/${image.filename}`, (err) => {
        if (err) {
          console.log("Error deleting image:", err);
        }
      });
    });

    if (product.specifications) {
      await ProductDetailModel.findByIdAndDelete(product.specifications);
    }

    await ProductModel.findOneAndDelete({ _id: req.body.id });

    // Xóa các hình ảnh từ ImagesModel
    await ImagesModel.deleteMany({ productId: product._id });

    res.json({ success: true, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.log("Error --> ", error);
    res.json({ success: false, message: "Xóa sản phẩm thất bại" });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID sản phẩm không hợp lệ" });
    }

    const product = await ProductModel.findById(productId)
      .populate("specifications")
      .populate("images");

    if (!product) {
      return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    res.json({
      success: true,
      product: {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        images: product.images.map((image) => ({
          filename: image.filename,
          originalName: image.originalName,
        })),
        specifications: {
          ram: product.specifications.ram,
          rom: product.specifications.rom,
          card: product.specifications.card,
          chip: product.specifications.chip,
          display: product.specifications.display,
          pin: product.specifications.pin,
          display_size: product.specifications.display_size,
          operating_system: product.specifications.operating_system,
          camera: product.specifications.camera,
        },
        status: product.status,
        salePrice: product.salePrice,
        discountPercentage: product.discountPercentage,
        averageRating: product.averageRating,
        numberOfReviews: product.numberOfReviews
      },
    });
  } catch (error) {
    console.log("Error ->", error);
    res.json({ success: false, message: "Lỗi khi lấy thông tin sản phẩm" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "ID sản phẩm không hợp lệ" });
    }

    const {
      name,
      description,
      price,
      category,
      brand,
      ram,
      rom,
      card,
      chip,
      display,
      pin,
      display_size,
      operating_system,
      camera,
      imagesToDelete = [],
      status,
      discountPercentage,
    } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.status = status || product.status;

    if (status === "Giảm giá" && discountPercentage != null) {
      product.salePrice = price * (1 - discountPercentage / 100);
      product.discountPercentage = discountPercentage;
    } else {
      product.salePrice = null; 
      product.discountPercentage = 0;
    }

    if (req.files) {
      if (imagesToDelete.length > 0) {
        const imagesToDeleteFromDb = await ImagesModel.find({
          _id: { $in: imagesToDelete },
        });

        imagesToDeleteFromDb.forEach((image) => {
          fs.unlink(`uploads/${image.filename}`, (err) => {
            if (err) {
              console.log("Error deleting image:", err);
            }
          });
        });

        await ImagesModel.deleteMany({ _id: { $in: imagesToDelete } });
      }

      const imagesToSave = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        productId: product._id,
      }));

      const savedImages = await Promise.all(
        imagesToSave.map(async (image) => {
          return ImagesModel.create({
            filename: image.filename,
            originalName: image.originalName,
            productId: product._id,
          });
        })
      );

      product.images = [
        ...product.images,
        ...savedImages.map((image) => ({
          filename: image.filename,
          originalName: image.originalName,
        })),
      ];
    }

    let productDetail = await ProductDetailModel.findOne({
      productId: product._id,
    });
    if (!productDetail) {
      productDetail = new ProductDetailModel({
        productId: product._id,
        ram,
        rom,
        card,
        chip,
        display,
        pin,
        display_size,
        operating_system,
        camera,
      });
    } else {
      productDetail.ram = ram || productDetail.ram;
      productDetail.rom = rom || productDetail.rom;
      productDetail.card = card || productDetail.card;
      productDetail.chip = chip || productDetail.chip;
      productDetail.display = display || productDetail.display;
      productDetail.pin = pin || productDetail.pin;
      productDetail.display_size = display_size || productDetail.display_size;
      productDetail.operating_system =
        operating_system || productDetail.operating_system;
      productDetail.camera = camera || productDetail.camera;
    }

    await productDetail.save();
    product.specifications = productDetail._id;

    await product.save();

    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      product: product,
    });
  } catch (error) {
    console.error("Error ->", error);
    res
      .status(500)
      .json({ success: false, message: "Cập nhật sản phẩm thất bại" });
  }
};


const listProductsByStatus = async (req, res) => {
  try {
    const { status } = req.query; 
    if (!["Giảm giá", "Còn bán", "Ngưng bán"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const products = await ProductModel.find({ status });

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await ImagesModel.find({ productId: product._id });

        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          images: images.map((image) => ({
            filename: image.filename,
            originalName: image.originalName,
          })),
          salePrice: product.salePrice,
          discountPercentage: product.discountPercentage
        };
      })
    );
    res.json({ success: true, data: productsWithImages });
  } catch (error) {
    console.log("Error -> ", error);
    res.json({ success: false, message: "List Product Error" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { search, category, brand } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }

    const products = await ProductModel.find(query).limit(5);

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await ImagesModel.find({ productId: product._id });

        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          images: images.map((image) => ({
            filename: image.filename,
            originalName: image.originalName,
          })),
          status: product.status,
          salePrice: product.salePrice,
          discountPercentage: product.discountPercentage
        };
      })
    );

    res.json({ success: true, data: productsWithImages });
  } catch (error) {
    console.log("Error -> ", error);
    res.status(500).json({ success: false, message: "Search Products Error" });
  }
};

const listProductsByBrand = async (req, res) => {
  try {
    const { brand } = req.query;
    if (!['Apple', 'Samsung'].includes(brand)) {
      return res.status(400).json({ success: false, message: "Hãng không hợp lệ" });
    }

    const products = await ProductModel.find({ brand });

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await ImagesModel.find({ productId: product._id });
        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          images: images.map((image) => ({
            filename: image.filename,
            originalName: image.originalName,
          })),
          status: product.status,
          salePrice: product.salePrice,
          discountPercentage: product.discountPercentage
        };
      })
    );

    res.json({ success: true, data: productsWithImages });
  } catch (error) {
    console.log("Error -> ", error);
    res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách sản phẩm theo hãng" });
  }
};

const listProductsSortedByPrice = async (req, res) => {
  try {
    const { sort } = req.query;
    if (!['asc', 'desc'].includes(sort)) {
      return res.status(400).json({ success: false, message: "Tham số sắp xếp không hợp lệ" });
    }

    const sortOrder = sort === 'asc' ? 1 : -1;
    const products = await ProductModel.find().sort({ price: sortOrder });

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await ImagesModel.find({ productId: product._id });
        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          images: images.map((image) => ({
            filename: image.filename,
            originalName: image.originalName,
          })),
          status: product.status,
          salePrice: product.salePrice,
          discountPercentage: product.discountPercentage
        };
      })
    );

    res.json({ success: true, data: productsWithImages });
  } catch (error) {
    console.log("Error -> ", error);
    res.status(500).json({ success: false, message: "Lỗi khi sắp xếp sản phẩm theo giá" });
  }
};

const listProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ success: false, message: "Vui lòng cung cấp category" });
    }

    const products = await ProductModel.find({ category });

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await ImagesModel.find({ productId: product._id });
        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          images: images.map((image) => ({
            filename: image.filename,
            originalName: image.originalName,
          })),
          status: product.status,
          salePrice: product.salePrice,
          discountPercentage: product.discountPercentage
        };
      })
    );

    res.json({ success: true, data: productsWithImages });
  } catch (error) {
    console.log("Error -> ", error);
    res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách sản phẩm theo category" });
  }
};


export {
  addProduct,
  listProduct,
  delProduct,
  getProductById,
  updateProduct,
  listProductsByStatus,
  searchProducts,
  listProductsByBrand,
  listProductsSortedByPrice,
  listProductsByCategory
};
