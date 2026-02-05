'use client';

import { X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

import { useSound } from '@/hooks/useSound';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning'
}: ConfirmationModalProps) {
  const { play } = useSound();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCancel = () => {
    play('button');
    onCancel();
  };

  const handleConfirm = () => {
    play('button');
    onConfirm();
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200",
      isOpen ? "opacity-100" : "opacity-0"
    )}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-6 transform transition-all duration-200",
        isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
      )}>
        <button 
          onClick={handleCancel}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4",
            variant === 'danger' && "bg-red-500/20 text-red-400",
            variant === 'warning' && "bg-yellow-500/20 text-yellow-400",
            variant === 'info' && "bg-blue-500/20 text-blue-400",
          )}>
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2 font-sans">
            {title}
          </h3>

          <p className="text-white/60 mb-6 font-sans">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleCancel}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-white/70 bg-white/5 hover:bg-white/10 transition-colors font-sans"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 font-sans",
                variant === 'danger' && "bg-red-500 hover:bg-red-600",
                variant === 'warning' && "bg-yellow-600 hover:bg-yellow-700",
                variant === 'info' && "bg-blue-600 hover:bg-blue-700",
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
