'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TwoFactorSectionProps {
  isEnabled: boolean;
  onStatusChange: () => void;
}

export default function TwoFactorSection({ isEnabled, onStatusChange }: TwoFactorSectionProps) {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleEnable = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
    } catch (err: any) {
      setError(err.message || 'Error al habilitar 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) throw factors.error;

      const totpFactor = factors.data.totp[0];
      if (!totpFactor) throw new Error('No se encontró el factor TOTP');

      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: totpFactor.id,
        code: verifyCode
      });

      if (error) throw error;

      setQrCode('');
      setSecret('');
      setVerifyCode('');
      onStatusChange();
    } catch (err: any) {
      setError(err.message || 'Código incorrecto');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm('¿Desactivar autenticación de dos factores?')) return;

    setLoading(true);
    setError('');

    try {
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) throw factors.error;

      const totpFactor = factors.data.totp[0];
      if (!totpFactor) throw new Error('No se encontró el factor TOTP');

      const { error } = await supabase.auth.mfa.unenroll({ factorId: totpFactor.id });
      if (error) throw error;

      onStatusChange();
    } catch (err: any) {
      setError(err.message || 'Error al desactivar 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Autenticación de Dos Factores (2FA)</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {!isEnabled && !qrCode && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Agrega una capa extra de seguridad a tu cuenta
          </p>
          <button
            onClick={handleEnable}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            {loading ? 'Cargando...' : 'Habilitar 2FA'}
          </button>
        </div>
      )}

      {qrCode && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Escanea este código QR con tu app de autenticación (Google Authenticator, Authy, etc.)
          </p>
          
          <div className="mb-4 flex justify-center">
            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">O ingresa este código manualmente:</p>
            <code className="text-sm font-mono">{secret}</code>
          </div>

          <form onSubmit={handleVerify}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de verificación
            </label>
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="123456"
              required
            />
            <button
              type="submit"
              disabled={loading || verifyCode.length !== 6}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading ? 'Verificando...' : 'Verificar y Activar'}
            </button>
          </form>
        </div>
      )}

      {isEnabled && (
        <div>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">✓ 2FA está activo</p>
          </div>
          <button
            onClick={handleDisable}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
          >
            {loading ? 'Desactivando...' : 'Desactivar 2FA'}
          </button>
        </div>
      )}
    </div>
  );
}
