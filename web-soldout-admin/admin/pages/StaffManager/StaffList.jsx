import React, { useCallback, useEffect, useState } from "react";
import "./StaffList.css";
import axios from "axios";
import { toast } from "react-toastify";

const StaffList = ({ url }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/staff-manager/staff-list`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setList(response.data.data);
        setFilteredList(response.data.data); // Initialize the filtered list
      } else {
        toast.error("Tải danh sách nhân viên thất bại!");
      }
    } catch (error) {
      console.error("Fetch list error:", error);
      toast.error("Đã xảy ra lỗi khi tải danh sách nhân viên!");
    }
  }, [url]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = list.filter((item) =>
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(list);
    }
  }, [searchQuery, list]);

  const changeStatus = async (staffId) => {
    try {
      const response = await axios.put(
        `${url}/api/staff-manager/${staffId}/staff-status`
      );
      if (response.data.message === "Staff status updated") {
        toast.success("Thay đổi trạng thái nhân viên thành công!");
        fetchList();
      } else {
        throw new Error("Thay đổi trạng thái nhân viên thất bại!");
      }
    } catch (error) {
      console.error("Lỗi thay đổi trạng thái nhân viên:", error);
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/register`, {
        ...newStaff,
        role: "staff",
      });
      if (response.data.success) {
        toast.success("Đăng ký nhân viên mới thành công!");
        setNewStaff({
          name: "",
          email: "",
          password: "",
        });
        fetchList(); // Cập nhật danh sách sau khi đăng ký thành công
      } else {
        throw new Error(response.data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký nhân viên:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi đăng ký nhân viên!");
    }
  };

  return (
    <div className="list add flex-col">
      <p>Đăng ký nhân viên mới</p>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="name"
          value={newStaff.name}
          onChange={handleInputChange}
          placeholder="Họ và tên"
          required
        />
        <input
          type="email"
          name="email"
          value={newStaff.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={newStaff.password}
          onChange={handleInputChange}
          placeholder="Mật khẩu"
          required
        />
        <button type="submit">Đăng ký</button>
      </form>

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <p>Danh sách nhân viên</p>
      {filteredList.length > 0 ? (
        <table className="list-table">
          <thead>
            <tr className="list-table-format title">
              <th>Hình</th>
              <th>Tên</th>
              <th>Email</th>
              <th>SDT</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item) => (
              <tr key={item._id} className="list-table-format">
                <td className="img_container">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.address}</td>
                <td>{item.active ? "Hoạt động" : "Không hoạt động"}</td>
                <td>
                  <button onClick={() => changeStatus(item._id)}>
                    {item.active ? "Vô hiệu hóa" : "Kích hoạt"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có dữ liệu nhân viên.</p>
      )}
    </div>
  );
};

export default StaffList;
