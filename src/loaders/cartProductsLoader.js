import { getShoppingCart } from '../utilities/fakedb';

const cartProductsLoader = async () => {
  // if cart data is in database, you have to use async await
  const storedCart = getShoppingCart();
  console.log(storedCart);
  const storedCartIdList = Object.keys(storedCart);
  console.log(storedCartIdList);

  const loadedProducts = await fetch('http://localhost:5000/productsById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storedCartIdList),
  });
  const productsData = await loadedProducts.json();
  console.log(productsData);

  const savedCart = [];

  for (const id in storedCart) {
    const addedProduct = productsData.find((product) => product._id === id);
    if (addedProduct) {
      const quantity = storedCart[id];
      addedProduct.quantity = quantity;
      savedCart.push(addedProduct);
    }
  }

  // if you need to send two things
  // return [productsData, savedCart]
  // another options
  // return { productsData, cart: savedCart }

  return savedCart;
};

export default cartProductsLoader;
