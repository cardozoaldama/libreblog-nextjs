'use client';

import { useState } from 'react';

interface ProfileSectionProps {
  currentName: string | null;
  currentBio: string | null;
  onUpdate: (name: string | null, bio: string | null) => Promise<void>;
}

export default function ProfileSection({ 
  currentName, 
  currentBio,
  onUpdate 
}: ProfileSectionProps) {
  const [name, setName] = useState(currentName || '');
  const [bio, setBio] = useState(currentBio || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(name || null, bio || null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Perfil Público</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Tu nombre"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biografía
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Cuéntanos sobre ti..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {bio.length}/500 caracteres
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
