import React, { useContext } from 'react'
import './FoodDisplay.css'  
import FoodItem from '../FoodItem/FoodItem.jsx'
import { StoreContext } from '../../context/StoreContext.jsx'
const FoodDisplay = ({category}) => {
    const {food_list}=useContext(StoreContext);
    console.log("Food list:",food_list)
  return (
    <div className='food-display' id='food-display'>
    <h2>Top dishes near you</h2>
<div className="food-display-list">
  {food_list
    ?.filter((item) => {
      if (!category) return true; // if category not selected show all
      if (category.toLowerCase() === "all") return true;
      return item?.category?.toLowerCase() === category.toLowerCase();
    })
    .map((item) => (
      <FoodItem
        key={item._id}
        _id={item._id}
        name={item.name}
        price={item.price}
        description={item.description}
        image={item.image}
      />
    ))}
</div>
    </div>
  )
}

export default FoodDisplay