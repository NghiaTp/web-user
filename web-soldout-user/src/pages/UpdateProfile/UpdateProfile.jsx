import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/api/user/${userId}`);
        setUser(response.data);
        setFormData({
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          avatar: response.data.avatar,
        });
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    if (file) {
      data.append("avatar", file);
    }

    try {
      await axios.put(`${url}/api/user/${userId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/profile/${userId}`);
    } catch (err) {
      setError("Cập nhật thông tin thất bại.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="update-profile">
      <h1>Cập nhật thông tin cá nhân</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Hình đại diện:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
          />
          {formData.avatar && (
            <img
              src={`${url}/${formData.avatar}`}
              alt="Avatar"
              className="avatar-preview"
            />
          )}
        </div>
        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
