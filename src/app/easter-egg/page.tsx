'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Coffee, Volume2, Sparkles, Heart, Zap, Star, Rocket } from 'lucide-react'
import Button from '@/components/ui/Button'

// NOTA: Este archivo es completamente independiente del proyecto principal
// Para removerlo: elimina /src/app/easter-egg/, /public/images/ y /public/audio/

// Tipos de sonido disponibles para reproducir
type SoundType = 'meow' | 'woof' | 'magic'

// Interfaz para las partículas animadas
interface Particle {
  id: number
  x: number
  y: number
  delay: number
}

/**
 * Página Easter Egg - Página secreta con información del equipo
 * Incluye efectos visuales, sonidos y animaciones
 */
export default function EasterEggPage() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [expandedDev, setExpandedDev] = useState<string | null>(null)

  useEffect(() => {
    // Crear partículas flotantes
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  const handleMagicClick = () => {
    setShowConfetti(true);
    setRevealed(true);
    playSound("magic");
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const playSound = (soundType: 'meow' | 'woof' | 'magic') => {
    try {
      const audio = new Audio()

      switch (soundType) {
        case 'meow':
          audio.src = '/audio/miguel-meow.mp3'
          break
        case 'woof':
          audio.src = '/audio/terry-woof.mp3'
          break
        case 'magic':
          audio.src = '/audio/magic-sound.mp3'
          break
      }

      audio.volume = 0.5
      audio.play().catch(console.error)
    } catch (error) {
      console.error('Error playing sound:', error)
      // Fallback to Web Audio API if audio files don't exist
      playFallbackSound(soundType)
    }
  }

  /**
   * Función de respaldo para generar sonidos usando Web Audio API
   * Se usa cuando los archivos de audio no están disponibles
   */
  const playFallbackSound = (soundType: SoundType) => {
    try {
      // Crear contexto de audio (compatible con navegadores antiguos)
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioContext = new AudioContextClass()

    if (soundType === 'meow') {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } else if (soundType === 'woof') {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.1)
      oscillator.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
    } else if (soundType === 'magic') {
      for (let i = 0; i < 3; i++) {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        const baseFreq = 440 + (i * 220)
        oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime + i * 0.1)
        oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 2, audioContext.currentTime + 0.3 + i * 0.1)

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + i * 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5 + i * 0.1)

        oscillator.start(audioContext.currentTime + i * 0.1)
        oscillator.stop(audioContext.currentTime + 0.5 + i * 0.1)
      }
    }
    } catch (error) {
      console.error('Error en Web Audio API:', error)
    }
  }

