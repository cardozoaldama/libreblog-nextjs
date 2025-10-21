'use client'

import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, FileText, List, Layers } from 'lucide-react'

export default function CreatorGuide() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-gradient-to-br from-[#0c2b4d] to-[#36234e] rounded-xl p-6 border border-[#5f638f]/20 shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-[#dedff1]"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-[#5f638f]" />
          <h3 className="text-lg font-semibold">📚 Guía para Creadores</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="mt-6 space-y-6 text-[#dedff1]/90">
          {/* Índice Automático */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#5f638f] font-semibold">
              <List className="w-5 h-5" />
              <h4>Índice Automático (Table of Contents)</h4>
            </div>
            <div className="pl-7 space-y-2 text-sm">
              <p>El sistema genera automáticamente un índice lateral con todos tus títulos y subtítulos.</p>
              <div className="bg-[#000022]/50 rounded-lg p-4 space-y-2">
                <p className="text-[#5f638f] font-mono text-xs">Ejemplo en Markdown:</p>
                <pre className="text-xs text-[#dedff1]/80 overflow-x-auto">
{`# Título Principal
## Subtítulo 1
### Sección 1.1
## Subtítulo 2`}
                </pre>
              </div>
              <p className="text-[#dedff1]/70">
                ✨ <strong>Tip:</strong> Usa títulos descriptivos para mejor navegación
              </p>
            </div>
          </div>

          {/* Fold Inteligente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#5f638f] font-semibold">
              <FileText className="w-5 h-5" />
              <h4>Fold Inteligente (Continuar Leyendo)</h4>
            </div>
            <div className="pl-7 space-y-2 text-sm">
              <p>Posts con más de 2,000 palabras muestran automáticamente un botón "Continuar leyendo".</p>
              <ul className="list-disc list-inside space-y-1 text-[#dedff1]/70">
                <li>Se muestran las primeras 1,000 palabras</li>
                <li>El lector decide cuándo expandir el contenido</li>
                <li>Mejora la experiencia en posts largos</li>
              </ul>
              <p className="text-[#dedff1]/70">
                ✨ <strong>Tip:</strong> Escribe una introducción atractiva en las primeras 1,000 palabras
              </p>
            </div>
          </div>

          {/* Paginación Manual */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#5f638f] font-semibold">
              <Layers className="w-5 h-5" />
              <h4>Paginación Manual (Dividir en Páginas)</h4>
            </div>
            <div className="pl-7 space-y-2 text-sm">
              <p>Activa la opción "Dividir post en páginas" y usa el separador especial:</p>
              <div className="bg-[#000022]/50 rounded-lg p-4 space-y-2">
                <p className="text-[#5f638f] font-mono text-xs">Separador de página:</p>
                <pre className="text-xs text-[#dedff1]/80">
{`Contenido de la página 1...

---PAGE---

Contenido de la página 2...

---PAGE---

Contenido de la página 3...`}
                </pre>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#dedff1]/70">
                <li>Divide el post en secciones lógicas</li>
                <li>Ideal para tutoriales, guías largas o series</li>
                <li>Los lectores navegan con botones de página</li>
              </ul>
              <p className="text-[#dedff1]/70">
                ✨ <strong>Tip:</strong> Divide en puntos naturales de la narrativa
              </p>
            </div>
          </div>

          {/* Markdown Básico */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#5f638f] font-semibold">
              <BookOpen className="w-5 h-5" />
              <h4>Markdown Básico</h4>
            </div>
            <div className="pl-7 space-y-2 text-sm">
              <div className="bg-[#000022]/50 rounded-lg p-4 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#5f638f] font-semibold mb-2">Formato:</p>
                    <pre className="text-[#dedff1]/80">
{`**Negrita**
*Cursiva*
~~Tachado~~
\`código\``}
                    </pre>
                  </div>
                  <div>
                    <p className="text-[#5f638f] font-semibold mb-2">Listas:</p>
                    <pre className="text-[#dedff1]/80">
{`- Item 1
- Item 2
  - Sub-item

1. Primero
2. Segundo`}
                    </pre>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#5f638f]/20">
                  <p className="text-[#5f638f] font-semibold mb-2">Enlaces e Imágenes:</p>
                  <pre className="text-[#dedff1]/80">
{`[Texto del enlace](https://ejemplo.com)
![Descripción](url-imagen.jpg)`}
                  </pre>
                </div>
                <div className="pt-2 border-t border-[#5f638f]/20">
                  <p className="text-[#5f638f] font-semibold mb-2">Checkboxes:</p>
                  <pre className="text-[#dedff1]/80">
{`- [ ] Tarea pendiente
- [x] Tarea completada`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Mejores Prácticas */}
          <div className="bg-[#5f638f]/10 rounded-lg p-4 space-y-2 text-sm">
            <p className="font-semibold text-[#5f638f]">💡 Mejores Prácticas:</p>
            <ul className="list-disc list-inside space-y-1 text-[#dedff1]/70">
              <li>Usa títulos jerárquicos (H1 → H2 → H3) para estructura clara</li>
              <li>Divide posts muy largos (&gt;5,000 palabras) con paginación</li>
              <li>Incluye imágenes para hacer el contenido más visual</li>
              <li>Escribe párrafos cortos para mejor legibilidad</li>
              <li>Usa listas para información fácil de escanear</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
