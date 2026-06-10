import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Checkout from './components/Checkout/Checkout';
import Inventory from './components/Inventory/Inventory';
import Login from './components/Login/Login';
import Orders from './components/Orders/Orders';
import Shop from './components/Shop/Shop';
import cartProductsLoader from './loaders/cartProductsLoader';
import Root from './Root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root></Root>,
    children: [
      {
        index: true,
        element: <Shop></Shop>,
        loader: () => fetch(`http://localhost:5000/productsCount`),
      },
      {
        path: 'orders',
        element: <Orders></Orders>,
        loader: cartProductsLoader,
      },
      {
        path: 'inventory',
        element: <Inventory></Inventory>,
      },
      {
        path: 'checkout',
        element: <Checkout></Checkout>,
      },
      {
        path: 'login',
        element: <Login></Login>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
