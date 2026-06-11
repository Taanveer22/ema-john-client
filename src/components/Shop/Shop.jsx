import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const loadedProducts = useLoaderData();
  // console.log(loadedProducts);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const numberOfPages = Math.ceil(loadedProducts?.count / itemsPerPage);

  const pages = [];
  for (let i = 0; i < numberOfPages; i++) {
    // console.log(i);
    pages.push(i);
  }
  // const pages = [...Array(numberOfPages).keys()];
  console.log(pages);

  const handleItemsPerPageChange = (e) => {
    // console.log(e.target.value);
    const eventValue = parseInt(e.target.value);
    setItemsPerPage(eventValue);
    setCurrentPage(0);
  };

  const handlePrevBtn = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextBtn = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart = [];
    // step 1: get id of the addedProduct
    for (const id in storedCart) {
      // step 2: get product from products state by using id
      const addedProduct = products.find((product) => product._id === id);
      if (addedProduct) {
        // step 3: add quantity
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        // step 4: add the added product to the saved cart
        savedCart.push(addedProduct);
      }
      // console.log('added Product', addedProduct)
    }
    // step 5: set the cart
    setCart(savedCart);
  }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((productItem) => productItem._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((productItem) => productItem._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  return (
    <>
      {/* shop */}
      <div className="shop-container">
        <div className="products-container">
          {products.map((product) => (
            <Product
              key={product._id}
              product={product}
              handleAddToCart={handleAddToCart}
            ></Product>
          ))}
        </div>
        <div className="cart-container">
          <Cart cart={cart} handleClearCart={handleClearCart}>
            <Link className="proceed-link" to="/orders">
              <button className="btn-proceed">Review Order</button>
            </Link>
          </Cart>
        </div>
      </div>
      {/* pagination */}
      <p>current page : {currentPage}</p>
      <div className="pagination-container">
        <button onClick={handlePrevBtn}>Prev</button>
        <div className="buttons">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage && 'selected'}
            >
              {page}
            </button>
          ))}
        </div>
        <div className="items">
          <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <button onClick={handleNextBtn}>Next</button>
      </div>
    </>
  );
};

export default Shop;
