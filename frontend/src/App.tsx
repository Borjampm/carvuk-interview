import { Routes, Route, Link } from 'react-router-dom'

import './App.css'
import Home from './components/home'
import ProductList from './components/productList'
import ReceiptsList from './components/receiptsList'

export default function App() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Products
              </Link>
              <Link 
                to="/receipts" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Receipts
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/receipts" element={<ReceiptsList />} />
        </Routes>
      </div>
    </>
  )
}
