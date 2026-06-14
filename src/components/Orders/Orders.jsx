import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { deleteShoppingCart, removeFromDb } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import ReviewItem from '../ReviewItem/ReviewItem';
import './Orders.css';

const Orders = () => {
  const savedCart = useLoaderData();
  const [cartData, setCartData] = useState(savedCart ?? []);

  const handleRemoveFromCart = (id) => {
    setCartData((prevCart) => prevCart.filter((product) => product._id !== id));
    // remove from localStorage too
    removeFromDb(id);
  };

  const handleClearCart = () => {
    setCartData([]);
    // clear localStorage too
    deleteShoppingCart();
  };

  return (
    <div className="shop-container">
      <div className="review-container">
        {cartData.map((product) => (
          <ReviewItem
            key={product._id}
            product={product}
            handleRemoveFromCart={handleRemoveFromCart}
          ></ReviewItem>
        ))}
      </div>
      <div className="cartData-container">
        <Cart cartData={cartData} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/checkout">
            <button className="btn-proceed">Proceed Checkout</button>
          </Link>
        </Cart>
      </div>
    </div>
  );
};

export default Orders;
