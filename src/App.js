import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

const ProductList = lazy(() => import('./components/ProductList')); // implemented lazy loading for product list and product detail
const ProductDetails = lazy(() => import('./components/ProductDetails'));

function App() {
  return (
    <Router> {/* defined routes for product list as default and product detail passing id*/}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
