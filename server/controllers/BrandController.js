import BrandModel from "../models/BrandModel.js";

const listBrand = async(req,res) => {
    try {
        const brands = await BrandModel.find({});
    const brandsWithFormattedImages = brands.map(brand => ({
      ...brand._doc,
      image: brand.image.replace('\\', '/') 
    }));
        res.json({ success: true, data: brandsWithFormattedImages });
      } catch (error) {
        console.log(error);
        res.json({ success: true, message: "Tải danh sách thất bại" });
      }
}

const addNewBrand = async(req,res) => {
  const {name} = req.body;
  const image = req.file ? req.file.path.replace('\\', '/') : null; 

  try {
    const brands = await BrandModel.findOne({name});
    if(brands){
      return res.json({success: false, message: 'Tên thương hiệu đã tồn tại'})
    }
    const newBrand = new BrandModel({name, image});
    await newBrand.save();
    res.status(201).json({ success: true, data: newBrand });
  } catch (error) {
    console.log(error);
    res.json({success: false, message: 'Thêm thương hiệu thất bại vui lòng thử lại'})
  }
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await BrandModel.findById(id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Thương hiệu không tìm thấy' });
    }
    await BrandModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Xóa thương hiệu thành công' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Xóa thương hiệu thất bại, vui lòng thử lại' });
  }
};

const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const image = req.file ? req.file.path.replace('\\', '/') : null;

  try {
    // Tìm và cập nhật danh mục
    const updateBrands = await BrandModel.findByIdAndUpdate(
      id,
      { name, image },
      { new: true, runValidators: true }
    );

    if (!updateBrands) {
      return res.status(404).json({ success: false, message: "Tên thương hiệu không tồn tại" });
    }

    res.json({ success: true, data: updateBrands });
  } catch (error) {
    console.error("Error ->", error);
    res.status(500).json({ success: false, message: "Lỗi khi chỉnh sửa tên thương hiệu" });
  }
};

export{listBrand, addNewBrand, deleteBrand, updateBrand}