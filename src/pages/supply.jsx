import React, { useState } from 'react';
import Papa from 'papaparse';
import './supply.css';

const SupplyInventory = () => {
  const initialSupplies = [
    { id: 1, name: 'Large Bottle', price_per_unit: 10.00, quantity: 21, supplier: 'A&A Bottlers, Co.' },
    { id: 2, name: 'Medium Bottle', price_per_unit: 7.00, quantity: 4, supplier: 'A&A Bottlers, Co.' },
  ];

  const [supplies, setSupplies] = useState(initialSupplies);
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [resupplyCount, setResupplyCount] = useState(0);
  const [purchaseList, setPurchaseList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editSupply, setEditSupply] = useState({ id: null, name: '', price_per_unit: 0, quantity: 0, supplier: '' });
  const [newSupply, setNewSupply] = useState({ name: '', price_per_unit: 0, quantity: 0, supplier: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedSupply(null);
  };

  const handleSupplySelect = (supply) => {
    setSelectedSupply(supply);
    setResupplyCount(0);
  };

  const handleResupplyCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setResupplyCount(count >= 0 ? count : 0);
  };

  const handleAddToPurchase = () => {
    if (selectedSupply && resupplyCount > 0) {
      const newPurchaseItem = {
        ...selectedSupply,
        resupplyCount,
        amountPurchase: selectedSupply.price_per_unit * resupplyCount,
      };
      setPurchaseList([...purchaseList, newPurchaseItem]);
      setSelectedSupply(null);
      setResupplyCount(0);
    }
  };

  const handleImportClick = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data.map((row, index) => ({
            id: supplies.length + index + 1,
            name: row['Supply Name'],
            price_per_unit: parseFloat(row['Price per Unit (Php)']),
            quantity: parseInt(row['Quantity'], 10),
            supplier: row['Supplier'],
          }));
  
          const updatedSupplies = [...supplies];
  
          parsedData.forEach((newSupply) => {
            const existingSupply = updatedSupplies.find((supply) => supply.name === newSupply.name);
  
            if (existingSupply) {
              existingSupply.quantity += newSupply.quantity;
            } else {
              updatedSupplies.push(newSupply);
            }
          });
  
          setSupplies(updatedSupplies);
        },
      });
    }
  };

  const handleExportClick = () => {
    const csvData = purchaseList.map(item => ({
      'Supply Name': item.name,
      'Price per Unit (Php)': item.price_per_unit.toFixed(2),
      'Quantity': item.resupplyCount,
      'Amount Purchase (Php)': item.amountPurchase.toFixed(2),
      'Supplier': item.supplier,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'purchase_list.csv';
    link.click();
  };

  const handleEditSupply = (supply) => {
    setEditSupply(supply);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (editSupply.id) {
      setSupplies(supplies.map(supply => (supply.id === editSupply.id ? editSupply : supply)));
    }
    setEditSupply({ id: null, name: '', price_per_unit: 0, quantity: 0, supplier: '' });
    setIsEditing(false);
  };

  const handleAddNewSupply = () => {
    setNewSupply({ name: '', price_per_unit: 0, quantity: 0, supplier: '' });
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleSaveNew = () => {
    setSupplies([...supplies, { ...newSupply, id: supplies.length + 1 }]);
    setNewSupply({ name: '', price_per_unit: 0, quantity: 0, supplier: '' });
    setIsAdding(false);
  };

  const filteredSupplies = supplies.filter(supply =>
    supply.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="supply-inventory-container">
      <div className="sidebar">
        <h3>Stocks Inventory</h3>
        <ul>
          <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => handleTabClick('inventory')}>Inventory</li>
          <li className={activeTab === 'request' ? 'active' : ''} onClick={() => handleTabClick('request')}>Request for Resupply</li>
          <li className={activeTab === 'purchase' ? 'active' : ''} onClick={() => handleTabClick('purchase')}>Purchase</li>
        </ul>
      </div>

      <div className="inventory-content">
        {activeTab === 'inventory' && (
          <>
            <h2>Supply Inventory</h2>
            <div className="table-actions">
              <input
                type="text"
                className="search-bar"
                placeholder="Search supplies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="button-group">
                <button className="add-supply-button" onClick={handleAddNewSupply}>Add Supply</button>
                <input type="file" accept=".csv" onChange={handleImportClick} className="import-button" />
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Supply Name</th>
                  <th>Price per Unit (Php)</th>
                  <th>Quantity</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupplies.map((supply) => (
                  <tr
                    key={supply.id}
                    onClick={() => handleSupplySelect(supply)}
                    className={selectedSupply?.id === supply.id ? 'selected-row' : ''}
                  >
                    <td>{supply.name}</td>
                    <td>{supply.price_per_unit.toFixed(2)}</td>
                    <td>
                      {supply.quantity < 20 ? (
                        <div className="alert">
                          <span className="alert-text">Low Stock!</span> {supply.quantity}
                        </div>
                      ) : (
                        supply.quantity
                      )}
                    </td>
                    <td>{supply.supplier}</td>
                    <td>
                      <button onClick={() => handleEditSupply(supply)}>Edit</button>
                      <button onClick={() => setSupplies(supplies.filter(s => s.id !== supply.id))}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

{activeTab === 'request' && (
  <>
    <h2>Request for Resupply</h2>
    <div className="form-container">
      <table className="request-table">
        <thead>
          <tr>
            <th>Supply Name</th>
            <th>Price per Unit (Php)</th>
            <th>Quantity</th>
            <th>Supplier</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {supplies.filter(supply => supply.quantity < 20).map((supply) => (
            <tr
              key={supply.id}
              onClick={() => handleSupplySelect(supply)}
              className={selectedSupply?.id === supply.id ? 'selected-row' : ''}
            >
              <td>{supply.name}</td>
              <td>{supply.price_per_unit.toFixed(2)}</td>
              <td>
                <div className="alert">
                  <span className="alert-text">Low Stock!</span> {supply.quantity}
                </div>
              </td>
              <td>{supply.supplier}</td>
              <td>
                <input
                  type="radio"
                  name="selectedSupply"
                  checked={selectedSupply?.id === supply.id}
                  onChange={() => handleSupplySelect(supply)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

              {selectedSupply && (
                <div className="resupply-form">
                  <h3>Resupply for: {selectedSupply.name}</h3>
                  <div>
                    <label>Price per Unit:</label>
                    <span>{selectedSupply.price_per_unit.toFixed(2)}</span>
                  </div>
                  <div>
                    <label>Supplier:</label>
                    <span>{selectedSupply.supplier}</span>
                  </div>
                  <div>
                    <label>Resupply Quantity:</label>
                    <input type="number" value={resupplyCount} onChange={handleResupplyCountChange} />
                  </div>
                  <button onClick={handleAddToPurchase}>Add to Purchase</button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'purchase' && (
          <>
            <h2>Purchase List</h2>
            <div className="table-actions">
              <button className="export-button" onClick={handleExportClick}>Export to CSV</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Supply Name</th>
                  <th>Price per Unit (Php)</th>
                  <th>Quantity</th>
                  <th>Amount Purchase (Php)</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {purchaseList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.price_per_unit.toFixed(2)}</td>
                    <td>{item.resupplyCount}</td>
                    <td>{item.amountPurchase.toFixed(2)}</td>
                    <td>{item.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {isEditing && (
          <div className="edit-modal">
          <div className="edit-modal-content"> 
            <h2>Edit Supply</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div>
                <label>Supply Name:</label>
                <input type="text" value={editSupply.name} onChange={(e) => setEditSupply({ ...editSupply, name: e.target.value })} required />
              </div>
              <div>
                <label>Price per Unit (Php):</label>
                <input type="number" step="0.01" value={editSupply.price_per_unit} onChange={(e) => setEditSupply({ ...editSupply, price_per_unit: parseFloat(e.target.value) })} required />
              </div>
              <div>
                <label>Quantity:</label>
                <input type="number" value={editSupply.quantity} onChange={(e) => setEditSupply({ ...editSupply, quantity: parseInt(e.target.value, 10) })} required />
              </div>
              <div>
                <label>Supplier:</label>
                <input type="text" value={editSupply.supplier} onChange={(e) => setEditSupply({ ...editSupply, supplier: e.target.value })} required />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          </div>
          </div>
        )}

        {isAdding && (
          <div className="edit-modal"> {/* Reusing the same modal class for consistency */}
          <div className="edit-modal-content">
            <h2>Add New Supply</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveNew(); }}>
              <div>
                <label>Supply Name:</label>
                <input type="text" value={newSupply.name} onChange={(e) => setNewSupply({ ...newSupply, name: e.target.value })} required />
              </div>
              <div>
                <label>Price per Unit (Php):</label>
                <input type="number" step="0.01" value={newSupply.price_per_unit} onChange={(e) => setNewSupply({ ...newSupply, price_per_unit: parseFloat(e.target.value) })} required />
              </div>
              <div>
                <label>Quantity:</label>
                <input type="number" value={newSupply.quantity} onChange={(e) => setNewSupply({ ...newSupply, quantity: parseInt(e.target.value, 10) })} required />
              </div>
              <div>
                <label>Supplier:</label>
                <input type="text" value={newSupply.supplier} onChange={(e) => setNewSupply({ ...newSupply, supplier: e.target.value })} required />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
            </form>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyInventory;