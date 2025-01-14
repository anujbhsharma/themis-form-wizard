import React, { useState } from 'react';
import { Search, Filter, Layers } from 'lucide-react';

const AdditionalResources = ({ resources }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allResources = [
    ...resources.shelters, 
    ...resources.rehabilitation, 
    ...resources.firstNationsResources,
    ...resources.legalAndReferralServices
  ];

  const filteredResources = allResources.filter(resource => 
    (selectedCategory === 'all' || 
     resource.category.toLowerCase().includes(selectedCategory.toLowerCase())) &&
    (resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (resource.matters && resource.matters.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const categories = [
    { name: 'all', label: 'All Resources', icon: <Layers className="w-4 h-4" /> },
    { name: 'shelters', label: 'Shelters', icon: <Filter className="w-4 h-4" /> },
    { name: 'rehabilitation', label: 'Rehabilitation', icon: <Filter className="w-4 h-4" /> },
    { name: 'firstNationsResources', label: 'First Nations', icon: <Filter className="w-4 h-4" /> },
    { name: 'legalAndReferralServices', label: 'Legal Services', icon: <Filter className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 ">
      {/* Header */}
      <div className="text-center ">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Support Resources
        </h1>
        <p className="text-gray-600">
          Find support services available in New Brunswick
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-4 space-y-4">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-4 pl-12 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-2">
          {categories.map((category) => (
            <button 
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                transition-all duration-200 border
                ${selectedCategory === category.name 
                  ? 'bg-red-50 text-red-700 border-red-200 font-medium' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}
              `}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No resources found matching your search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-red-100 transition-all duration-300"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                {resource.name}
              </h2>
              
              {resource.description && (
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  {resource.description}
                </p>
              )}
              
              <div className="space-y-3 text-sm">
                {resource.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600">📞</span>
                    </div>
                    <a 
                      href={`tel:${resource.phoneNumber.replace(/\s+/g, '')}`} 
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      {resource.phoneNumber}
                    </a>
                  </div>
                )}
                
                {resource.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600">✉️</span>
                    </div>
                    <a 
                      href={`mailto:${resource.email}`} 
                      className="text-gray-600 hover:text-red-600 transition-colors truncate"
                    >
                      {resource.email}
                    </a>
                  </div>
                )}
                
                {resource.matters && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600">🏷️</span>
                    </div>
                    <span className="text-gray-600">{resource.matters}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdditionalResources;