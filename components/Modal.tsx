import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white border-4 border-amber-700 rounded-2xl shadow-2xl p-10 max-w-lg w-full relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-2xl text-amber-300 hover:text-amber-700"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col items-center text-center gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}
