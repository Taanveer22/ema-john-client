import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Cart.css';

const Cart = ({ cartData = [], handleClearCart, children }) => {
  //   console.log(cartData);

  let totalPrice = 0;
  let totalShipping = 0;
  let quantity = 0;

  for (const product of cartData) {
    totalPrice = totalPrice + product.price * (product.quantity || 0);
    totalShipping = totalShipping + (product.shipping || 0);
    quantity = quantity + (product.quantity || 0);
  }
  const tax = (totalPrice * 7) / 100;

  const grandTotal = totalPrice + totalShipping + tax;

  return (
    <div className="cart">
      <h4>Order Summary</h4>
      <p>Selected Items: {quantity}</p>
      <p>Total Price: ${totalPrice}</p>
      <p>Shipping: ${totalShipping}</p>
      <p>Tax: ${tax.toFixed(2)}</p>
      <h5>Grand Total: ${grandTotal.toFixed(2)} </h5>
      <button onClick={handleClearCart} className="btn-clear-cart">
        <span>Clear Cart </span>
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
      {children}
    </div>
  );
};

export default Cart;
