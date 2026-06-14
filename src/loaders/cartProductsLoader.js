import baseURL from '../components/api/baseUrl';
import { getShoppingCart } from '../utilities/fakedb';

const cartProductsLoader = async () => {
  // 1. Get cart from localStorage
  // storedCart = { productId: quantity }
  const storedCart = getShoppingCart();

  // 2. Convert object keys into array of IDs
  // Example: {a:1, b:2} → ["a", "b"]
  const storedCartIdList = Object.keys(storedCart);

  // console.log('storedCart:', storedCart);
  // console.log('storedCartIdList:', storedCartIdList);
  // 3. If cart is empty, return empty array
  if (storedCartIdList.length === 0) {
    return [];
  }

  // 4. Send IDs to backend to get full product info
  const loadedProducts = await fetch(`${baseURL}/productsById`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storedCartIdList),
  });
  const productsData = await loadedProducts.json();
  // console.log(productsData);

  // 5. FINAL CART
  const savedCart = [];

  // loop through storedCart object (id → quantity)
  for (const id in storedCart) {
    // find full product details from backend data
    const addedProduct = productsData.find((product) => product._id === id);

    // if product exists in backend response
    if (addedProduct) {
      // get quantity from localStorage
      const quantity = storedCart[id];

      // attach quantity to product
      addedProduct.quantity = quantity;

      // push into final cart array
      savedCart.push(addedProduct);
    }
  }

  // 6. return final cart to Shop component
  return savedCart;
};

export default cartProductsLoader;
