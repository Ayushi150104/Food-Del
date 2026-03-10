import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";

const Cart = () => {
  console.log("Cart component rendered");
  const { cartItems, food_list, removeFromCart } = useContext(StoreContext);
  console.log("Cart Items:", cartItems);
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <br />
        <hr />

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div className="cart-items-item" key={item._id}>
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>&#8377;{item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>&#8377;{item.price * cartItems[item._id]}</p>
                <p className="cross" onClick={() => removeFromCart(item._id)}>
                  x
                </p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Cart;
