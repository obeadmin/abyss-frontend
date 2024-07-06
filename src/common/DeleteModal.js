import React from 'react';
import './Common.css';

function DeleteModal({ isOpen, items, onClose, onConfirm, displayName }) {
    if (!isOpen || items.length === 0) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>✖</button>
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to permanently delete the following items?</p>
                <div className="form-buttons">
                    <button type="button" className="cancel-button" onClick={onClose}>No</button>
                    <button type="button" className="submit-button" onClick={onConfirm}>Yes</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;
