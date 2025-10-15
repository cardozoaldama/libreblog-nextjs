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
  const [showConfetti, setShowConfetti] = useState(true)
  const [revealed, setRevealed] = useState(false)

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
    playSound("magic");
    setShowConfetti(true);
    setRevealed(true);
    setTimeout(() => setShowConfetti(false), 6000);
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
      `}</style>

    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-1000">
          <Link href="/" className="inline-block mb-8">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-pulse">
              🎉 EASTER EGG 🎉
            </h1>
            <p className="text-2xl text-white/80 font-light">
              ¡Has descubierto nuestro secreto mejor guardado!
            </p>
          </div>

          {/* Magic Button */}
          {!revealed && (
            <button
              onClick={handleMagicClick}
              className="mb-12 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full text-white font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-bounce"
            >
              <Volume2 className="w-6 h-6 inline mr-2" />
              ¡Haz magia!
              <Sparkles className="w-6 h-6 inline ml-2" />
            </button>
          )}
        </div>

        {/* Development Team Pyramid */}
        {revealed && (
          <div className="flex flex-col items-center space-y-12 mb-16">
            <div className="text-center animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
              <h2 className="text-4xl font-bold text-white mb-4">
                <Star className="w-8 h-8 inline mr-2 text-yellow-400" />
                Equipo de Desarrollo
                <Star className="w-8 h-8 inline ml-2 text-yellow-400" />
              </h2>
              <p className="text-white/70 text-lg">
                Los magos detrás de LibreBlog
              </p>
            </div>

            {/* Top Level - Developers */}
            <div className="flex justify-center space-x-16 animate-in fade-in slide-in-from-left duration-1000 delay-700">
              <div className="text-center group">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative w-32 h-32 mb-6">
                    <Image
                      src="/images/guillermo-martinez.jpg"
                      alt="Guillermo Martinez"
                      fill
                      sizes="128px"
                      className="rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500 object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-blue-400 mb-2">
                  Guillermo Martinez
                </h3>
                <p className="text-white/70 text-lg mb-2">Developer</p>
                <div className="flex justify-center space-x-2">
                  <Rocket className="w-5 h-5 text-yellow-400" />
                  <Zap className="w-5 h-5 text-blue-400" />
                  <Heart className="w-5 h-5 text-pink-400" />
                </div>
              </div>

              <div className="text-center group">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative w-32 h-32 mb-6">
                    <Image
                      src="/images/alejandro-alonso.jpg"
                      alt="Alejandro Alonso"
                      fill
                      sizes="128px"
                      className="rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500 object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-purple-400 mb-2">
                  Alejandro Alonso
                </h3>
                <p className="text-white/70 text-lg mb-2">Developer</p>
                <div className="flex justify-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <Heart className="w-5 h-5 text-pink-400" />
                </div>
              </div>
            </div>

            {/* Bottom Level - Emotional Support */}
            <div className="flex justify-center space-x-20 animate-in fade-in slide-in-from-right duration-1000 delay-1000">
              <div className="text-center group">
                <button
                  onClick={() => playSound("meow")}
                  className="relative w-24 h-24 rounded-full mb-4 shadow-2xl hover:shadow-3xl group-hover:scale-125 transition-all duration-500 cursor-pointer overflow-hidden"
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
                <h4 className="text-xl font-bold text-orange-400 mb-2">
                  Miguel
                </h4>
                <p className="text-white/70 font-medium mb-2">
                  Apoyo Emocional
                </p>
                <div className="flex items-center justify-center text-white/50">
                  <Volume2 className="w-4 h-4 mr-1" />
                  <span className="text-sm">¡Hazme click!</span>
                </div>
              </div>

              <div className="text-center group">
                <button
                  onClick={() => playSound("woof")}
                  className="relative w-24 h-24 rounded-full mb-4 shadow-2xl hover:shadow-3xl group-hover:scale-125 transition-all duration-500 cursor-pointer overflow-hidden"
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
                <h4 className="text-xl font-bold text-yellow-400 mb-2">
                  Terry
                </h4>
                <p className="text-white/70 font-medium mb-2">
                  Apoyo Emocional
                </p>
                <div className="flex items-center justify-center text-white/50">
                  <Volume2 className="w-4 h-4 mr-1" />
                  <span className="text-sm">¡Hazme click!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secret Messages */}
        {revealed && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-1200">
            <div className="text-center p-8 bg-black/30 rounded-3xl border border-yellow-500/30 backdrop-blur-sm">
              <p className="text-2xl text-yellow-300 font-mono mb-4">
                <span className="animate-pulse">💡</span>
                El código es poesía, los bugs son... experiencias de aprendizaje
                <span className="animate-pulse">💡</span>
              </p>
              <p className="text-white/60">
                - Sabiduría ancestral de desarrolladores
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
              <p className="text-lg text-purple-300 mb-2">
                <Rocket className="w-5 h-5 inline mr-2" />
                Programar es como ser un mago, pero en lugar de varitas usamos
                teclados
                <Sparkles className="w-5 h-5 inline ml-2" />
              </p>
              <p className="text-white/50 text-sm">
                - Filosofía del desarrollador moderno
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-r from-blue-900/50 to-green-900/50 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
              <p className="text-lg text-blue-300 mb-2">
                <Coffee className="w-5 h-5 inline mr-2" />
                Café + Código = Magia Digital
                <Heart className="w-5 h-5 inline ml-2 text-pink-400" />
              </p>
              <p className="text-white/50 text-sm">- La ecuación perfecta</p>
            </div>
          </div>
        )}

        {/* Tech Stack Showcase */}
        {revealed && (
          <div className="mt-16 text-center animate-in fade-in slide-in-from-bottom duration-1000 delay-1500">
            <h3 className="text-3xl font-bold text-white mb-8">
              <Zap className="w-8 h-8 inline mr-2 text-yellow-400" />
              Tecnologías Utilizadas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Next.js 15", color: "from-gray-700 to-gray-900" },
                { name: "React 18", color: "from-blue-500 to-blue-700" },
                { name: "TypeScript", color: "from-blue-600 to-blue-800" },
                { name: "Tailwind CSS", color: "from-cyan-500 to-blue-600" },
                { name: "Prisma ORM", color: "from-purple-600 to-purple-800" },
                { name: "Supabase", color: "from-green-500 to-green-700" },
                { name: "Vercel", color: "from-gray-800 to-black" },
                { name: "PostgreSQL", color: "from-blue-700 to-blue-900" },
              ].map((tech, index) => (
                <div
                  key={tech.name}
                  className={`p-4 bg-gradient-to-br ${tech.color} rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-white font-semibold">{tech.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Message */}
        {revealed && (
          <div className="mt-16 text-center animate-in fade-in slide-in-from-bottom duration-1000 delay-2000">
            <div className="p-8 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-3xl border border-yellow-500/50 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-yellow-400 mb-4">
                ¡Gracias por descubrir nuestro Easter Egg! 🎊
              </h3>
              <p className="text-white/80 text-lg mb-6">
                Esperamos que disfrutes usando LibreBlog tanto como nosotros
                disfrutamos creándolo.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <Heart className="w-5 h-5 mr-2" />
                  Volver a LibreBlog
                  <Sparkles className="w-5 h-5 ml-2" />
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
