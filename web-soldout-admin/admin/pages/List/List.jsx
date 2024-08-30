import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const statusOptions = ["Còn bán", "Ngưng bán", "Giảm giá"];
  const discountOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  const roundTo = (value, decimalPlaces) => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
  };
  
  const formatPrice = (price, decimalPlaces = 2) => {
    const roundedPrice = roundTo(price, decimalPlaces);
  
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(roundedPrice);
  };

  const calculateSalePrice = (price, discountPercentage) => {
    return price * (1 - discountPercentage / 100);
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/product/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Tải danh sách sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Fetch list error:", error);
      toast.error("Đã xảy ra lỗi khi tải danh sách sản phẩm!");
    }
  };

  const deleteProduct = async (productId) => {
    Swal.fire({
      title: "Xóa sản phẩm?",
      text: "Bạn có chắc xóa sản phẩm này khỏi danh sách?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${url}/api/product/delete`, {
            id: productId,
          });
          if (response.data.success) {
            toast.success("Xóa sản phẩm thành công!");
            await fetchList();
          } else {
            toast.error("Xóa sản phẩm thất bại!");
          }
        } catch (error) {
          console.error("Delete product error:", error);
          toast.error("Đã xảy ra lỗi khi xóa sản phẩm!");
        }
      }
    });
  };

  const fetchProductById = async (productId) => {
    try {
      const response = await axios.get(
        `${url}/api/product/detail/${productId}`
      );
      if (response.data.success) {
        return response.data.product;
      } else {
        toast.error("Không thể tải thông tin sản phẩm!");
      }
    } catch (error) {
      console.error("Fetch product by ID error:", error);
      toast.error("Đã xảy ra lỗi khi tải thông tin sản phẩm!");
    }
    return null;
  };

  const handleOpen = async (product) => {
    const fullProduct = await fetchProductById(product._id);
    if (fullProduct) {
      setFormData({
        name: fullProduct.name || "",
        description: fullProduct.description || "",
        price: fullProduct.price || "",
        category: fullProduct.category || "",
        brand: fullProduct.brand || "",
        status: fullProduct.status || "",
        discountPercentage: fullProduct.discountPercentage || 0,
        ...fullProduct.specifications,
        salePrice: fullProduct.salePrice || 0,
      });
      setImagePreviews(
        fullProduct.images.map((img) => `${url}/images/${img.filename}`)
      );
      setSelectedProduct(fullProduct);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setImagesToDelete([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };
  
      if (name === "status" && value !== "Giảm giá") {
        updatedData.discountPercentage = 0;
        updatedData.salePrice = null;
      } else if (name === "status" && value === "Giảm giá") {
        updatedData.discountPercentage = discountOptions[0];
        updatedData.salePrice = calculateSalePrice(
          prev.price,
          discountOptions[0]
        );
      } else if (name === "discountPercentage" || name === "price") {
        updatedData.salePrice = calculateSalePrice(
          updatedData.price,
          name === "discountPercentage" ? value : updatedData.discountPercentage
        );
      }
  
      return updatedData;
    });
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleImageDelete = (index) => {
    setImagesToDelete((prev) => [...prev, selectedProduct.images[index]._id]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      selectedImages.forEach((file) => {
        formDataToSend.append("images", file);
      });

      imagesToDelete.forEach((imageId) => {
        formDataToSend.append("imagesToDelete", imageId);
      });

      const response = await axios.put(
        `${url}/api/product/update/${selectedProduct._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật sản phẩm thành công!");
        await fetchList();
        handleClose();
      } else {
        toast.error("Cập nhật sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Update product error:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật sản phẩm!");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" p={2}>
      <Box width="100%" maxWidth="1200px">
        <Typography variant="h6" gutterBottom>
          Danh sách tất cả sản phẩm
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            sx={{ maxWidth: 500 }}
          />
        </Box>
        <TableContainer component={Paper} sx={{ padding: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Loại sản phẩm</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Giá khuyến mãi</TableCell>
                <TableCell>Hãng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredList.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {item.images && item.images.length > 0 && (
                      <img
                        src={`${url}/images/${item.images[0].filename}`}
                        alt={item.name}
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        textDecoration: item.salePrice
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {formatPrice(item.price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.salePrice && formatPrice(item.salePrice)}
                  </TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpen(item)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteProduct(item._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Tên sản phẩm"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Mô tả"
                name="description"
                multiline
                rows={4}
                value={formData.description || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Giá"
                name="price"
                type="number"
                value={formData.price || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Danh mục"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Thương hiệu"
                name="brand"
                value={formData.brand || ""}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formData.status === "Giảm giá" && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Phần trăm giảm giá</InputLabel>
                  <Select
                    name="discountPercentage"
                    value={formData.discountPercentage || ""}
                    onChange={handleChange}
                  >
                    {discountOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}%
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <TextField
                fullWidth
                margin="normal"
                label="Giá gốc"
                name="price"
                type="number"
                value={formData.price || ""}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                }}
              />
              {formData.status === "Giảm giá" && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Giá sau giảm"
                  name="salePrice"
                  type="number"
                  value={formData.salePrice || ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₫</InputAdornment>
                    ),
                    readOnly: true,
                  }}
                />
              )}
              <TextField
                fullWidth
                margin="normal"
                label="RAM"
                name="ram"
                value={formData.ram || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="ROM"
                name="rom"
                value={formData.rom || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Card đồ họa"
                name="card"
                value={formData.card || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Chip"
                name="chip"
                value={formData.chip || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Màn hình"
                name="display"
                value={formData.display || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Pin"
                name="pin"
                value={formData.pin || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Kích thước màn hình"
                name="display_size"
                value={formData.display_size || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Hệ điều hành"
                name="operating_system"
                value={formData.operating_system || ""}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Camera"
                name="camera"
                value={formData.camera || ""}
                onChange={handleChange}
              />
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                style={{ marginTop: 20 }}
              />
              <Box display="flex" flexWrap="wrap" mt={2}>
                {imagePreviews.map((preview, index) => (
                  <Box key={index} position="relative" m={1}>
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleImageDelete(index)}
                      style={{ position: "absolute", top: 0, right: 0 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleSubmit} color="primary">
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default List;
