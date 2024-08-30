import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetail.css";
import ReviewSection from "../../components/ReviewSection/ReviewSection";
import { FaStar } from "react-icons/fa";
// import ReviewForm from "../../components/ReviewForm/ReviewForm";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const { id } = useParams();
  const { url, addToCart, favorites, addToFavorites, removeFromFavorites } =
    useContext(StoreContext);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/product/detail/${id}`);
      if (response.data.success) {
        setProduct(response.data.product);
        setIsLiked(
          favorites.some((fav) => fav._id === response.data.product._id)
        );
      } else {
        setError("Lấy thông tin sản phẩm thất bại");
      }
    } catch (error) {
      setError("Lỗi khi lấy thông tin sản phẩm: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [id, url, favorites]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/review/review-list/${id}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
    }
  }, [id, url]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [fetchProduct, fetchReviews]);

  const handleReviewAdded = useCallback((newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
    setProduct((prevProduct) => {
      const newNumberOfReviews = prevProduct.numberOfReviews + 1;
      const newAverageRating =
        (prevProduct.averageRating * prevProduct.numberOfReviews +
          newReview.rating) /
        newNumberOfReviews;
      return {
        ...prevProduct,
        averageRating: newAverageRating,
        numberOfReviews: newNumberOfReviews,
      };
    });
  }, []);

  const handleBuyNow = useCallback(() => {
    if (window.confirm("Bạn có muốn mua sản phẩm này?")) {
      addToCart(product._id);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
    }
  }, [product, addToCart]);

  const handleCallNow = useCallback(() => {
    if (window.confirm("Bạn có muốn mua sản phẩm này?")) {
      toast.success("Vui lòng liên hệ số hotline!");
    }
  });

  const handleFavorite = useCallback(() => {
    if (!isLiked) {
      addToFavorites(product);
      toast.success("Đã thêm vào danh sách yêu thích!");
    } else {
      removeFromFavorites(product._id);
      toast.info("Đã xóa khỏi danh sách yêu thích!");
    }
    setIsLiked((prev) => !prev);
  }, [isLiked, product, addToFavorites, removeFromFavorites]);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!product) return <div>Sản phẩm không tìm thấy</div>;

  return (
    <div className="product-detail">
      <div className="product-images">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {product.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={`${url}/images/${image.filename}`} alt={product.name} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <PriceDisplay product={product} formatPrice={formatPrice} />
        <div className="brand">
          <span>Thương hiệu:</span>
          <span style={{ fontWeight: "bold" }}>{product.brand}</span>
        </div>
        <RatingDisplay product={product} />
        <ProductDescription description={product.description} />
        <ProductSpecifications specifications={product.specifications} />
        <h2>Đánh giá của người dùng:</h2>
        <ReviewSection
          product={product}
          reviews={reviews}
          handleReviewAdded={handleReviewAdded}
        />
        <div className="actions">
          <button onClick={handleFavorite}>
            {isLiked ? "❤️" : "🤍"} Yêu thích
          </button>
          {product.status === 'Ngưng bán' ? <button onClick={handleCallNow}>Liên hệ</button> : <button onClick={handleBuyNow}>Mua ngay</button>}
        </div>
      </div>
    </div>
  );
};

const PriceDisplay = React.memo(({ product, formatPrice }) =>
  product.status === "Giảm giá" ? (
    <div>
      <p className="price">
        <span className="old-price">{formatPrice(product.price)}</span>
        <span className="discount">- {product.discountPercentage}%</span>
      </p>
      <p className="price">{formatPrice(product.salePrice)}</p>
    </div>
  ) : (
    <div>
      <p className="price">{formatPrice(product.price)}</p>
      {product.discountPercentage > 0 && (
        <p className="discount">- {product.discountPercentage}%</p>
      )}
    </div>
  )
);

const RatingDisplay = React.memo(({ product }) => {
  const { averageRating, numberOfReviews } = product;
  const formattedRating = averageRating ? averageRating.toFixed(1) : "0.0";

  return (
    <div className="rating">
      <div className="rating-info">
        <span className="rating-value">⭐ {formattedRating}</span>
        <span className="review-count">({numberOfReviews || 0} đánh giá)</span>
      </div>
    </div>
  );
});

const ProductDescription = React.memo(({ description }) => (
  <>
    <h2>Mô tả sản phẩm:</h2>
    <p>{description}</p>
  </>
));

const ProductSpecifications = React.memo(({ specifications }) => (
  <>
    <h2>Thông số kỹ thuật:</h2>
    {specifications && (
      <ul>
        <li>Dung lượng RAM: {specifications.ram}</li>
        <li>Bộ nhớ trong: {specifications.rom}</li>
        <li>Card đồ họa: {specifications.card}</li>
        <li>Chip: {specifications.chip}</li>
        <li>Độ phân giải màn hình: {specifications.display}</li>
        <li>Pin: {specifications.pin}</li>
        <li>Kích thước màn hình: {specifications.display_size} Inchs</li>
        <li>Hệ điều hành: {specifications.operating_system}</li>
        <li>Camera: {specifications.camera}</li>
      </ul>
    )}
  </>
));

export default ProductDetail;
