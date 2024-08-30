import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./UserProfile.css";
import { StoreContext } from "../../context/StoreContext";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url } = useContext(StoreContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/api/user/${userId}`);
        setUser(response.data);
        // console.log(`Avatar URL: ${url}/api/user/uploads/${user.avatar}`);
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-profile">
      <nav className="profile-nav">
        <ul>
          <li>
            <Link to={`/update-profile/${user._id}`} className="nav-link">
              Thay đổi thông tin
            </Link>
          </li>
          <li>
            <Link to="/address" className="nav-link">
              Địa chỉ
            </Link>
          </li>
          <li>
            <Link to="/change-password" className="nav-link">
              Đổi mật khẩu
            </Link>
          </li>
          <li>
            <Link to="/my-orders" className="nav-link">
              Lịch sử đơn hàng
            </Link>
          </li>
        </ul>
      </nav>
      <div className="profile-info">
        {user ? (
          <>
            <img
              src={`${url}/${user.avatar}`}
              alt="User Avatar"
              className="avatar"
            />
            <div className="info-details">
              <h1>{user.name}</h1>
              <p>Email: {user.email}</p>
              <p>Số điện thoại: {user.phone}</p>
              <p>
                Trạng thái:{" "}
                {user.active === true ? (
                  <span className={`status ${user.active}`}>Hoạt động</span>
                ) : (
                  <span className={`status ${user.active}`}>
                    Không hoạt đông
                  </span>
                )}
              </p>
            </div>
          </>
        ) : (
          <p>No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
