import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Tab,
  Tabs,
  TableContainer,
  Grid,
  Button,
  FormControl,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import {
  PhotoCamera,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Alert } from "@mui/material";

const Category = ({ url }) => {
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("categories");
  const [newItem, setNewItem] = useState({
    name: "",
    image: null,
    imageUrl: "",
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          axios.get(`${url}/api/categories/categories-list`),
          axios.get(`${url}/api/categories/brands-list`),
        ]);
        if (selectedTab === "categories") {
          setData(categoriesResponse.data.data);
        } else {
          setData(brandsResponse.data.data);
        }
        setIsUpdated(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [selectedTab, isUpdated]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setNewItem((prev) => ({
          ...prev,
          image: file,
          imageUrl: URL.createObjectURL(file),
        }));
      } else {
        setNewItem((prev) => ({
          ...prev,
          image: null,
          imageUrl: "",
        }));
      }
    } else {
      setNewItem((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newItem.name || !newItem.image) {
      console.error("Tên và ảnh không được bỏ trống.");
      return;
    }
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("image", newItem.image);

    const postUrl =
      selectedTab === "categories"
        ? `${url}/api/categories/categories-add`
        : `${url}/api/categories/brands-add`;

    try {
      const response = await axios.post(postUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Item added:", response.data);
      setIsUpdated(true);
      setNewItem({
        name: "",
        image: null,
        imageUrl: "",
      });
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        "Error adding item",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDelete = async () => {
    const deleteUrl =
      selectedTab === "categories"
        ? `${url}/api/categories/categories-delete/${itemToDelete._id}`
        : `${url}/api/categories/brands-delete/${itemToDelete._id}`;

    try {
      await axios.delete(deleteUrl);
      setIsUpdated(true);
      setConfirmDelete(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setNewItem({
      name: item.name,
      image: null,
      imageUrl: item.image ? `${url}/${item.image}` : "",
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleUpdate = async () => {
    if (!selectedItem.name) {
      console.error("Tên không được bỏ trống.");
      return;
    }

    const formData = new FormData();
    formData.append("name", selectedItem.name);
    if (newItem.image) {
      formData.append("image", newItem.image);
    }

    const updateUrl =
      selectedTab === "categories"
        ? `${url}/api/categories/categories-update/${selectedItem._id}`
        : `${url}/api/categories/brands-update/${selectedItem._id}`;

    try {
      await axios.put(updateUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsUpdated(true);
      handleDialogClose();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating item", error);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setConfirmDelete(true);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  return (
    <Paper style={{ width: "100%", padding: "16px" }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Danh mục" value="categories" />
          <Tab label="Thương hiệu" value="brands" />
        </Tabs>
      </Grid>

      <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
        <Grid
          container
          spacing={1}
          alignItems="center"
          style={{ marginBottom: "16px" }}
        >
          <Grid item xs={12} sm={6} style={{ display: "flex" }}>
            <TextField
              name="name"
              label="Tên"
              fullWidth
              value={newItem.name}
              onChange={handleInputChange}
              style={{ marginRight: "10px" }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <FormControl
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                marginRight: "10px",
              }}
            >
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                name="image"
                onChange={handleInputChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  style={{ marginRight: "16px" }}
                >
                  Chọn Ảnh
                </Button>
              </label>
              {newItem.imageUrl && (
                <img
                  src={newItem.imageUrl}
                  alt="Selected"
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              )}
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              {selectedTab === "categories"
                ? "Thêm Danh Mục"
                : "Thêm Thương Hiệu"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <TableContainer style={{ width: "100%", marginTop: "16px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <img
                    src={`${url}/${item.image}`}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(item)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chỉnh sửa */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh Sửa Danh Mục</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Tên"
            fullWidth
            value={selectedItem?.name || ""}
            onChange={(e) =>
              setSelectedItem({ ...selectedItem, name: e.target.value })
            }
          />
          <FormControl style={{ marginTop: "16px" }}>
            <input
              accept="image/*"
              id="image-upload-dialog"
              type="file"
              name="image"
              onChange={handleInputChange}
              style={{ display: "none" }}
            />
            <label htmlFor="image-upload-dialog">
              <Button
                variant="outlined"
                component="span"
                style={{ marginRight: "16px" }}
              >
                Chọn Ảnh
              </Button>
            </label>
            {newItem.imageUrl && (
              <img
                src={newItem.imageUrl}
                alt="Selected"
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Cập Nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={confirmDelete}
        onClose={handleConfirmDeleteClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa mục này không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDeleteClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Thành công!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Category;
