import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import { food_list } from '../assets/assets';

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url="https://food-del-bz74.onrender.com"
  const [token,setToken] = useState("");
  const [food_list,setFoodList]=useState([])

  const addToCart = async (id) => {
    console.log(id)
    setCartItems(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    if (token){
      await axios.post(url+"/api/cart/add",{id},{headers:{token}})
    }
  };

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id] -= 1;
      else delete updated[id];
      return updated;
    });
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if(itemInfo){
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
  }
    return totalAmount;
  };


  const fetchFoodList=async()=>{
    const response=await axios.get(url+"/api/food/list");
    setFoodList(response.data.data)
  }

  useEffect(()=>{
    
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    }
    loadData();
  },[])
  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};