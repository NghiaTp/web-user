import React, { useEffect, useState, useCallback } from "react";
import "./UserList.css";
import axios from "axios";
import { toast } from "react-toastify";

const UserList = ({ url }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/user-manager/user-list`);
      if (response.data.success && Array.isArray(response.data.data)) {
        console.log("Received user data:", response.data.data);
        setList(response.data.data);
        setFilteredList(response.data.data); // Initialize the filtered list
      } else {
        throw new Error("Unexpected data format received from server");
      }
    } catch (error) {
      console.error("Fetch list error:", error);
      setError("Đã xảy ra lỗi khi tải danh sách nhân viên!");
      toast.error("Đã xảy ra lỗi khi tải danh sách nhân viên!");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const changeStatus = async (userId) => {
    try {
      const response = await axios.put(
        `${url}/api/user-manager/${userId}/user-status`
      );
      if (response.data.message === "user status updated") {
        toast.success("Thay đổi trạng thái người dùng thành công!");
        fetchList();
      } else {
        throw new Error("Thay đổi trạng thái người dùng thất bại!");
      }
    } catch (error) {
      console.error("Change user status error:", error);
      toast.error(error.message);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const filtered = list.filter((item) =>
        item.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(list);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="list add flex-col">
      <h2>Danh sách Người dùng</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo email..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
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
                      src={`${url}/${item.avatar}`}
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
        <p>Không có dữ liệu người dùng.</p>
      )}
    </div>
  );
};

export default UserList;
