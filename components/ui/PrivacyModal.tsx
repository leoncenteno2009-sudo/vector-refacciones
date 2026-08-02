'use client'

import React from 'react'

export const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
        <h3 id="modal-title" className="text-2xl font-bold text-carbon mb-4">
          Aviso de Privacidad - VECTOR
        </h3>
        <div className="text-sm text-text-secondary space-y-4 leading-relaxed">
          <p>
            En **VECTOR Refacciones y Distribución Automotriz**, la privacidad y confidencialidad de tus datos personales es fundamental.
          </p>
          <p>
            Los datos proporcionados a través de nuestros formularios de cotización (nombre, teléfono, correo electrónico y detalles de tu vehículo) son utilizados exclusivamente para la verificación técnica de compatibilidad de refacciones y el seguimiento comercial directo.
          </p>
          <p>
            No vendemos, alquilamos ni transferimos datos personales a terceros sin tu consentimiento explícito. Puedes solicitar la actualización o rectificación de tus datos en cualquier momento.
          </p>
        </div>
        <div className="mt-8 pt-4 border-t border-carbon/10 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-carbon text-white font-semibold hover:bg-black transition-colors"
          >
            Cerrar aviso
          </button>
        </div>
      </div>
    </div>
  )
}
