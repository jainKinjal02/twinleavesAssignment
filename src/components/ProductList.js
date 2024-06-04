import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilter from './SearchFilter';
import CategoryFilter from './CategoryFilter';
import { DataGrid } from '@mui/x-data-grid';
import icon from '../assets/icon.jpeg';
import cookie from '../assets/cookie.jpg';
import './ProductList.css';

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortModel, setSortModel] = useState([{ field: 'mrp.mrp', sort: 'asc' }]);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // id for product in the API response is null , adding index as id for each product to navigate to product detail page
        const productsWithId = data.products.map((product, index) => ({
          ...product,
          id: index,
        }));
        setAllProducts(productsWithId || []);
        setTotalProducts(data.totalResults || 0);
        const categorySet = new Set(productsWithId.map(product => product.main_category));
        setCategories([...categorySet]);
        setLoading(false);
      })
      .catch(error => {     // error handling with catch block
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filteredProducts = allProducts
      .filter(product => product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(product => selectedCategory === '' || product.main_category === selectedCategory);

    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      filteredProducts = filteredProducts.sort((a, b) => {
        const aValue = field.split('.').reduce((o, i) => o[i], a) || 0;
        const bValue = field.split('.').reduce((o, i) => o[i], b) || 0;
        if (sort === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    setProducts(filteredProducts.slice(page * pageSize, (page + 1) * pageSize));
  }, [allProducts, searchTerm, selectedCategory, sortModel, page]);

  const handlePageChange = (params) => {
    setPage(params.page);
  };

  const handleSortModelChange = (model) => {
    setSortModel(model);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
    setPage(0); // reset to first page when search term changes
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(0);
  };



  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state:  {product}  });
  };

  const handleImageError = (e) => { // this function is created to handle img url as these are returnign null, no images , setting a default image cookie instead
    e.target.src = cookie;
  };

  if (loading) {
    return <div>Loading...</div>; // loader implemented
  }

  if (error) {
    return <div>Error: {error.message}</div>; //error handling
  }

  const columns = [ // columns degined for data grid from material UI
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'main_category', headerName: 'Category', width: 150 },
    {
      field: "mrp.mrp",
      headerName: 'Price',
      width: 150,
      renderCell: (params) => `₹${params.value || 0}`,
    },
    {
      field: 'images',
      headerName: 'Image',
      width: 150,
      renderCell: (params) => (
        <img
          src={params.value && params.value.front ? params.value.front : cookie}
          alt={params.row.name}
          onError={handleImageError}
          style={{ width: '50px', height: '50px' }}
        />
      ),
    },
  ];

  return (
    <div className="container">
      <div className='app-heading'>
        <img src={icon} alt='icon-img' className='app-icon' />
        <h2>Get Everything In Minutes</h2>
      </div>
      <div className="content">
        <div className="sidebar">
          <SearchFilter searchTerm={searchTerm} setSearchTerm={handleSearchTermChange} />
          <CategoryFilter categories={categories} selectedCategory={selectedCategory} setSelectedCategory={handleCategoryChange} />
         <div className='sort-filter'>
            <h3><label htmlFor="sort-select" className="sort-label">Sort by Price</label></h3>
            <select id="sort-select" onChange={(e) => handleSortModelChange([{ field: 'mrp.mrp', sort: e.target.value }])} className="sort-select">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
         </div>
        </div>
        <div className="main">
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={products}
              columns={columns}
              pageSize={pageSize}
              pagination
              paginationMode="server"
              rowCount={totalProducts}
              onPageChange={(params) => handlePageChange(params)}
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              getRowId={(row) => row.id || `${row.name}-${Math.random()}`}
              onRowClick={(params) => handleProductClick(params.row)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
