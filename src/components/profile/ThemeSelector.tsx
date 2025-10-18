'use client'

import { useState } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Check, X } from 'lucide-react'
import { ThemeName, themeNames, profileThemes, allDecorations } from '@/lib/profileThemes'

interface ThemeSelectorProps {
  currentTheme: ThemeName
  currentDecoration: number
  onSave: (theme: ThemeName, decoration: number) => void
  onCancel: () => void
}

export default function ThemeSelector({ currentTheme, currentDecoration, onSave, onCancel }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme)
  const [selectedDecoration, setSelectedDecoration] = useState<number>(currentDecoration)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/users/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: selectedTheme, decoration: selectedDecoration })
      })

      if (res.ok) {
        onSave(selectedTheme, selectedDecoration)
      }
    } catch (error) {
      console.error('Error saving theme:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const previewTheme = profileThemes[selectedTheme]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card variant="elevated" className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardBody className="p-6">
          <h2 className="text-2xl font-bold mb-6">Selecciona tu tema de perfil</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {themeNames.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => setSelectedTheme(value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedTheme === value
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-4xl mb-2">{emoji}</div>
                <div className="font-semibold">{label}</div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Decoración del avatar</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-6">
              {allDecorations.map((decoration, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDecoration(index + 1)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                    selectedDecoration === index + 1
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Image src={decoration.src} alt={decoration.label} width={40} height={40} unoptimized />
                  <span className="text-xs font-semibold">{decoration.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Vista previa</h3>
            <div className={`p-6 rounded-xl ${previewTheme.card}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full ${previewTheme.avatarBorder} bg-gray-300`}></div>
                  <Image
                    src={allDecorations[selectedDecoration - 1].src}
                    alt="decoration"
                    width={48}
                    height={48}
                    className="absolute -bottom-2 -right-2 w-12 h-12 object-contain"
                    unoptimized
                  />
                </div>
                <div>
                  <div className={`${previewTheme.title} text-2xl`}>Tu Nombre</div>
                  <div className={`${previewTheme.username}`}>@usuario</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className={`p-3 rounded-lg ${previewTheme.statBox}`}>
                  <div className={`text-xl font-bold ${previewTheme.stats[0]}`}>10</div>
                  <div className={`text-xs ${previewTheme.statLabel}`}>Posts</div>
                </div>
                <div className={`p-3 rounded-lg ${previewTheme.statBox}`}>
                  <div className={`text-xl font-bold ${previewTheme.stats[1]}`}>50</div>
                  <div className={`text-xs ${previewTheme.statLabel}`}>Seguidores</div>
                </div>
                <div className={`p-3 rounded-lg ${previewTheme.statBox}`}>
                  <div className={`text-xl font-bold ${previewTheme.stats[2]}`}>30</div>
                  <div className={`text-xs ${previewTheme.statLabel}`}>Siguiendo</div>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${previewTheme.bio}`}>
                <p className={previewTheme.bioText}>Esta es tu biografía de ejemplo</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button onClick={onCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="primary" isLoading={isSaving}>
              <Check className="w-4 h-4 mr-2" />
              Guardar tema
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
