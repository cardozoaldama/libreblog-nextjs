'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function GeneratePDFButton({ postId }: { postId: string }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch(`/api/posts/${postId}/pdf`)
      const data = await res.json()
      
      if (data.error) {
        alert('PDF no disponible para este post')
        return
      }

      const { marked } = await import('marked')
      const html2pdf = (await import('html2pdf.js')).default
      
      // Remover separadores de página del contenido
      const cleanContent = data.content.replace(/---PAGE---/g, '')
      
      // Convertir Markdown a HTML
      let htmlContent = marked.parse(cleanContent) as string
      
      // Convertir checkboxes de Markdown a símbolos Unicode
      htmlContent = htmlContent.replace(/\[ \]/g, '☐') // Checkbox vacío
      htmlContent = htmlContent.replace(/\[x\]/gi, '☑') // Checkbox marcado
      
      // Crear contenedor HTML con estilos
      const container = document.createElement('div')
      container.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 750px;">
          <h1 style="color: #0c2b4d; font-size: 24px; margin-bottom: 10px; page-break-after: avoid;">${data.title}</h1>
          <p style="color: #666; font-size: 12px; margin-bottom: 5px; page-break-after: avoid;">Autor: ${data.author}</p>
          <p style="color: #666; font-size: 12px; margin-bottom: 20px; page-break-after: avoid;">Fecha: ${new Date(data.createdAt).toLocaleDateString('es-ES')}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin-bottom: 20px; page-break-after: avoid;">
          <div style="font-size: 11px; line-height: 1.8; color: #333;">
            ${htmlContent}
          </div>
        </div>
      `
      
      // Aplicar estilos CSS al contenido Markdown
      const style = document.createElement('style')
      style.textContent = `
        * { box-sizing: border-box; }
        h1, h2, h3, h4, h5, h6 { 
          color: #0c2b4d; 
          margin-top: 20px; 
          margin-bottom: 10px; 
          page-break-after: avoid;
          page-break-inside: avoid;
        }
        h1 { font-size: 20px; }
        h2 { font-size: 18px; }
        h3 { font-size: 16px; }
        p { 
          margin-bottom: 12px; 
          orphans: 3;
          widows: 3;
          page-break-inside: avoid;
        }
        code { 
          background-color: #f5f5f5; 
          padding: 2px 6px; 
          border-radius: 3px; 
          font-family: 'Courier New', monospace; 
          font-size: 10px;
          white-space: pre-wrap;
          word-break: break-word;
        }
        pre { 
          background-color: #f5f5f5; 
          padding: 15px; 
          border-radius: 5px; 
          margin: 15px 0;
          page-break-inside: avoid;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        pre code { background: none; padding: 0; }
        blockquote { 
          border-left: 4px solid #ddd; 
          padding-left: 15px; 
          color: #666; 
          font-style: italic; 
          margin: 15px 0;
          page-break-inside: avoid;
        }
        ul, ol { 
          margin: 10px 0; 
          padding-left: 30px;
        }
        li { 
          margin-bottom: 8px;
          page-break-inside: avoid;
          display: block;
          line-height: 1.6;
        }
        a { color: #0c2b4d; text-decoration: underline; word-break: break-word; }
        strong { font-weight: bold; }
        em { font-style: italic; }
        hr { 
          border: none; 
          border-top: 1px solid #ddd; 
          margin: 20px 0;
          page-break-after: always;
        }
        table { 
          border-collapse: collapse; 
          width: 100%; 
          margin: 15px 0;
          page-break-inside: avoid;
        }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
      `
      container.appendChild(style)
      
      // Configuración de html2pdf
      const opt = {
        margin: [15, 15, 15, 15],
        filename: `${data.title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { 
          mode: ['css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'blockquote', 'li', 'table']
        }
      }
      
      // Generar PDF directamente sin mostrar diálogo
      await html2pdf().set(opt).from(container).save()
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error al generar PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleGeneratePDF}
      disabled={isGenerating}
      className="flex items-center gap-2"
    >
      <FileDown className="w-4 h-4" />
      {isGenerating ? 'Generando...' : 'Descargar PDF'}
    </Button>
  )
}
