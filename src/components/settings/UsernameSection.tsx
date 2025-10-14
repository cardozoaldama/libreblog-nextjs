'use client';

import { useState, useEffect } from 'react';

interface UsernameSectionProps {
  currentUsername: string;
  usernameLastChanged: Date | null;
  onUpdate: (username: string) => Promise<void>;
}

export default function UsernameSection({ 
  currentUsername, 
  usernameLastChanged,
  onUpdate 
}: UsernameSectionProps) {
  const [username, setUsername] = useState(currentUsername);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [canChange, setCanChange] = useState(true);
  const [daysUntilChange, setDaysUntilChange] = useState(0);

  useEffect(() => {
    if (usernameLastChanged) {
      const daysSinceChange = Math.floor(
        (Date.now() - new Date(usernameLastChanged).getTime()) / (1000 * 60 * 60 * 24)
      );
      const remaining = 30 - daysSinceChange;
      
      if (remaining > 0) {
        setCanChange(false);
        setDaysUntilChange(remaining);
      }
    }
  }, [usernameLastChanged]);

  useEffect(() => {
    if (username === currentUsername) {
      setIsAvailable(null);
      setError('');
      return;
    }

    const checkUsername = async () => {
      if (username.length < 3) {
        setError('Mínimo 3 caracteres');
        setIsAvailable(false);
        return;
      }

      if (username.length > 30) {
        setError('Máximo 30 caracteres');
        setIsAvailable(false);
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        setError('Solo letras, números, guiones y guiones bajos');
        setIsAvailable(false);
        return;
      }

      setIsChecking(true);
      setError('');

      try {
        const res = await fetch('/api/users/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });

        const data = await res.json();

        if (data.available) {
          setIsAvailable(true);
        } else {
          setIsAvailable(false);
          setError('Username no disponible');
        }
      } catch {
        setError('Error al verificar');
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username, currentUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canChange || !isAvailable || username === currentUsername) return;
    
    await onUpdate(username);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Username</h2>
      
      {!canChange && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          Podrás cambiar tu username en {daysUntilChange} días
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username público
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            disabled={!canChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="tu-username"
          />
          
          {username !== currentUsername && (
            <div className="mt-2 text-sm">
              {isChecking && <span className="text-gray-500">Verificando...</span>}
              {!isChecking && isAvailable === true && (
                <span className="text-green-600">✓ Disponible</span>
              )}
              {!isChecking && isAvailable === false && error && (
                <span className="text-red-600">✗ {error}</span>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!canChange || !isAvailable || username === currentUsername}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Actualizar Username
        </button>
      </form>
    </div>
  );
}
