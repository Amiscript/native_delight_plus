"use client";

import React, { useState, useEffect } from 'react';
import { getCategories, getMenuItems } from '../libs/api';
import Menu from './menu';
import Cart from './cartPage';
import CategoryGrid from './CategoryGrid';
import CategoryModal from './CategoryModal';
import SubcategoryHeader from './SubcategoryHeader';
import Carousel from '../components/Carousel';

// API Response Interfaces
interface MenuItemsResponse {
  success: boolean;
  products: MenuItem[];
  summary?: {
    totalProducts: number;
    totalActive: number;
    totalInStock: number;
    totalOutOfStock: number;
  };
}

interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  totalCategories?: number;
  totalActiveCategories?: number;
  mostOrderedCategory?: any;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  subCategory: { 
    _id: string;
    name: string;
  };
  status: string;
  stock: string;
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Subcategory {
  name: string;
  _id: string;
}

interface CategoryImage {
  url: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  status: string;
  image: CategoryImage | null;
  subcategoryCount: number;
  subcategories: Subcategory[];
}

const Foodmenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'categories' | 'subcategory'>('categories');
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
        const [itemsResponse, categoriesResponse] = await Promise.all([ 
          getMenuItems(),
          getCategories(),
        ]);
        
        console.log("categories response", categoriesResponse);
        console.log("items response", itemsResponse); 
        
      
        let menuItemsData: MenuItem[] = [];

        if (Array.isArray(itemsResponse)) {
          
          menuItemsData = (itemsResponse as any[]).map((item: any) => ({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            subCategory: item.subCategory,
            status: item.status,
            stock: item.stock,
            image: item.image,
          }));
        } else if (itemsResponse && typeof itemsResponse === 'object' && 'success' in itemsResponse) {
          menuItemsData = (itemsResponse as MenuItemsResponse).success
            ? (itemsResponse as MenuItemsResponse).products.map((item: any) => ({
                _id: item._id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                subCategory: item.subCategory,
                status: item.status,
                stock: item.stock,
                image: item.image,
              }))
            : [];
        }
        
      
        let categoriesData: Category[] = [];
        
        if (Array.isArray(categoriesResponse)) {
        
          categoriesData = categoriesResponse.map((cat: any) => ({
            ...cat,
            image: typeof cat.image === 'string'
              ? { url: cat.image }
              : cat.image || null,
          }));
        } else if (categoriesResponse && typeof categoriesResponse === 'object' && 'success' in categoriesResponse) {
          categoriesData = (categoriesResponse as CategoriesResponse).success 
            ? (categoriesResponse as CategoriesResponse).categories.map((cat: any) => ({
                ...cat,
                image: typeof cat.image === 'string'
                  ? { url: cat.image }
                  : cat.image || null,
              }))
            : [];
        }
        
        setMenuItems(menuItemsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load menu or categories. Please try again later.');
        setLoading(false);
        console.error('Error fetching menu items or categories:', err);
      }
    };

    fetchData();
  }, []);

  const filteredItems = menuItems.filter(item => {
    if (viewMode === 'subcategory' && activeSubcategory) {
      return item.category.name === activeCategory && item.subCategory.name === activeSubcategory; 
    }
    return item.category.name === activeCategory;
  });

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

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSubcategorySelect = (categoryName: string, subcategoryName: string) => {
    setActiveCategory(categoryName);
    setActiveSubcategory(subcategoryName);
    setViewMode('subcategory');
  };

  const handleBackToCategories = () => {
    setViewMode('categories');
    setActiveCategory('');
    setActiveSubcategory('');
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
  const totalItems = getTotalItems();
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
  }, [currentSlide, totalItems]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
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
        {viewMode === 'categories' ? (
          <>
            {/* Hero Section with Carousel Background */}
            
            <Carousel/>
              
            {/* Loading and Error States */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto "></div>
                <p className="text-gray-600">Loading categories...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            ) : (
              <CategoryGrid
                categories={categories}
                onCategoryClick={handleCategoryClick}
                activeCategory={activeCategory}
              />
            )}
          </>
        ) : (
          <>
            {/* Subcategory View */}
            <SubcategoryHeader
              categoryName={activeCategory}
              subcategoryName={activeSubcategory}
              itemCount={filteredItems.length}
              onBack={handleBackToCategories}
            />

            {/* Menu Items for Subcategory */}
            {filteredItems.length > 0 ? (
              <Menu filteredItems={filteredItems} addToCart={addToCart} />
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">🍽️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Items Found</h3>
                  <p className="text-gray-600">
                    No menu items available in this subcategory at the moment.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Cart Component */}
      <Cart
        cartItems={cartItems}
        setCartItems={setCartItems}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        orderPlaced={orderPlaced}
        setOrderPlaced={setOrderPlaced}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={selectedCategory}
        onSubcategorySelect={handleSubcategorySelect}
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
               <li> Lagos <a rel="ugc" href="https://www.google.com/maps/search/?api=1&query=Native+Delight,+John+Great+Court,+1+Femi+Bamgbelu+Street,+10+Alternative+Rte,+Chevron+Dr,+opposite+Cromwell+Estate,+Eti-Osa,+Lagos+105102,+Lagos" target="_blank">
            </a></li>
                
                <li className="flex items-center mb-2">
                  <i className="fas fa-phone mr-2"></i>
                 +234 814 280 9371
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2"></i>
                  info@nativedelightplus.com
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