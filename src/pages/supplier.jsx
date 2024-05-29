import React, { useState } from 'react';
import './supplier.css';

const SupplierDetails = () => {
    const [selectedSupplier, setSelectedSupplier] = useState('A&A Bottlers, Co.');
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        address: '',
        contact: '',
        email: '',
        remarks: ''
    });

    const [suppliers, setSuppliers] = useState([
        'A&A Bottlers, Co.',
        'Hitachi, Inc.',
        'Critical Point, Inc.'
    ]);

    const initialDetails = {
        'A&A Bottlers, Co.': {
            name: 'Albert & Andeng Bottlers, Corporation',
            address: '009 IT Street, Barangay Dos, Gasan, Marinduque',
            contact: '(042) 890 9989',
            email: 'aa@gmail.com',
            remarks: 'Good supplier'
        },
        'Hitachi, Inc.': {
            name: 'Hitachi, Inc.',
            address: '1234 Tech Road, Tokyo, Japan',
            contact: '(081) 123 4567',
            email: 'contact@hitachi.com',
            remarks: 'Reliable supplier'
        },
        'Critical Point, Inc.': {
            name: 'Critical Point, Inc.',
            address: '5678 Industry Lane, Silicon Valley, CA',
            contact: '(408) 789 0123',
            email: 'info@criticalpoint.com',
            remarks: 'Great for tech products'
        }
    };

    const [details, setDetails] = useState(initialDetails);

    const handleSupplierChange = (supplier) => {
        setSelectedSupplier(supplier);
        setIsEditing(false);
        setIsAdding(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setIsAdding(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isAdding) {
            setNewSupplier(prevDetails => ({
                ...prevDetails,
                [name]: value
            }));
        } else {
            setDetails(prevDetails => ({
                ...prevDetails,
                [selectedSupplier]: {
                    ...prevDetails[selectedSupplier],
                    [name]: value
                }
            }));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isAdding) {
            setDetails(prevDetails => ({
                ...prevDetails,
                [newSupplier.name]: { ...newSupplier }
            }));
            setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier.name]);
            setSelectedSupplier(newSupplier.name);
            setNewSupplier({
                name: '',
                address: '',
                contact: '',
                email: '',
                remarks: ''
            });
            setIsAdding(false);
        } else {
            setIsEditing(false);
        }
    };

    const handleAddSupplierClick = () => {
        setIsAdding(true);
        setIsEditing(false);
        setSelectedSupplier('');
        setNewSupplier({
            name: '',
            address: '',
            contact: '',
            email: '',
            remarks: ''
        });
    };

    const handleDeleteClick = () => {
        const updatedDetails = { ...details };
        delete updatedDetails[selectedSupplier];
        setDetails(updatedDetails);
        setSuppliers(suppliers.filter(supplier => supplier !== selectedSupplier));
        setSelectedSupplier(suppliers[0] || '');
        setIsEditing(false);
        setIsAdding(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setIsAdding(false);
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="supplier-details-container">
        <div className="suppliers-list">
          <div className="search-box-container">
            <input
              type="text"
              placeholder="Search supplier..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-box"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          <ul className="suppliers-list-ul">
            {filteredSuppliers.map((supplier) => (
              <li
                key={supplier}
                onClick={() => handleSupplierChange(supplier)}
                className={`supplier-list-item ${
                  selectedSupplier === supplier ? 'active' : ''
                }`}
              >
                {supplier}
              </li>
            ))}
            <li
              className="supplier-list-item add-supplier"
              onClick={handleAddSupplierClick}
            >
              <i className="fas fa-plus"></i> Add Supplier
            </li>
          </ul>
        </div>
            
            <div className="details-section">
                <h2>{isAdding ? 'Add New Supplier' : 'Supplier Details'}</h2>
                {(isEditing || isAdding) ? (
                    <form onSubmit={handleFormSubmit}>
                        
                        <div className="form-group">
                            <label>Complete Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={isAdding ? newSupplier.name : details[selectedSupplier]?.name || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Complete Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={isAdding ? newSupplier.address : details[selectedSupplier]?.address || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Number:</label>
                            <input
                                type="text"
                                name="contact"
                                value={isAdding ? newSupplier.contact : details[selectedSupplier]?.contact || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address:</label>
                            <input
                                type="email"
                                name="email"
                                value={isAdding ? newSupplier.email : details[selectedSupplier]?.email || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Remarks:</label>
                            <input
                                type="text"
                                name="remarks"
                                value={isAdding ? newSupplier.remarks : details[selectedSupplier]?.remarks || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <button type="submit" className="save-button">{isAdding ? 'Add Supplier' : 'Save'}</button>
                            <button type="button" onClick={handleCancelClick} className="cancel-button">Cancel</button>
                            {!isAdding && (
                                <button type="button" onClick={handleDeleteClick} className="delete-button">Delete</button>
                            )}
                        </div>
                    </form>
                 ) : (
                    <div className="supplier-details-card">
                      <div className="supplier-details-header">
                        <h3>{details[selectedSupplier]?.name}</h3>
                        <button onClick={handleEditClick} className="edit-details">
                          Edit details
                        </button>
                      </div>
                      <div className="supplier-details-body">
                        <div className="supplier-details-column">
                          <div className="supplier-details-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span className="supplier-details-label">Address:</span>
                            <span>{details[selectedSupplier]?.address}</span>
                          </div>
                          <div className="supplier-details-item">
                            <i className="fas fa-phone"></i>
                            <span className="supplier-details-label">Contact:</span>
                            <span>{details[selectedSupplier]?.contact}</span>
                          </div>
                        </div>
                        <div className="supplier-details-column">
                          <div className="supplier-details-item">
                            <i className="fas fa-envelope"></i>
                            <span className="supplier-details-label">Email:</span>
                            <span>{details[selectedSupplier]?.email}</span>
                          </div>
                          <div className="supplier-details-item">
                            <i className="fas fa-comment"></i>
                            <span className="supplier-details-label">Remarks:</span>
                            <span>{details[selectedSupplier]?.remarks}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
            </div>
        </div>
    );
};

export default SupplierDetails;
