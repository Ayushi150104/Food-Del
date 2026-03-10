import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-del-bz74.onrender.com"; // Fixed leading space
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } },
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } },
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return Math.round(totalAmount * 100) / 100;
  };

  const addOrders = async (orderData) => {
    const activeToken = token || localStorage.getItem("token");
    if (activeToken) {
      try {
        const response = await axios.post(url + "/api/order/add", orderData, {
          headers: { token: activeToken },
        });
        return response.data;
      } catch (error) {
        console.error("Error in addOrders API:", error);
        return { success: false, message: "Error placing order" };
      }
    } else {
      toast.error("Please login to place your order");
      return { success: false, message: "User not authenticated" };
    }
  };

  const getOrders = async () => {
    const activeToken = token || localStorage.getItem("token");

    if (activeToken) {
      try {
        const response = await axios.post(
          url + "/api/order/getOrders",
          {},
          { headers: { token: activeToken } },
        );

        return response.data.data;
      } catch (error) {
        console.error("Error in getOrders API:", error);
        return [];
      }
    } else {
      toast.error("Please login to view your orders");
      return [];
    }
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } },
    );
    setCartItems(response.data.cartData || {});
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken); // Keeps cart items synced on refresh
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    getOrders,
    addOrders,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
