"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Foodmenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Appetizers');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const categories = [
    'Restaurant Menu',
    'Lounge Menu',
    'Grill Menu',
    'Cafe Menu',
    'Desserts',
    'Beverages'
  ];

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Bruschetta',
      description: 'Grilled bread rubbed with garlic and topped with olive oil, salt, tomatoes, and herbs.',
      price: 7000,
      category: 'Restaurant Menu',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSne8NhaTwKZi1DgRR1V4e8lsUkfuIBUfOyNi_vlcFrk49vT31EZmRD9MLPw5mUWTPkHc&usqp=CAU'
    },
    {
      id: 2,
      name: 'Calamari Fritti',
      description: 'Crispy fried calamari served with marinara sauce and lemon wedges.',
      price: 10000,
      category: 'Restaurant Menu',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr3Nq9CXR-QSCrNWOMYXDRxPGRc0rEjNrkWWb0s_o175g0x1ekqFC_gLyQqcHs3cGQHIk&usqp=CAU'
    },
    {
      id: 3,
      name: 'Caprese Salad',
      description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze and olive oil.',
      price: 9000,
      category: 'Restaurant Menu',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_pRehWhq9CEMPqUBft0VwkrLtwiBd6ncRqj_dHVLjgMc5fUjZ8Krrnw7Mb79O5TqWp70&usqp=CAU'
    },
    {
      id: 4,
      name: 'Filet Mignon',
      description: 'Premium cut 8oz beef tenderloin grilled to perfection, served with roasted vegetables and mashed potatoes.',
      price: 3200,
      category: 'Grill Menu',
      imageUrl: 'https://i.ytimg.com/vi/QGhE1Y5UKCE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCx5Vh-Y_wfeNYHGwya7HfAjv4xjg'
    },
    {
      id: 5,
      name: 'Grilled Salmon',
      description: 'Atlantic salmon fillet grilled with lemon and herbs, served with asparagus and wild rice.',
      price: 2000,
      category: 'Lounge Menu',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbKdDe24w0A1W7n-tKffgn_k4reNuDEy90b6KygqThP8OHylvJaTg9Iy4YNEfdA79rNjU&usqp=CAU'
    },
    {
      id: 6,
      name: 'Fettuccine Alfredo',
      description: 'Fettuccine pasta tossed in a rich and creamy Parmesan cheese sauce.',
      price: 3000,
      category: 'Cafe Menu',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMZ1R8Tw7C-wSwgSI121EiiQHDPe2utgh_7dkEIFKewsEEaacbSkjao8ypyeS85yi4QWg&usqp=CAU'
    },
    {
      id: 7,
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil on a thin crust.',
      price: 1500,
      category: 'Lounge Menu',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrGkAsIl8xvNcvOsxIX6ng2n7fj0YrGOKtG892Z5QNgoH6pkJWv-exNfuCuDKeLE5TcyQ&usqp=CAU'
    },
    {
      id: 8,
      name: 'Tiramisu',
      description: 'Traditional Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
      price: 8000,
      category: 'Desserts',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrGkAsIl8xvNcvOsxIX6ng2n7fj0YrGOKtG892Z5QNgoH6pkJWv-exNfuCuDKeLE5TcyQ&usqp=CAU'
    },
    {
      id: 9,
      name: 'Craft Lemonade',
      description: 'Freshly squeezed lemonade with mint leaves and a hint of ginger.',
      price: 4500,
      category: 'Beverages',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdc1_OyBTVQr0gAcF0MCkZJJSymozliOg2pA0COd56g0N4rf_Ho5-NlJuiDIEbwaG6l8k&usqp=CAU'
    }
  ];

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = () => {
    if (cartItems.length === 0) return;
    setOrderPlaced(true);
    setTimeout(() => {
      setCartItems([]);
      setIsCartOpen(false);
      setOrderPlaced(false);
    }, 3000);
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

    // Initialize first slide
    slides[0].classList.add('opacity-100');

    const interval = setInterval(() => {
      slides[currentSlide].classList.remove('opacity-100');
      const nextSlide = (currentSlide + 1) % slides.length;
      slides[nextSlide].classList.add('opacity-100');
      setCurrentSlide(nextSlide);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

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
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`!rounded-button whitespace-nowrap px-6 py-2 rounded-full font-medium cursor-pointer transition-colors ${
                  activeCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  width={300} // Set an appropriate width
                  height={200} // Set an appropriate height
                  alt={item.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                  <span className="text-lg font-semibold text-amber-600">N{item.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="!rounded-button whitespace-nowrap w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Cart Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
                    <div key={item.id} className="flex items-center border-b border-gray-200 pb-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={80} // Set an appropriate width
                        height={80} // Set an appropriate height
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-gray-600 text-sm">N{item.price.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="!rounded-button whitespace-nowrap text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="mx-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="!rounded-button whitespace-nowrap text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <span className="font-medium">N{(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
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
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span>N{(getTotalPrice() * 0.1).toFixed(2)}</span>
                  </div> */}
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>N{(getTotalPrice()).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={placeOrder}
                  className={`!rounded-button whitespace-nowrap w-full mt-6 py-3 rounded-lg font-medium text-white cursor-pointer ${
                    orderPlaced
                      ? 'bg-green-600'
                      : 'bg-amber-600 hover:bg-amber-700'
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
      </div>
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
            <p>&copy; {new Date().getFullYear()} Native delight plus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Foodmenu;
