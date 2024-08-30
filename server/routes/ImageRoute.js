// productRoutes.js

import express from 'express';
import ImagesModel from '../models/ImagesModel.js';

const router = express.Router();

// Route để lấy danh sách hình ảnh theo ID sản phẩm
router.get('/product/images/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const images = await ImagesModel.find({ productId });

    if (!images) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hình ảnh' });
    }

    res.status(200).json({ success: true, data: images });
  } catch (error) {
    console.error('Error fetching images by product ID:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy hình ảnh' });
  }
});

export default router;
