import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="category-filter">
     <h3><label htmlFor="category-select" className="category-label">Category</label></h3> 
      <select id="category-select" value={selectedCategory} onChange={handleCategoryChange} className="category-select">
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
