
"use client";

import React from 'react';
import Image from 'next/image';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {name: string, subcategory: string}; // This should match category._id
  image: string;
}

interface MenuProps {
  filteredItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
}

const Menu: React.FC<MenuProps> = ({ filteredItems, addToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredItems.map(item => (
        <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-48 overflow-hidden">
            <Image
              src={item.image}
              width={300}
              height={200}
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
  );
};

export default Menu;