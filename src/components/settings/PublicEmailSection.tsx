'use client';

import { useState } from 'react';

interface PublicEmailSectionProps {
  currentPublicEmail: string | null;
  onUpdate: (publicEmail: string | null) => Promise<void>;
}

export default function PublicEmailSection({ 
  currentPublicEmail,
  onUpdate 
}: PublicEmailSectionProps) {
  const [publicEmail, setPublicEmail] = useState(currentPublicEmail || '');
  const [showEmail, setShowEmail] = useState(!!currentPublicEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(showEmail && publicEmail ? publicEmail : null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Email Público</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEmail}
              onChange={(e) => setShowEmail(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Mostrar email en mi perfil público
            </span>
          </label>
        </div>

        {showEmail && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email público (opcional)
            </label>
            <input
              type="email"
              value={publicEmail}
              onChange={(e) => setPublicEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="contacto@ejemplo.com"
            />
            <p className="mt-1 text-xs text-gray-500">
              Este email será visible en tu perfil público
            </p>
          </div>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
