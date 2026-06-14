import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { addToDb, deleteShoppingCart } from '../../utilities/fakedb';
import baseURL from '../api/baseUrl';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
  // =========================
  // STATE
  // =========================
  const loadedCart = useLoaderData();
  // console.log(loadedCart);
  const [cartData, setCartData] = useState(loadedCart ?? []);
  const [products, setProducts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [countProducts, setCountProducts] = useState(0);

  // =========================
  // PAGINATION LOGIC
  // =========================
  const numberOfPages = Math.ceil(countProducts / itemsPerPage);

  // Create page numbers dynamically
  const pages = [...Array(numberOfPages).keys()];
  // console.log(pages);
  // const pages = [];
  // for (let i = 0; i < numberOfPages; i++) {
  //   // console.log(i);
  //   pages.push(i);
  // }

  // =========================
  // FETCH PRODUCTS (pagination)
  // =========================
  useEffect(() => {
    fetch(`${baseURL}/products?page=${currentPage}&size=${itemsPerPage}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage, itemsPerPage]);

  // =========================
  // FETCH TOTAL PRODUCT COUNT
  // =========================
  useEffect(() => {
    fetch(`${baseURL}/productsCount`)
      .then((res) => res.json())
      .then((data) => setCountProducts(data.countProducts));
  }, []);

  // =========================
  // ADD TO CART (FIXED - NO STALE STATE BUG)
  // =========================
  const handleAddToCart = (product) => {
    setCartData((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);

      if (!existingProduct) {
        return [...prevCart, { ...product, quantity: 1 }];
      } else {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
    });
    addToDb(product._id);
  };

  // =========================
  // CLEAR CART
  // =========================
  const handleClearCart = () => {
    setCartData([]);
    deleteShoppingCart();
  };

  // =========================
  // PAGINATION HANDLERS (SAFE)
  // =========================

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
          <Cart cartData={cartData} handleClearCart={handleClearCart}>
            <Link className="proceed-link" to="/orders">
              <button className="btn-proceed">Review Order</button>
            </Link>
          </Cart>
        </div>
      </div>
      {/* pagination */}
      <div className="pagination-container">
        <button onClick={handlePrevBtn}>Prev</button>
        <div className="buttons">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? 'selected' : undefined}
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
