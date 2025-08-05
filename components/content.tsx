
"use client";

import React, { useState, useEffect } from 'react';
import { getCategories, getMenuItems } from '@/libs/api';
import Menu from './menu';
import Cart from './cartPage';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
   category: {name: string, subcategory: string}; // This should match category._id
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Subcategory {
  name: string;
  _id: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  status: string;
  image: string;
  subcategoryCount: number;
  subcategories: Subcategory[];
}

const Foodmenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [items, fetchedCategories] = await Promise.all([
          getMenuItems(),
          getCategories(),
        ]);
        console.log("category", fetchedCategories);
        console.log("items", items);
        setMenuItems(items);
        setCategories(fetchedCategories);
        // Set the first category as active if available
        if (fetchedCategories.length > 0) {
          setActiveCategory(fetchedCategories[0]._id);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load menu or categories. Please try again later.');
        setLoading(false);
        console.error('Error fetching menu items or categories:', err);
      }
    };

    fetchData();
  }, []);

  const filteredItems = menuItems.filter(item => item.category.name === activeCategory);

    useEffect(() => {
    if (cartItems.length === 0) {  
      setIsCartOpen(false);
    }
  }, [cartItems]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };


  useEffect(() => {
    if (getTotalItems() === 0) {
      setIsCartOpen(false);
    }
  }, [cartItems]);

  // Carousel effect
  useEffect(() => {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    slides[0].classList.add('opacity-100');

    const interval = setInterval(() => {
      slides[currentSlide].classList.remove('opacity-100');
      const nextSlide = (currentSlide + 1) % slides.length;
      slides[nextSlide].classList.add('opacity-100');
      setCurrentSlide(nextSlide);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, getTotalItems()]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-utensils text-amber-600 text-2xl mr-2"></i>
            <h1 className="text-2xl font-bold text-gray-800">Native Delight Plus</h1>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative !rounded-button whitespace-nowrap bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-amber-700 transition-colors"
          >
            <i className="fas fa-shopping-cart mr-2"></i>
            <span>Cart</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Carousel Background */}
        <div className="relative mb-12 overflow-hidden rounded-xl">
          <div className="absolute inset-0 z-0">
            <div id="carousel" className="h-full w-full">
              <div className="carousel-slide absolute inset-0 opacity-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center" style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrGkAsIl8xvNcvOsxIX6ng2n7fj0YrGOKtG892Z5QNgoH6pkJWv-exNfuCuDKeLE5TcyQ&usqp=CAU')` }}></div>
              <div className="carousel-slide absolute inset-0 opacity-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center" style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdc1_OyBTVQr0gAcF0MCkZJJSymozliOg2pA0COd56g0N4rf_Ho5-NlJuiDIEbwaG6l8k&usqp=CAU')` }}></div>
              <div className="carousel-slide absolute inset-0 opacity-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center" style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrGkAsIl8xvNcvOsxIX6ng2n7fj0YrGOKtG892Z5QNgoH6pkJWv-exNfuCuDKeLE5TcyQ&usqp=CAU')` }}></div>
            </div>
          </div>
          <div className="relative z-10 py-20 px-6 bg-black bg-opacity-50 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Our Menu</h2>
            <p className="text-gray-100 max-w-2xl mx-auto">
              Discover our carefully crafted dishes made with the finest ingredients.
              From appetizers to desserts, every bite tells a story of passion and flavor.
            </p>
          </div>
        </div>

        
        {/* Categories */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {categories.map(category => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category.name)}
                className={`!rounded-button whitespace-nowrap px-6 py-2 rounded-full font-medium cursor-pointer transition-colors ${
                  activeCategory === category.name
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading menu items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <Menu filteredItems={filteredItems} addToCart={addToCart} />
        )}
      </main>


      {/* Cart Sidebar */}
      {/* <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 h-full bg-white w-full max-w-md transform transition-transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex items-center border-b border-gray-200 pb-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-gray-600 text-sm">N{item.price.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="!rounded-button whitespace-nowrap text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="mx-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="!rounded-button whitespace-nowrap text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <span className="font-medium">N{(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="!rounded-button whitespace-nowrap ml-4 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>N{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>N{(getTotalPrice()).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={placeOrder}
                  className={`!rounded-button whitespace-nowrap w-full mt-6 py-3 rounded-lg font-medium text-white cursor-pointer ${
                    orderPlaced ? 'bg-green-600' : 'bg-amber-600 hover:bg-amber-700'
                  } transition-colors`}
                  disabled={orderPlaced}
                >
                  {orderPlaced ? (
                    <div className="flex items-center justify-center">
                      <i className="fas fa-check mr-2"></i>
                      Order Placed!
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div> */}

         <Cart
        cartItems={cartItems}
        setCartItems={setCartItems}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        orderPlaced={orderPlaced}
        setOrderPlaced={setOrderPlaced}
      />


      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Native Delight Plus</h3>
              <p className="text-gray-300">
                Serving exquisite delicacies since 2020. Our passion is to create memorable dining experiences.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Hours</h3>
              <ul className="text-gray-300">
                <li>Monday - Friday: 11am - 10pm</li>
                <li>Saturday: 10am - 11pm</li>
                <li>Sunday: 10am - 9pm</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="text-gray-300">
                <li className="flex items-center mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {/* 123 Gourmet Street, Foodville */}
                </li>
                <li className="flex items-center mb-2">
                  <i className="fas fa-phone mr-2"></i>
                  {/* (555) 123-4567 */}
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2"></i>
                  {/* info@gourmethaven.com */}
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Native Delight Plus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Foodmenu;
