import React, { useState, useCallback, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import "./ReviewForm.css";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { url } = useContext(StoreContext);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để gửi đánh giá.");
        return;
      }
      try {
        const response = await axios.post(
          `${url}/api/review/review-product`,
          {
            productId,
            rating,
            comment,
          },
          {
            headers: {
              token,
            },
          }
        );

        if (response.data.success) {
          toast.success("Đánh giá của bạn đã được gửi thành công!");
          onReviewAdded(response.data.review);
          setRating(5);
          setComment("");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại."
        );
      }
    },
    [url, productId, rating, comment, onReviewAdded]
  );

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Đánh giá sản phẩm</h3>
      <div className="form-group">
        <div className="rating-selection">
          {[1, 2, 3, 4, 5].map((num) => (
            <FaStar
              key={num}
              className={`star-icon ${
                num <= rating ? "star-filled" : "star-empty"
              }`}
              onClick={() => setRating(num)}
            />
          ))}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="comment">Nhận xét: </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit-button">
        Gửi đánh giá
      </button>
    </form>
  );
};

export default React.memo(ReviewForm);
