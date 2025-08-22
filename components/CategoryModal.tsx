import React from 'react';
import Image from 'next/image';
import { X, ArrowRight, Package2 } from 'lucide-react';

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
  image: CategoryImage | null; // Updated to object with url
  subcategoryCount: number;
  subcategories: Subcategory[];
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSubcategorySelect: (categoryName: string, subcategoryName: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSubcategorySelect,
}) => {
  if (!isOpen || !category) return null;

  const handleSubcategoryClick = (subcategoryName: string) => {
    onSubcategorySelect(category.name, subcategoryName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden transform transition-all duration-300">
        {/* Modal Header */}
        <div className="relative">
          <div className="h-64 overflow-hidden">
            {category.image?.url ? (
              <Image 
                src={category.image.url}
                alt={category.name} 
                width={400} 
                height={224} 
                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" 
                style={{ width: '100%', height: '100%' }} 
                unoptimized 
              />
            ) : (
              // Fallback UI when no image is available
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <Package2 size={48} className="text-amber-600 opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{category.name}</h2>
                <p className="text-white/95 text-base leading-relaxed drop-shadow-md max-w-2xl">{category.description}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center">
                <Package2 className="text-white mx-auto mb-1" size={24} />
                <p className="text-white font-bold text-lg">{category.subcategoryCount}</p>
                <p className="text-white/90 text-xs">Subcategories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
              <Package2 className="mr-3 text-amber-600" size={28} />
              Available Subcategories
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Choose a subcategory to explore our carefully curated selection of delicious offerings
            </p>
          </div>

          {category.subcategories && category.subcategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-2">
              {category.subcategories.map((subcategory) => (
                <button
                  key={subcategory._id}
                  onClick={() => handleSubcategoryClick(subcategory.name)}
                  className="group p-5 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-amber-50 hover:to-amber-100 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300 text-left transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800 group-hover:text-amber-700 text-lg transition-colors duration-300">
                      {subcategory.name}
                    </span>
                    <div className="w-8 h-8 bg-amber-100 group-hover:bg-amber-200 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                      <ArrowRight className="text-amber-600" size={16} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm group-hover:text-amber-600 transition-colors duration-300">
                    Click to explore items
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package2 className="text-gray-400" size={32} />
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">No Subcategories Available</h4>
              <p className="text-gray-500">This category does not have any subcategories at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;