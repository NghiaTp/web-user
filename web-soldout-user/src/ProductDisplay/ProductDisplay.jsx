import React, { useContext, useEffect, useState } from "react";
import "./ProductDisplay.css";
import { StoreContext } from "../context/StoreContext";
import ProductItem from "../ProductItem/ProductItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { product_list } from "../assets/assets";

const ProductDisplay = () => {
  const { product_list, url } = useContext(StoreContext);
  const [saleProduct, setSaleProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [tabletProducts, setTabletProducts] = useState([]);
  const [laptopProducts, setLaptopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDataSaleProducts();
    fetchPhoneProduct();
    fetchLaptopProduct();
    fetchTabletProduct();
  }, []);

  const fetchPhoneProduct = async () => {
    try {
      const response = await axios.get(
        `${url}/api/product/products/category?category=Điện thoại`
      );
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError("Không thể tải danh sách sản phẩm Apple");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách sản phẩm Apple");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabletProduct = async () => {
    try {
      const response = await axios.get(
        `${url}/api/product/products/category?category=Tablet`
      );
      if (response.data.success) {
        setTabletProducts(response.data.data);
      } else {
        setError("Không thể tải danh sách sản phẩm Apple");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách sản phẩm Apple");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLaptopProduct = async () => {
    try {
      const response = await axios.get(
        `${url}/api/product/products/category?category=Laptop`
      );
      if (response.data.success) {
        setLaptopProducts(response.data.data);
      } else {
        setError("Không thể tải danh sách sản phẩm Apple");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách sản phẩm Apple");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
//`${url}/api/product/status?status=Giảm giá`
  const fetchDataSaleProducts = async () => {
    try {
      const response = await axios.get(
        `${url}/api/product/status?status=Giảm giá`
      );
      const productsWithImages = response.data.data.map((sale_product) => ({
        ...sale_product,
        images: sale_product.images.map((image) => ({
          ...image,
          url: `${url}/images/${image.filename}`,
        })),
      }));
      setSaleProduct(productsWithImages);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  return (
    <div className="product_display" id="product_display">
      <div className="textContainer">
        <h2>Flash Sale!</h2>
        <p onClick={() => navigate('/sale-product')}>Xem thêm</p>
      </div>
      <div className="product-display-list">
        {saleProduct.slice(0,8).map((item) => {
          if (item) {
            return (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                images={item.images[0].filename}
                brand={item.brand}
                status={item.status}
                salePrice={item.salePrice}
                discountPercentage={item.discountPercentage}
              />
            );
          }
        })}
      </div>
      <div className="textContainer">
        <h2>Sản phẩm tiêu biểu</h2>
        <p onClick={() => navigate('/product')}>Xem thêm</p>
      </div>
      <div className="product-display-list">
        {product_list.slice(0, 8).map((item) => {
          if (item) {
            return (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                images={item.images[0].filename}
                brand={item.brand}
                status={item.status}
                salePrice={item.salePrice}
                discountPercentage={item.discountPercentage}
              />
            );
          }
        })}
      </div>
      <div className="textContainer">
        <h2>Các sản phẩm Điện thoại</h2>
        <p onClick={() => navigate('/phone-product')}>Xem thêm</p>
      </div>
      <div className="product-display-list">
        {products.slice(0, 8).map((item) => {
          if (item) {
            return (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                images={item.images[0].filename}
                brand={item.brand}
                status={item.status}
                salePrice={item.salePrice}
                discountPercentage={item.discountPercentage}
              />
            );
          }
        })}
      </div>
      <div className="textContainer">
        <h2>Các sản phẩm Laptop</h2>
        <p onClick={() => navigate('/laptop-product')}>Xem thêm</p>
      </div>
      <div className="product-display-list">
        {laptopProducts.slice(0, 8).map((item) => {
          if (item) {
            return (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                images={item.images[0].filename}
                brand={item.brand}
                status={item.status}
                salePrice={item.salePrice}
                discountPercentage={item.discountPercentage}
              />
            );
          }
        })}
      </div>
      <div className="textContainer">
        <h2>Các sản phẩm Tablet</h2>
        <p onClick={() => navigate('/tablet-product')}>Xem thêm</p>
      </div>
      <div className="product-display-list">
        {tabletProducts.slice(0, 8).map((item) => {
          if (item) {
            return (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                images={item.images[0].filename}
                brand={item.brand}
                status={item.status}
                salePrice={item.salePrice}
                discountPercentage={item.discountPercentage}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default ProductDisplay;
