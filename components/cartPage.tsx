
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import CheckoutForm from './checkoutForm';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: { name: string; subcategory: string };
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orderPlaced: boolean;
  setOrderPlaced: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  setCartItems,
  isCartOpen,
  setIsCartOpen,
  orderPlaced,
  setOrderPlaced,
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    setIsPaymentModalOpen(true);
  };

  const handleWhatsAppRedirect = () => {
    const message = cartItems
      .map(
        item =>
          `${item.name} (Qty: ${item.quantity}) - N${(item.price * item.quantity).toFixed(2)}`
      )
      .join('\n');
    const total = `Total: N${getTotalPrice().toFixed(2)}`;
    const whatsappMessage = encodeURIComponent(
      `Order Details:\n${message}\n${total}\nPlease confirm my order.`
    );
    const whatsappNumber = process.env.WHATSAPP_NUMBER || '2348142809371';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
    setOrderPlaced(true);
    setTimeout(() => {
      setCartItems([]);
      setIsCartOpen(false);
      setOrderPlaced(false);
      setIsPaymentModalOpen(false);
    }, 3000);
  };

  const handlePaystackCheckout = () => {
    setIsPaymentModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      setOrderPlaced(true);
    //   await initializePayment();
      setTimeout(() => {
        setCartItems([]);
        setIsCartOpen(false);
        setOrderPlaced(false);
        setIsCheckoutModalOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Error processing payment:', error);
      setOrderPlaced(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute right-0 top-0 h-full bg-white w-full max-w-md transform transition-transform ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          } overflow-y-auto`}
        >
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
                    <div
                      key={item._id}
                      className="flex items-center border-b border-gray-200 pb-4"
                    >
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
                      <span className="font-medium">
                        N{(item.price * item.quantity).toFixed(2)}
                      </span>
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
                    <span>N{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
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
      </div>
      {/* Payment Options Modal */}


      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isPaymentModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Select Payment Method</h2>
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleWhatsAppRedirect}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <i className="fab fa-whatsapp"></i>
              <span>Pay with WhatsApp</span>
            </button>
            <button
              onClick={handlePaystackCheckout}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <i className="fas fa-credit-card"></i>
              <span>Pay with Paystack</span>
            </button>
          </div>
        </div>
      </div>
      {/* Checkout Modal */}
      <CheckoutForm 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        totalAmount={getTotalPrice()}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default Cart;