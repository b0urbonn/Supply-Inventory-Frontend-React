import React, { useState } from 'react';
import './batch_inv.css';

const BatchInventory = () => {
  const [batches, setBatches] = useState([
    { batchNo: 7, product: 'Carabao Milk', size: 'Large', flavor: 'Plain', quantity: 3, manufacturingDate: '2024-04-30', expirationDate: '2024-05-27', expirationTime: '10:00PM', status: 'Pulled-out' },
    { batchNo: 10, product: 'Carabao Milk', size: 'Medium', flavor: 'Chocolate', quantity: 60, manufacturingDate: '2024-05-05', expirationDate: '2024-05-12', expirationTime: '5:00AM', status: 'Pulled-out' },
    { batchNo: 11, product: 'Carabao Milk', size: 'Large', flavor: 'Plain', quantity: 10, manufacturingDate: '2024-05-10', expirationDate: '2024-05-17', expirationTime: '5:00AM', status: 'In-stock' },
    { batchNo: 12, product: 'Carabao Milk', size: 'Medium', flavor: 'Strawberry', quantity: 20, manufacturingDate: '2024-05-12', expirationDate: '2024-05-19', expirationTime: '6:00PM', status: 'For stock' }
  ]);
  const [filter, setFilter] = useState({ size: '', flavor: '' });
  const [sortField, setSortField] = useState('expirationDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [newBatch, setNewBatch] = useState({ product: 'Carabao Milk', size: '', flavor: '', quantity: '', manufacturingDate: '', expirationDate: '', expirationTime: '', status: 'In-stock' });
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [isEditingBatch, setIsEditingBatch] = useState(false);
  const [editBatchData, setEditBatchData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredBatches = batches.filter(batch => {
    const sizeMatch = filter.size ? batch.size === filter.size : true;
    const flavorMatch = filter.flavor ? batch.flavor === filter.flavor : true;
    const searchMatch = batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        batch.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        batch.flavor.toLowerCase().includes(searchTerm.toLowerCase());
    return sizeMatch && flavorMatch && searchMatch;
  });

  const sortedBatches = filteredBatches.sort((a, b) => {
    if (sortField === 'batchNo' || sortField === 'quantity') {
      return sortOrder === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    } else {
      const dateA = new Date(a[sortField] + ' ' + a.expirationTime);
      const dateB = new Date(b[sortField] + ' ' + b.expirationTime);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const addNewBatch = (e) => {
    e.preventDefault();
    setBatches([...batches, { ...newBatch, batchNo: batches.length + 1 }]);
    setIsAddingBatch(false);
    setNewBatch({ product: 'Carabao Milk', size: '', flavor: '', quantity: '', manufacturingDate: '', expirationDate: '', expirationTime: '', status: 'In-stock' });
  };

  const editBatch = (batch) => {
    setIsEditingBatch(true);
    setEditBatchData(batch);
  };

  const updateBatch = (e) => {
    e.preventDefault();
    const updatedBatches = batches.map(batch => {
      if (batch.batchNo === editBatchData.batchNo) {
        return editBatchData;
      }
      return batch;
    });
    setBatches(updatedBatches);
    setIsEditingBatch(false);
    setEditBatchData(null);
  };

  const deleteBatch = (batchNo) => {
    const updatedBatches = batches.filter(batch => batch.batchNo !== batchNo);
    setBatches(updatedBatches);
  };

  const exportToCSV = () => {
    const csvData = [
      ["Batch No.", "Product", "Size", "Flavor", "Quantity", "Manufacturing Date", "Expiration Date", "Expiration Time", "Status"],
      ...batches.map(batch => [batch.batchNo, batch.product, batch.size, batch.flavor, batch.quantity, batch.manufacturingDate, batch.expirationDate, batch.expirationTime, batch.status])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'batch_inventory.csv';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="batch-inventory-container">
      <div className="batch-header">
        <h2>Batch Inventory</h2>
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <label htmlFor="size-filter">Size: </label>
            <select id="size-filter" name="size" value={filter.size} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
          <div>
            <label htmlFor="flavor-filter">Flavor: </label>
            <select id="flavor-filter" name="flavor" value={filter.flavor} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Plain">Plain</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Strawberry">Strawberry</option>
            </select>
          </div>
        </div>
      </div>
      <table className="batch-table">
        <thead>
          <tr>
            <th onClick={() => { setSortField('batchNo'); toggleSortOrder(); }}>Batch No.</th>
            <th>Product</th>
            <th>Size</th>
            <th>Flavor</th>
            <th onClick={() => { setSortField('quantity'); toggleSortOrder(); }}>Quantity</th>
            <th onClick={() => { setSortField('manufacturingDate'); toggleSortOrder(); }}>Manufacturing Date</th>
            <th onClick={() => { setSortField('expirationDate'); toggleSortOrder(); }}>Expiration Date</th>
            <th onClick={() => { setSortField('expirationTime'); toggleSortOrder(); }}>Expiration Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {sortedBatches.map(batch => (
    <tr key={batch.batchNo}>
      <td>{batch.batchNo}</td>
      <td>{batch.product}</td>
      <td>{batch.size}</td>
      <td>{batch.flavor}</td>
      <td>{batch.quantity}</td>
      <td>{batch.manufacturingDate}</td>
      <td>{batch.expirationDate}</td>
      <td>{batch.expirationTime}</td>
      <td className={`status ${batch.status.replace(' ', '-').toLowerCase()}`}>{batch.status}</td>
      <td>
        <button onClick={() => editBatch(batch)}>Edit</button>
        <button onClick={() => deleteBatch(batch.batchNo)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>
</table>
<div className="actions">
  <button onClick={() => setIsAddingBatch(true)}>Add New Batch</button>
  <button onClick={exportToCSV}>Export for Sale</button>
</div>
{isAddingBatch && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Add New Batch</h3>
      <form onSubmit={addNewBatch}>
        <div>
          <label htmlFor="product">Product:</label>
          <input
            type="text"
            id="product"
            value={newBatch.product}
            onChange={(e) => setNewBatch({ ...newBatch, product: e.target.value })}
            disabled
          />
        </div>
        <div>
          <label htmlFor="size">Size:</label>
          <select
            id="size"
            value={newBatch.size}
            onChange={(e) => setNewBatch({ ...newBatch, size: e.target.value })}
            required
          >
            <option value="">Select Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
        <div>
          <label htmlFor="flavor">Flavor:</label>
          <select
            id="flavor"
            value={newBatch.flavor}
            onChange={(e) => setNewBatch({ ...newBatch, flavor: e.target.value })}
            required
          >
            <option value="">Select Flavor</option>
            <option value="Plain">Plain</option>
            <option value="Chocolate">Chocolate</option>
            <option value="Strawberry">Strawberry</option>
          </select>
        </div>
        <input
          type="number"
          placeholder="Quantity"
          value={newBatch.quantity}
          onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Manufacturing Date"
          value={newBatch.manufacturingDate}
          onChange={(e) => setNewBatch({ ...newBatch, manufacturingDate: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Expiration Date"
          value={newBatch.expirationDate}
          onChange={(e) => setNewBatch({ ...newBatch, expirationDate: e.target.value })}
          required
        />
        <input
          type="time"
          placeholder="Expiration Time"
          value={newBatch.expirationTime}
          onChange={(e) => setNewBatch({ ...newBatch, expirationTime: e.target.value })}
          required
        />
        <select
          value={newBatch.status}
          onChange={(e) => setNewBatch({ ...newBatch, status: e.target.value })}
          required
        >
          <option value="In-stock">In-stock</option>
          <option value="Pulled-out">Pulled-out</option>
          <option value="For stock">For stock</option>
        </select>
        <div className="form-buttons">
          <button type="submit">Add Batch</button>
          <button type="button" onClick={() => setIsAddingBatch(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{isEditingBatch && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Edit Batch</h3>
      <form onSubmit={updateBatch}>
        <div>
          <label htmlFor="product">Product:</label>
          <input
            type="text"
            id="product"
            value={editBatchData.product}
            onChange={(e) => setEditBatchData({ ...editBatchData, product: e.target.value })}
            disabled
          />
        </div>
        <div>
          <label htmlFor="size">Size:</label>
          <select
            id="size"
            value={editBatchData.size}
            onChange={(e) => setEditBatchData({ ...editBatchData, size: e.target.value })}
            required
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
        <div>
          <label htmlFor="flavor">Flavor:</label>
          <select
            id="flavor"
            value={editBatchData.flavor}
            onChange={(e) => setEditBatchData({ ...editBatchData, flavor: e.target.value })}
            required
          >
            <option value="Plain">Plain</option>
            <option value="Chocolate">Chocolate</option>
            <option value="Strawberry">Strawberry</option>
          </select>
        </div>
        <input
          type="number"
          placeholder="Quantity"
          value={editBatchData.quantity}
          onChange={(e) => setEditBatchData({ ...editBatchData, quantity: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Manufacturing Date"
          value={editBatchData.manufacturingDate}
          onChange={(e) => setEditBatchData({ ...editBatchData, manufacturingDate: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Expiration Date"
          value={editBatchData.expirationDate}
          onChange={(e) => setEditBatchData({ ...editBatchData, expirationDate: e.target.value })}
          required
        />
        <input
          type="time"
          placeholder="Expiration Time"
          value={editBatchData.expirationTime}
          onChange={(e) => setEditBatchData({ ...editBatchData, expirationTime: e.target.value })}
          required
        />
        <select
          value={editBatchData.status}
          onChange={(e) => setEditBatchData({ ...editBatchData, status: e.target.value })}
          required
        >
          <option value="In-stock">In-stock</option>
          <option value="Pulled-out">Pulled-out</option>
          <option value="For stock">For stock</option>
        </select>
        <div className="form-buttons">
          <button type="submit">Update Batch</button>
          <button type="button" onClick={() => setIsEditingBatch(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
</div>
);
};

export default BatchInventory;