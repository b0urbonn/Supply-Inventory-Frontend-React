import React, { useState, useEffect } from 'react';
import './inventory.css';

const Inventory = () => {
  const initialProducts = [
    { id: 1, name: 'Carabao Milk', size: 'Large', flavor: 'Plain', notes: '' },
    { id: 2, name: 'Carabao Milk', size: 'Medium', flavor: 'Chocolate', notes: '' },
    { id: 3, name: 'Carabao Milk', size: 'Medium', flavor: 'Strawberry', notes: '' },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', size: '', flavor: '', notes: '' });
  const [sortFlavor, setSortFlavor] = useState('');
  const [sortSize, setSortSize] = useState('');

  useEffect(() => {
    let filteredProducts = initialProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.flavor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortFlavor) {
      filteredProducts = filteredProducts.filter(product => product.flavor === sortFlavor);
    }

    if (sortSize) {
      filteredProducts = filteredProducts.filter(product => product.size === sortSize);
    }

    setProducts(filteredProducts);
  }, [searchTerm, sortFlavor, sortSize]);

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const addProduct = (product) => {
    product.id = products.length + 1;
    setProducts([...products, product]);
    setAdding(false);
  };

  const editProduct = (product) => {
    setEditing(true);
    setCurrentProduct({ ...product });
  };

  const updateProduct = (id, updatedProduct) => {
    setEditing(false);
    setProducts(products.map(product => (product.id === id ? updatedProduct : product)));
  };

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">Product List</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name or Flavor..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-bar">
        <select onChange={(e) => setSortFlavor(e.target.value)} value={sortFlavor}>
          <option value="">All (Flavor)</option>
          <option value="Plain">Plain</option>
          <option value="Chocolate">Chocolate</option>
          <option value="Strawberry">Strawberry</option>
        </select>
        <select onChange={(e) => setSortSize(e.target.value)} value={sortSize}>
          <option value="">All (Size)</option>
          <option value="Large">Large</option>
          <option value="Medium">Medium</option>
          <option value="Small">Small</option>
        </select>
      </div>

      <div className="button-container">
        {!editing && !adding && (
          <button className="add-button" onClick={() => setAdding(true)}>
            Add New Product
          </button>
        )}
      </div>

      {editing && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit Product</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateProduct(currentProduct.id, currentProduct);
            }}>
              <label>
                Name:
                <input 
                  type="text" 
                  value={currentProduct.name} 
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} 
                />
              </label>
              <label>
                Size:
                <input 
                  type="text" 
                  value={currentProduct.size} 
                  onChange={(e) => setCurrentProduct({ ...currentProduct, size: e.target.value })} 
                />
              </label>
              <label>
                Flavor:
                <input 
                  type="text" 
                  value={currentProduct.flavor} 
                  onChange={(e) => setCurrentProduct({ ...currentProduct, flavor: e.target.value })} 
                />
              </label>
              <label>
                Notes:
                <input 
                  type="text" 
                  value={currentProduct.notes} 
                  onChange={(e) => setCurrentProduct({ ...currentProduct, notes: e.target.value })} 
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Update</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {adding && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Add New Product</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addProduct(newProduct);
            }}>
              <label>
                Name:
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
                />
              </label>
              <label>
                Size:
                <input 
                  type="text" 
                  placeholder="Size" 
                  value={newProduct.size} 
                  onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })} 
                />
              </label>
              <label>
                Flavor:
                <input 
                  type="text" 
                  placeholder="Flavor" 
                  value={newProduct.flavor} 
                  onChange={(e) => setNewProduct({ ...newProduct, flavor: e.target.value })} 
                />
              </label>
              <label>
                Notes:
                <input 
                  type="text" 
                  placeholder="Notes" 
                  value={newProduct.notes} 
                  onChange={(e) => setNewProduct({ ...newProduct, notes: e.target.value })} 
                />
              </label>
              <div className="modal-buttons">
                <button type="submit">Add</button>
                <button onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Size</th>
            <th>Flavor</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.size}</td>
              <td>{product.flavor}</td>
              <td>{product.notes}</td>
              <td>
                <button onClick={() => editProduct(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
