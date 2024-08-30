import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Address.css";

const Address = () => {
  const { url, token } = useContext(StoreContext);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    address: "",
    fullname: "",
    phone: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${url}/api/address/list`, {
          headers: {
            token,
          },
        });
        if (response.data.success) {
          setAddresses(response.data.data);          
        } else {
          console.log(response.data.message);
        }
      } catch (err) {
        setError("Không thể tải địa chỉ.");
        console.error(err);
      }
    };

    fetchAddresses();
  }, [url, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `${url}/api/address/update/${currentAddressId}`,
          formData,
          {
            headers: {
              token,
            },
          }
        );
      } else {
        await axios.post(`${url}/api/address/add`, formData, {
          headers: {
            token,
          },
        });
      }
      setFormData({ address: "", fullname: "", phone: "" });
      setEditMode(false);
      setCurrentAddressId(null);
      setShowForm(false);
      const response = await axios.get(`${url}/api/address/list`, {
        headers: {
          token,
        },
      });
      if (Array.isArray(response.data.data)) {
        setAddresses(response.data.data);
      }
    } catch (err) {
      setError("Cập nhật thông tin thất bại.");
      console.error(err);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      address: address.address || "",
      fullname: address.fullname || "",
      phone: address.phone || "",
    });
    setEditMode(true);
    setCurrentAddressId(address._id);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    try {
      await axios.delete(`${url}/api/address/${addressId}`, {
        headers: {
          token,
        },
      });
      setAddresses((prevAddresses) =>
        prevAddresses.filter((addr) => addr._id !== addressId)
      );
    } catch (err) {
      setError("Xóa địa chỉ thất bại.");
      console.error(err);
    }
  };

  return (
    <div className="address">
      <h1>Danh sách địa chỉ</h1>
      {error && <p className="error">{error}</p>}

      <button
        onClick={() => {
          setShowForm(true);
          setEditMode(false);
          setFormData({ address: "", fullname: "", phone: "" });
        }}
      >
        Thêm Địa chỉ
      </button>

      {showForm && (
        <div className="overlay">
          <div className="form-dialog">
            <h2>{editMode ? "Sửa Địa chỉ" : "Thêm Địa chỉ"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="fullname">Họ và tên:</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname || ""}
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
                  value={formData.phone || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">
                {editMode ? "Cập nhật" : "Thêm"} Địa chỉ
              </button>
              <button type="button" onClick={() => setShowForm(false)}>
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="address-list">
        {addresses.length > 0 ? (
          <ul>
            {addresses.map((address) => (
              <li key={address._id}>
                <div className="address-item">
                  <p>Địa chỉ: {address.address}</p>
                  <p>Họ và tên: {address.fullname}</p>
                  <p>Số điện thoại: {address.phone}</p>
                  <div className="button-group">
                    <button onClick={() => handleEdit(address)}>
                      Chỉnh sửa
                    </button>
                    <button onClick={() => handleDelete(address._id)}>
                      Xóa
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có địa chỉ nào.</p>
        )}
      </div>
    </div>
  );
};

export default Address;
