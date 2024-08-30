import CategoriesModel from "../models/CategoriesModel.js";

const listCategory = async (req, res) => {
  try {
    const categories = await CategoriesModel.find({});
    const categoriesWithFormattedImages = categories.map(category => ({
      ...category._doc,
      image: category.image.replace('\\', '/')
    }));
    res.json({ success: true, data: categoriesWithFormattedImages });
  } catch (error) {
    console.error("Error ->", error);
    res.json({ success: false, message: "Lỗi khi lấy danh mục" });
  }
};

const addNewCategory = async (req, res) => {
  const {name} = req.body;
  const image = req.file ? req.file.path.replace('\\', '/') : null;

  try {
    const categories = await CategoriesModel.findOne({ name });
    if (categories) {
      return res.status(400).json({
        success: false,
        message: "Danh mục này đã tồn tại",
      });
    }
    const newCategory = new CategoriesModel({ name, image });
    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Thêm danh mục mới thất bại' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await CategoriesModel.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Danh mục không tồn tại" });
    }
    
    res.json({ success: true, message: "Danh mục đã được xóa thành công" });
  } catch (error) {
    console.error("Error ->", error);
    res.status(500).json({ success: false, message: "Lỗi khi xóa danh mục" });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const image = req.file ? req.file.path.replace('\\', '/') : null;

  try {
    const updatedCategory = await CategoriesModel.findByIdAndUpdate(
      id,
      { name, image },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Danh mục không tồn tại" });
    }

    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error("Error ->", error);
    res.status(500).json({ success: false, message: "Lỗi khi chỉnh sửa danh mục" });
  }
};

export { listCategory, addNewCategory, updateCategory, deleteCategory};
