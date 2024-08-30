import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./ReviewSection.css";
import ReviewForm from "../../components/ReviewForm/ReviewForm";

const ReviewSection = React.memo(({ product, reviews, handleReviewAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleShowAllReviews = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const limitedReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`star-icon ${
          index < Math.round(rating) ? "star-filled" : "star-empty"
        }`}
      />
    ));
  };

  return (
    <div className="reviews-section">
      <div className="reviews-list">
        {limitedReviews.length > 0 ? (
          limitedReviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-rating">{renderStars(review.rating)}</div>
              <p>Nhận xét: {review.comment}</p>
              <p>Bởi: {review.user.name}</p>
              <p className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào.</p>
        )}
      </div>
      {!showAllReviews && reviews.length > 5 && (
        <button
          className="show-more-btn"
          onClick={() => setShowAllReviews(true)}
        >
          Xem thêm
        </button>
      )}
      <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Tất cả Đánh giá</h2>
              <span className="modal-close" onClick={handleCloseModal}>
                &times;
              </span>
            </div>
            <div className="modal-body">
              {reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <p>Nhận xét: {review.comment}</p>
                  <p>Bởi: {review.user.name}</p>
                  <p className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="show-more-btn" onClick={handleCloseModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ReviewSection;
