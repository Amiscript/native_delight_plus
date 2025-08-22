import React from 'react';
import Image from 'next/image';
import { Plus, Star } from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  subCategory: { // Changed from subCategory to subCategory to match API
    _id: string;
    name: string;
  };
  status: string;
  stock: string;
  image: string;
}

interface MenuProps {
  filteredItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
}

const Menu: React.FC<MenuProps> = ({ filteredItems, addToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredItems.map(item => (
        <div key={item._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="relative h-56 overflow-hidden">
            {item.image ? (
              <Image src={item.image}  alt={item.name} width={400} height={224} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" style={{ width: '100%', height: '100%' }} unoptimized />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-amber-600 text-2xl">🍽️</span>
              </div>
            )}
                                  
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              <span className="font-bold">₦{item.price.toLocaleString()}</span>
            </div>
            
            {/* Stock Status Badge */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm text-xs font-bold">
              {item.stock}
            </div>
            
            {/* Quick Add Button */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={() => addToCart(item)}
                className="bg-white/90 backdrop-blur-sm text-amber-600 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-3">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                {item.name}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">(4.8)</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-amber-600">₦{item.price.toLocaleString()}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                item.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.status === 'active' ? 'Available' : 'Unavailable'}
              </span>
            </div>
            
            <button
              onClick={() => addToCart(item)}
              disabled={item.status !== 'active'}
              className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                item.status === 'active'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus size={18} />
              <span>{item.status === 'active' ? 'Add to Cart' : 'Unavailable'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;