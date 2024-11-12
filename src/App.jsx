import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import './App.css';

// Toast component with modern UI and auto-close after 5 seconds
const Toast = ({ message, onClose, type, index, moveToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [onClose]);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('toastIndex', index);
    e.target.style.cursor = 'move';
  };

  const handleDragEnd = (e) => {
    e.target.style.cursor = 'grab';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    const draggedIndex = e.dataTransfer.getData('toastIndex');
    const newPosition = e.clientY;
    moveToast(draggedIndex, newPosition);
    e.preventDefault();
  };

  return (
    <div
      className={`toast ${type}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="toast-content">
        <div className="toast-icon">
          {type === 'success' && <FaCheckCircle />}
          {type === 'error' && <FaTimesCircle />}
          {type === 'info' && <FaInfoCircle />}
          {type === 'warning' && <FaExclamationTriangle />}
        </div>
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <FaTimesCircle />
      </button>
    </div>
  );
};

// ToastContainer component
const ToastContainer = ({ toasts, removeToast, moveToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(index)}
          index={index}
          moveToast={moveToast}
        />
      ))}
    </div>
  );
};

// Main App component
const App = () => {
  const [toasts, setToasts] = useState([]);

  // Function to add a toast notification
  const addToast = (message, type) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { message, type, id: Date.now() },
    ]);
  };

  // Function to remove a toast
  const removeToast = (index) => {
    setToasts((prevToasts) => prevToasts.filter((_, i) => i !== index));
  };

  // Function to move a toast when dragged
  const moveToast = (index, newPosition) => {
    const updatedToasts = [...toasts];
    const draggedToast = updatedToasts.splice(index, 1)[0];
    updatedToasts.push(draggedToast);
    setToasts(updatedToasts);
  };

  return (
    <div className="App">
      <h1 className="app-title">Amazing UI for Toast Notifications</h1>
      <div className="button-container">
        <button className="toast-button success" onClick={() => addToast('This is a success message!', 'success')}>
          Show Success Toast
        </button>
        <button className="toast-button error" onClick={() => addToast('This is an error message!', 'error')}>
          Show Error Toast
        </button>
        <button className="toast-button info" onClick={() => addToast('This is an info message!', 'info')}>
          Show Info Toast
        </button>
        <button className="toast-button warning" onClick={() => addToast('This is a warning message!', 'warning')}>
          Show Warning Toast
        </button>
      </div>

      {/* ToastContainer for rendering toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} moveToast={moveToast} />
    </div>
  );
};

export default App;
