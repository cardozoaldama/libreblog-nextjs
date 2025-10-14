'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

interface PublicEmailSectionProps {
  currentPublicEmail: string | null;
  accountEmail: string;
  onUpdate: (publicEmail: string | null) => Promise<void>;
}

export default function PublicEmailSection({ 
  currentPublicEmail,
  accountEmail,
  onUpdate 
}: PublicEmailSectionProps) {
  const [publicEmail, setPublicEmail] = useState(currentPublicEmail || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(publicEmail.trim() || null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Email de Contacto Público</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de contacto (opcional)
          </label>
          <input
            type="text"
            value={publicEmail}
            onChange={(e) => setPublicEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="contacto@ejemplo.com o cualquier texto"
          />
          <p className="mt-1 text-xs text-gray-500">
            Este texto aparecerá en tu perfil público. Puedes poner un email, red social, o dejarlo vacío.
          </p>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Mail className="w-4 h-4" />
            <span className="font-medium">Esta cuenta está ligada a:</span>
            <span className="font-mono">{accountEmail}</span>
          </div>
          <p className="text-xs text-blue-600 mt-1 ml-6">
            Este es tu email de inicio de sesión y no se muestra públicamente
          </p>
        </div>

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
