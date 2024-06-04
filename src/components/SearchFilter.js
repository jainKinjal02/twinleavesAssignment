import React from 'react';
import './SearchFilter.css';

const SearchFilter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className='search-filter'>
    <h3 className='search-heading'>Find Your Favorite</h3>
        <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="filter"
        />
    </div>

   

  );
};

export default SearchFilter;
