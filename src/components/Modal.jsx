import React from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const contentStyle = {
  background: '#fff',
  padding: 24,
  borderRadius: 8,
  minWidth: 400,
  maxHeight: '80vh',
  overflowY: 'auto'
};

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
