import React, { useEffect, useState } from "react";
import "./Add.css";
import axios from "axios";
import { toast } from "react-toastify";
import {
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Box,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const Add = ({ url }) => {
  const [images, setImages] = useState([]);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "Apple",
    ram: "",
    rom: "",
    card: "",
    chip: "",
    display: "",
    pin: "",
    display_size: "",
    operating_system: "",
    camera: "",
  });
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchBrand();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/categories/categories-list`);
      setCategories(response.data.data);
      if (response.data.data.length > 0) {
        setData((prevData) => ({
          ...prevData,
          category: response.data.data[0]._id,
        }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrand = async () => {
    try {
      const response = await axios.get(`${url}/api/categories/brands-list`);
      setBrand(response.data.data);
      if (response.data.data.length > 0) {
        setData((prevData) => ({
          ...prevData,
          brand: response.data.data[0]._id,
        }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("brand", data.brand);
    formData.append("ram", data.ram);
    formData.append("rom", data.rom);
    formData.append("card", data.card);
    formData.append("chip", data.chip);
    formData.append("display", data.display);
    formData.append("pin", data.pin);
    formData.append("display_size", data.display_size);
    formData.append("operating_system", data.operating_system);
    formData.append("camera", data.camera);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(`${url}/api/product/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "",
          brand: "",
          ram: "",
          rom: "",
          card: "",
          chip: "",
          display: "",
          pin: "",
          display_size: "",
          operating_system: "",
          camera: "",
        });
        setImages([]);
        toast.success("Thêm sản phẩm mới thành công!");
      } else {
        toast.error("Thêm sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Thêm sản phẩm thất bại! Vui lòng thử lại");
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmitHandler}>
        {/* Ảnh và upload */}
        <div className="img-side">
          <p className="upload-label">Tải ảnh sản phẩm</p>
          <Button
            size="small"
            color="secondary"
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            className="upload-button"
          >
            Upload file
            <input
              type="file"
              onChange={handleImageChange}
              id="image"
              multiple
              hidden
              required
            />
          </Button>
        </div>

        <div className="image-preview">
          {images.length > 0 ? (
            images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt=""
                className="image-upload"
              />
            ))
          ) : (
            <img
              src="path/to/default_image.png" // Replace with your default image path
              alt=""
              className="image-upload"
              style={{ display: "none" }}
            />
          )}
        </div>

        <Box sx={{ marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {/* Tên sản phẩm */}
              <TextField
                fullWidth
                name="name"
                label="Tên sản phẩm"
                onChange={onChangeHandler}
                value={data.name}
                placeholder="Nhập tên sản phẩm"
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Loại sản phẩm */}
              <TextField
                fullWidth
                name="category"
                value={data.category}
                onChange={onChangeHandler}
                select
                label="Loại sản phẩm"
                helperText="Vui lòng chọn loại sản phẩm"
                variant="outlined"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Hãng sản phẩm */}
              <TextField
                fullWidth
                name="brand"
                value={data.brand}
                onChange={onChangeHandler}
                select
                label="Hãng sản phẩm"
                helperText="Vui lòng chọn hãng sản phẩm"
                variant="outlined"
                required
              >
                {brand.map((brands) => (
                  <MenuItem key={brands._id} value={brands._id}>
                    {brands.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} md={4}>
              {/* Dung lượng RAM */}
              <TextField
                fullWidth
                name="ram"
                label="Dung lượng RAM"
                value={data.ram}
                onChange={onChangeHandler}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="rom"
                label="Bộ nhớ trong"
                value={data.rom}
                onChange={onChangeHandler}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="card"
                label="Card đồ họa"
                value={data.card}
                onChange={onChangeHandler}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="chip"
                label="Chip"
                value={data.chip}
                onChange={onChangeHandler}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="display"
                label="Màn hình"
                value={data.display}
                onChange={onChangeHandler}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="pin"
                label="Pin"
                value={data.pin}
                onChange={onChangeHandler}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="display_size"
                label="Kích thước màn hình"
                value={data.display_size}
                onChange={onChangeHandler}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="operating_system"
                label="Hệ điều hành"
                value={data.operating_system}
                onChange={onChangeHandler}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="camera"
                label="Camera"
                value={data.camera}
                onChange={onChangeHandler}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} md={6}>
              {/* Giá sản phẩm */}
              <TextField
                fullWidth
                name="price"
                label="Giá sản phẩm"
                type="number"
                value={data.price}
                onChange={onChangeHandler}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VNĐ</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              {/* Mô tả */}
              <TextField
                fullWidth
                name="description"
                label="Mô tả"
                variant="outlined"
                onChange={onChangeHandler}
                value={data.description}
                rows={3}
                multiline
                placeholder="Nhập mô tả sản phẩm"
              />
            </Grid>
          </Grid>

          {/* Nút thêm và reset */}
          <Box
            sx={{
              display: "flex",
              marginTop: 2,
              gap: 5,
              marginBottom: 5
            }}
          >
            <Button
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              startIcon={<AddCircleIcon />}
            >
              Thêm
            </Button>
            <Button
              size="large"
              color="error"
              startIcon={<RestartAltIcon />}
              onClick={() => {
                setData({
                  name: "",
                  description: "",
                  price: "",
                  category: "",
                  brand: "Apple",
                  ram: "",
                  rom: "",
                  card: "",
                  chip: "",
                  display: "",
                  pin: "",
                  display_size: "",
                  operating_system: "",
                  camera: "",
                });
                setImages([]);
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default Add;