return (
  <>
    <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .confetti-item {
          animation: confetti-fall linear forwards;
        }
        
        @keyframes animate-confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-confetti-fall {
          animation: animate-confetti-fall linear forwards;
        }
      `}</style>

    <div className="min-h-screen bg-gradient-to-br from-[#000022] via-[#0c2b4d] to-[#36234e] relative overflow-hidden">
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-300 opacity-60" />
        </div>
      ))}

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 80 }).map((_, i) => {
            const emojis = [
              "🎉",
              "🎊",
              "✨",
              "⭐",
              "💫",
              "🌟",
              "🎈",
              "🎆",
              "🎇",
              "💥",
            ];
            const randomEmoji =
              emojis[Math.floor(Math.random() * emojis.length)];
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 0.5;
            const randomDuration = 2 + Math.random() * 2;

            return (
              <div
                key={i}
                className="absolute text-2xl animate-confetti-fall"
                style={{
                  left: `${randomX}%`,
                  top: "-50px",
                  animationDelay: `${randomDelay}s`,
                  animationDuration: `${randomDuration}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                {randomEmoji}
              </div>
            );
          })}
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-in fade-in slide-in-from-top duration-1000">
          <Link href="/" className="inline-block mb-6 sm:mb-8">
            <Button variant="ghost" className="text-white hover:bg-white/10 text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#dedff1] via-[#5f638f] to-[#36234e] bg-clip-text text-transparent mb-4 animate-pulse">
              🎉 EASTER EGG 🎉
            </h1>
            <p className="text-lg sm:text-2xl text-[#dedff1]/80 font-light px-4">
              ¡Has descubierto nuestro secreto mejor guardado!
            </p>
          </div>

          {/* Magic Button */}
          {!revealed && (
            <button
              onClick={handleMagicClick}
              className="mb-8 sm:mb-12 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#0c2b4d] via-[#36234e] to-[#5f638f] rounded-full text-[#dedff1] font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-bounce"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2" />
              ¡Haz magia!
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 inline ml-2" />
            </button>
          )}
        </div>

        {/* Development Team Pyramid */}
        {revealed && (
          <div className="flex flex-col items-center space-y-8 sm:space-y-12 mb-12 sm:mb-16">
            <div className="text-center animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
              <h2 className="text-2xl sm:text-4xl font-bold text-[#dedff1] mb-4">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 inline mr-2 text-[#5f638f]" />
                Equipo de Desarrollo
                <Star className="w-6 h-6 sm:w-8 sm:h-8 inline ml-2 text-[#5f638f]" />
              </h2>
              <p className="text-[#dedff1]/70 text-base sm:text-lg">
                Los magos detrás de LibreBlog
              </p>
            </div>

            {/* Top Level - Developers */}
            <div className="flex flex-col sm:flex-row justify-center items-stretch space-y-6 sm:space-y-0 sm:space-x-6 lg:space-x-12 animate-in fade-in slide-in-from-left duration-1000 delay-700">
              {/* Guillermo Martinez */}
              <button
                onClick={() => setExpandedDev(expandedDev === 'guillermo' ? null : 'guillermo')}
                className="group relative bg-gradient-to-br from-[#0c2b4d]/30 to-[#36234e]/30 backdrop-blur-sm rounded-3xl p-6 border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-500 hover:scale-105 cursor-pointer w-full sm:w-80"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                        <Image
                          src="/images/guillermo-martinez.jpg"
                          alt="Guillermo Martinez"
                          fill
                          sizes="96px"
                          className="rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500 object-cover border-4 border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2">
                    Guillermo Martinez
                  </h3>
                  
                  <div className={`overflow-hidden transition-all duration-500 ${expandedDev === 'guillermo' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[#dedff1] text-sm sm:text-base mb-3 font-semibold">💻 Developer</p>
                    <div className="flex justify-center space-x-3 mb-2">
                      <div className="flex items-center gap-1 bg-cyan-500/20 px-3 py-1 rounded-full">
                        <Rocket className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-cyan-300 font-medium">Frontend</span>
                      </div>
                      <div className="flex items-center gap-1 bg-blue-500/20 px-3 py-1 rounded-full">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-blue-300 font-medium">Backend</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-pink-400 text-sm">
                      <Heart className="w-4 h-4 fill-current" />
                      <span>No durmió casi durante el proceso.</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-[#dedff1]/50 flex items-center justify-center gap-1">
                    <span>{expandedDev === 'guillermo' ? '▲' : '▼'}</span>
                    <span>Click para {expandedDev === 'guillermo' ? 'ocultar' : 'ver más'}</span>
                  </div>
                </div>
              </button>

              {/* Alejandro Alonso */}
              <button
                onClick={() => setExpandedDev(expandedDev === 'alejandro' ? null : 'alejandro')}
                className="group relative bg-gradient-to-br from-[#36234e]/30 to-[#5f638f]/30 backdrop-blur-sm rounded-3xl p-6 border-2 border-purple-400/30 hover:border-purple-400 transition-all duration-500 hover:scale-105 cursor-pointer w-full sm:w-80"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                        <Image
                          src="/images/alejandro-alonso.jpg"
                          alt="Alejandro Alonso"
                          fill
                          sizes="96px"
                          className="rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500 object-cover border-4 border-purple-400"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent mb-2">
                    Alejandro Alonso
                  </h3>
                  
                  <div className={`overflow-hidden transition-all duration-500 ${expandedDev === 'alejandro' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[#dedff1] text-sm sm:text-base mb-3 font-semibold">💻 Developer</p>
                    <div className="flex justify-center space-x-3 mb-2">
                      <div className="flex items-center gap-1 bg-purple-500/20 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-purple-300 font-medium">Frontend</span>
                      </div>
                      <div className="flex items-center gap-1 bg-pink-500/20 px-3 py-1 rounded-full">
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        <span className="text-xs text-pink-300 font-medium">Backend</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-pink-400 text-sm">
                      <Heart className="w-4 h-4 fill-current" />
                      <span>Manejo de datos y registros.</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-[#dedff1]/50 flex items-center justify-center gap-1">
                    <span>{expandedDev === 'alejandro' ? '▲' : '▼'}</span>
                    <span>Click para {expandedDev === 'alejandro' ? 'ocultar' : 'ver más'}</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Bottom Level - Emotional Support */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-12 lg:space-x-20 animate-in fade-in slide-in-from-right duration-1000 delay-1000">
              <div className="text-center group">
                <button
                  onClick={() => playSound("meow")}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 shadow-2xl hover:shadow-3xl group-hover:scale-125 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <Image
                    src="/images/miguel-gato.jpg"
                    alt="Miguel el gato"
                    width={96}
                    height={96}
                    className="rounded-full object-cover w-full h-full"
                    style={{ width: "auto", height: "auto" }}
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                </button>
                <h4 className="text-lg sm:text-xl font-bold text-orange-400 mb-2">
                  Miguel
                </h4>
                <p className="text-[#dedff1]/70 font-medium mb-2 text-sm sm:text-base">
                  Apoyo Emocional
                </p>
                <div className="flex items-center justify-center text-[#dedff1]/50">
                  <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm">¡Hazme click!</span>
                </div>
              </div>

              <div className="text-center group">
                <button
                  onClick={() => playSound("woof")}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 shadow-2xl hover:shadow-3xl group-hover:scale-125 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <Image
                    src="/images/terry-perro.jpg"
                    alt="Terry el perro"
                    width={96}
                    height={96}
                    className="rounded-full object-cover w-full h-full"
                    style={{ width: "auto", height: "auto" }}
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                </button>
                <h4 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">
                  Terry
                </h4>
                <p className="text-[#dedff1]/70 font-medium mb-2 text-sm sm:text-base">
                  Apoyo Emocional
                </p>
                <div className="flex items-center justify-center text-[#dedff1]/50">
                  <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm">¡Hazme click!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secret Messages */}
        {revealed && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-1200">
            <div className="text-center p-6 sm:p-8 bg-[#000022]/50 rounded-2xl sm:rounded-3xl border border-[#5f638f]/30 backdrop-blur-sm mx-4 sm:mx-0">
              <p className="text-lg sm:text-2xl text-[#5f638f] font-mono mb-4 px-2">
                <span className="animate-pulse">💡</span>
                El código es poesía, los bugs son... experiencias de aprendizaje
                <span className="animate-pulse">💡</span>
              </p>
              <p className="text-[#dedff1]/60 text-sm sm:text-base">
                - Sabiduría ancestral de desarrolladores
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-[#36234e]/50 to-[#0c2b4d]/50 rounded-2xl border border-[#5f638f]/30 backdrop-blur-sm mx-4 sm:mx-0">
              <p className="text-base sm:text-lg text-[#dedff1] mb-2 px-2">
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Programar es como ser un mago, pero en lugar de varitas usamos
                teclados
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 inline ml-2" />
              </p>
              <p className="text-[#dedff1]/50 text-xs sm:text-sm">
                - Filosofía del desarrollador moderno
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-[#0c2b4d]/50 to-[#36234e]/50 rounded-2xl border border-[#5f638f]/30 backdrop-blur-sm mx-4 sm:mx-0">
              <p className="text-base sm:text-lg text-[#dedff1] mb-2 px-2">
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Café + Código = Magia Digital
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 inline ml-2 text-pink-400" />
              </p>
              <p className="text-[#dedff1]/50 text-xs sm:text-sm">- La ecuación perfecta</p>
            </div>
          </div>
        )}

        {/* Tech Stack Showcase */}
        {revealed && (
          <div className="mt-12 sm:mt-16 text-center animate-in fade-in slide-in-from-bottom duration-1000 delay-1500">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#dedff1] mb-6 sm:mb-8">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 inline mr-2 text-[#5f638f]" />
              Tecnologías Utilizadas
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
              {[
                { name: "Next.js 15", color: "from-[#000022] to-[#0c2b4d]" },
                { name: "React 18", color: "from-[#0c2b4d] to-[#36234e]" },
                { name: "TypeScript", color: "from-[#36234e] to-[#5f638f]" },
                { name: "Tailwind CSS", color: "from-[#5f638f] to-[#0c2b4d]" },
                { name: "Prisma ORM", color: "from-[#36234e] to-[#000022]" },
                { name: "Supabase", color: "from-[#0c2b4d] to-[#5f638f]" },
                { name: "Vercel", color: "from-[#000022] to-[#36234e]" },
                { name: "PostgreSQL", color: "from-[#0c2b4d] to-[#000022]" },
              ].map((tech, index) => (
                <div
                  key={tech.name}
                  className={`p-3 sm:p-4 bg-gradient-to-br ${tech.color} rounded-lg sm:rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-[#dedff1] font-semibold text-sm sm:text-base">{tech.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Message */}
        {revealed && (
          <div className="mt-12 sm:mt-16 text-center animate-in fade-in slide-in-from-bottom duration-1000 delay-2000">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#36234e]/50 to-[#0c2b4d]/50 rounded-2xl sm:rounded-3xl border border-[#5f638f]/50 backdrop-blur-sm mx-4 sm:mx-0">
              <h3 className="text-xl sm:text-3xl font-bold text-[#5f638f] mb-4 px-2">
                ¡Gracias por la atención brindada a nuestro proyecto LibreBlog! 🎊
              </h3>
              <p className="text-[#dedff1]/80 text-base sm:text-lg mb-6 px-2">
                Esperamos que disfrutes usando LibreBlog tanto como nosotros
                sufrimos creándolo.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-[#0c2b4d] to-[#36234e] hover:from-[#36234e] hover:to-[#5f638f] text-[#dedff1] font-bold py-3 px-6 sm:px-8 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Volver a LibreBlog
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
);
}
