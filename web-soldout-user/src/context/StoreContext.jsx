import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItem, setCartItem] = useState({});
  const url = "http://172.16.88.130:8010";
  const [token, setToken] = useState("");
  const [product_list, setProductList] = useState([]);
  const [sale_product, setSaleProduct] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favoriteProduct");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const addToCart = async (itemId) => {
    try {
      if (!cartItem[itemId]) {
        setCartItem((prev) => ({ ...prev, [itemId]: 1 }));
      } else {
        setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
      if (token) {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setCartItem((prev) => ({
        ...prev,
        [itemId]: Math.max(prev[itemId] - 1, 0),
      }));
      if (token) {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        const itemInfo = product_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += (itemInfo.status === "Giảm giá"
            ? itemInfo.salePrice
            : itemInfo.price) * cartItem[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchDataProducts = async () => {
    try {
      const response = await axios.get(`${url}/api/product/list`);
      const productsWithImages = response.data.data.map((product) => ({
        ...product,
        images: product.images.map((image) => ({
          ...image,
          url: `${url}/images/${image.filename}`,
        })),
      }));
      setProductList(productsWithImages);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } }
      );
      setCartItem(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  const addToFavorites = (product) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = [...prevFavorites, product];
      localStorage.setItem("favoriteProduct", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter(
        (product) => product._id !== productId
      );
      localStorage.setItem("favoriteProduct", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchDataProducts();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };
    loadData();
  }, []); 

  const contextValue = {
    product_list,
    url,
    addToCart,
    removeFromCart,
    cartItem,
    getTotalCartAmount,
    token,
    setToken,
    fetchDataProducts,
    addToFavorites,
    removeFromFavorites, 
    favorites,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
