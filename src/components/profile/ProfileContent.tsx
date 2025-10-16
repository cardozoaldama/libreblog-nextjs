'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FollowButton from '@/components/ui/FollowButton'
import NSFWFilter from '@/components/ui/NSFWFilter'
import { FileText, Pin, Heart, Globe, Github, Palette, Mail, Facebook, Instagram, Linkedin } from 'lucide-react'
import { formatDate, getGravatarUrl, extractExcerpt } from '@/lib/utils'
import PinButton from '@/components/post/PinButton'
import ReactMarkdown from 'react-markdown'

type UserWithSocials = {
  id: string
  email: string
  displayName?: string | null
  username?: string | null
  bio?: string | null
  avatarUrl?: string | null
  createdAt: Date
  posts: any[]
  websiteUrl?: string | null
  githubUrl?: string | null
  publicEmail?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  linkedinUrl?: string | null
}

interface ProfilePageProps {
  user: UserWithSocials
  followersCount: number
  followingCount: number
  postsWithLikes: any[]
  isOwnProfile: boolean
  authUser: any
  isFollowing: boolean
}

export default function ProfileContent({ user, followersCount, followingCount, postsWithLikes, isOwnProfile, authUser, isFollowing }: ProfilePageProps) {
  const [theme, setTheme] = useState<'halloween' | 'christmas' | 'cyberpunk' | 'aurora'>('aurora')

  useEffect(() => {
    const month = new Date().getMonth() + 1
    if (month === 10) setTheme('halloween')
    else if (month === 12) setTheme('christmas')
    else setTheme('aurora')
  }, [])

  const cycleTheme = () => {
    setTheme(prev => prev === 'halloween' ? 'christmas' : prev === 'christmas' ? 'cyberpunk' : prev === 'cyberpunk' ? 'aurora' : 'halloween')
  }

  const themeClasses = {
    halloween: {
      card: 'bg-gradient-to-br from-orange-800 via-red-800 to-black border-4 border-orange-500 shadow-2xl relative overflow-hidden',
      // título más claro
      title: 'text-orange-200 drop-shadow-lg font-black text-4xl',
      stats: ['text-orange-300', 'text-purple-300', 'text-red-300', 'text-yellow-300'],
      bio: 'bg-gradient-to-r from-orange-600/60 to-red-600/60 border-3 border-orange-400 shadow-inner backdrop-blur-sm',
      // bio en amarillo suave para mejor legibilidad
      bioText: 'text-yellow-200',
      button: 'bg-gradient-to-r from-orange-600 to-red-600 border-2 border-orange-400 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl font-bold transition-all',
      statBox: 'bg-black/30 border-2 border-orange-400/50 backdrop-blur-sm shadow-lg',
      statLabel: 'text-orange-100',
      postCard: 'border-orange-400/50 bg-gradient-to-br from-orange-500/20 to-red-500/20',
      postText: 'text-gray-900',
      postTitle: 'text-orange-900 group-hover:text-orange-700',
      postExcerpt: 'text-gray-800',
      postCategory: 'bg-orange-500/80 text-gray-900 font-bold',
      postPinned: 'bg-orange-600 text-gray-900 font-bold',
      postDate: 'text-gray-700',
      sectionTitle: 'text-orange-100',
      sectionSubtitle: 'text-orange-200',
      emojis: ['🎃', '🕷️', '💀', '🦇', '👻', '🕸️'],
      background: 'from-black via-orange-900 to-red-900'
    },
    christmas: {
      card: 'bg-gradient-to-br from-[#1d351d] via-[#325632] to-[#8b181d] border-4 border-[#e6be9a] shadow-2xl relative overflow-hidden',
      // título navideño más claro
      title: 'text-[#f5e2c8] drop-shadow-lg font-black text-4xl',
      stats: ['text-[#e6be9a]', 'text-[#e6be9a]', 'text-[#e6be9a]', 'text-[#e6be9a]'],
      bio: 'bg-gradient-to-r from-[#325632]/60 to-[#8b181d]/60 border-3 border-[#e6be9a] shadow-inner backdrop-blur-sm',
      // bio en amarillo suave
      bioText: 'text-yellow-200',
      button: 'bg-gradient-to-r from-[#8b181d] to-[#6f0f11] border-2 border-[#e6be9a] hover:from-[#a02025] hover:to-[#8b1a1d] text-[#e6be9a] shadow-lg hover:shadow-xl font-bold transition-all',
      statBox: 'bg-[#1d351d]/50 border-2 border-[#e6be9a]/50 backdrop-blur-sm shadow-lg',
      statLabel: 'text-[#e6be9a]',
      postCard: 'border-[#e6be9a]/50 bg-gradient-to-br from-[#325632]/30 to-[#8b181d]/30',
      postText: 'text-gray-900',
      postTitle: 'text-[#6f0f11] group-hover:text-[#8b181d]',
      postExcerpt: 'text-gray-800',
      postCategory: 'bg-[#8b181d]/80 text-gray-100 font-bold',
      postPinned: 'bg-[#6f0f11] text-gray-100 font-bold',
      postDate: 'text-gray-700',
      sectionTitle: 'text-[#e6be9a]',
      sectionSubtitle: 'text-[#e6be9a]/80',
      emojis: ['🎄', '❄️', '⭐', '🎁', '🎅', '🔔'],
      background: 'from-[#1d351d] via-[#325632] to-[#1d351d]'
    },
    cyberpunk: {
      card: 'bg-gradient-to-br from-slate-950 via-purple-950 to-black border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50 relative overflow-hidden',
      title: 'text-slate-900 drop-shadow-lg font-black text-4xl',
      stats: ['text-slate-700', 'text-slate-700', 'text-cyan-200', 'text-slate-700'],
      bio: 'bg-gradient-to-r from-slate-900/60 to-purple-900/60 border-3 border-cyan-400 shadow-inner backdrop-blur-sm',
      bioText: 'text-yellow-300',
      button: 'bg-gradient-to-r from-cyan-600 to-purple-600 border-2 border-yellow-400 hover:from-cyan-700 hover:to-purple-700 text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl font-bold transition-all',
      statBox: 'bg-black/50 border-2 border-cyan-400/60 backdrop-blur-sm shadow-lg shadow-cyan-400/20',
      statLabel: 'text-cyan-100',
      postCard: 'border-cyan-400/50 bg-gradient-to-br from-cyan-500/20 to-purple-500/20',
      postText: 'text-slate-950',
      postTitle: 'text-slate-950 group-hover:text-slate-800',
      postExcerpt: 'text-slate-900',
      postCategory: 'bg-cyan-500/80 text-slate-950 font-bold',
      postPinned: 'bg-cyan-600 text-slate-950 font-bold',
      postDate: 'text-slate-800',
      sectionTitle: 'text-slate-800',
      sectionSubtitle: 'text-slate-700',
      emojis: ['⚡', '🌃', '💻', '🔮', '🎮', '🌐'],
      background: 'from-slate-950 via-purple-950 to-black'
    },
    aurora: {
      card: 'bg-gradient-to-br from-emerald-600 via-cyan-500 to-violet-600 border-4 border-emerald-300 shadow-2xl shadow-emerald-500/50 relative overflow-hidden',
      title: 'text-white drop-shadow-lg font-black text-4xl',
      stats: ['text-emerald-100', 'text-cyan-100', 'text-violet-100', 'text-sky-100'],
      bio: 'bg-gradient-to-r from-emerald-600/50 to-violet-600/50 border-3 border-emerald-300 shadow-inner backdrop-blur-sm',
      bioText: 'text-yellow-300',
      button: 'bg-gradient-to-r from-emerald-500 to-cyan-500 border-2 border-cyan-300 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/50 hover:shadow-xl font-bold transition-all',
      statBox: 'bg-white/15 border-2 border-emerald-300/60 backdrop-blur-sm shadow-lg',
      statLabel: 'text-emerald-100',
      postCard: 'border-emerald-400/50 bg-gradient-to-br from-emerald-500/20 to-violet-500/20',
      postText: 'text-emerald-950',
      postTitle: 'text-emerald-900 group-hover:text-emerald-700',
      postExcerpt: 'text-emerald-800',
      postCategory: 'bg-emerald-500/80 text-emerald-950 font-bold',
      postPinned: 'bg-emerald-600 text-emerald-950 font-bold',
      postDate: 'text-emerald-700',
      sectionTitle: 'text-emerald-100',
      sectionSubtitle: 'text-emerald-200',
      emojis: ['𓆝', '𓆟', '𓆞', '🌌', '🌠', '💫'],
      background: 'from-emerald-950 via-cyan-900 to-violet-950'
    }
  }

  const currentTheme = themeClasses[theme]

  const gravatarUrl = getGravatarUrl(user.email)
  const avatarUrl = user.avatarUrl || gravatarUrl

  const badges = []
  if (user.posts.length >= 5) badges.push({ text: "Escritor Activo", color: "bg-green-100 text-green-800" })
  if (followersCount >= 10) badges.push({ text: "Comunidad", color: "bg-blue-100 text-blue-800" })
  if (user.createdAt < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) badges.push({ text: "Veterano", color: "bg-purple-100 text-purple-800" })

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.background} py-8`}>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(5deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-5deg); }
        }
        .float-emoji-1 {
          animation: float 4s ease-in-out infinite;
          position: absolute;
        }
        .float-emoji-2 {
          animation: float-reverse 5s ease-in-out infinite;
          position: absolute;
        }
        .float-emoji-3 {
          animation: float 6s ease-in-out infinite;
          position: absolute;
        }
        .float-emoji-4 {
          animation: float-reverse 5.5s ease-in-out infinite;
          position: absolute;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card variant="hover" className={`relative mb-8 ${currentTheme.card} shadow-2xl`}>
          {/* Emoji Decorations */}
          <div className="absolute top-6 left-6 text-6xl float-emoji-1 opacity-50">{currentTheme.emojis[0]}</div>
          <div className="absolute top-12 right-8 text-7xl float-emoji-2 opacity-40">{currentTheme.emojis[1]}</div>
          <div className="absolute bottom-8 left-12 text-6xl float-emoji-3 opacity-45">{currentTheme.emojis[2]}</div>
          <div className="absolute bottom-4 right-6 text-7xl float-emoji-4 opacity-50">{currentTheme.emojis[3]}</div>
          <div className="absolute top-1/4 right-4 text-5xl float-emoji-1 opacity-35" style={{ animationDelay: '1s' }}>{currentTheme.emojis[4]}</div>
          <div className="absolute bottom-1/4 left-4 text-5xl float-emoji-2 opacity-40" style={{ animationDelay: '2s' }}>{currentTheme.emojis[5]}</div>

          <CardBody className="p-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex-shrink-0">
                <div className={`relative rounded-full border-4 shadow-2xl overflow-hidden ring-4 ${
                  theme === 'halloween' ? 'border-orange-300 ring-orange-500/30' :
                  theme === 'christmas' ? 'border-[#e6be9a] ring-[#e6be9a]/30' :
                  theme === 'cyberpunk' ? 'border-cyan-300 ring-cyan-500/50' :
                  'border-emerald-200 ring-emerald-400/50'
                }`}>
                  <Image
                    src={avatarUrl}
                    alt={`Foto de perfil de ${user.displayName || user.email}`}
                    width={120}
                    height={120}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover"
                    priority
                    unoptimized
                  />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className={`${currentTheme.title}`}>
                  {user.displayName || user.email.split('@')[0]}
                </h1>
                <p className={`text-lg font-semibold mt-2 ${
                  theme === 'halloween' ? 'text-orange-100' :
                  theme === 'christmas' ? 'text-[#e6be9a]' :
                  theme === 'cyberpunk' ? 'text-cyan-100' :
                  'text-emerald-100'
                }`}>
                  @{user.username || user.email.split('@')[0]}
                </p>

                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 mt-4">
                    {badges.map((badge, index) => (
                      <span key={index} className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badge.color} shadow-lg`}>
                        {badge.text}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6">
                  <div className={`text-center p-4 rounded-xl ${currentTheme.statBox}`}>
                    <div className={`text-3xl font-black ${currentTheme.stats[0]}`}>{user.posts.length}</div>
                    <div className={`text-sm font-bold mt-2 ${currentTheme.statLabel}`}>Posts</div>
                  </div>
                  <div className={`text-center p-4 rounded-xl ${currentTheme.statBox}`}>
                    <div className={`text-3xl font-black ${currentTheme.stats[1]}`}>{followersCount}</div>
                    <div className={`text-sm font-bold mt-2 ${currentTheme.statLabel}`}>Seguidores</div>
                  </div>
                  <div className={`text-center p-4 rounded-xl ${currentTheme.statBox}`}>
                    <div className={`text-3xl font-black ${currentTheme.stats[2]}`}>{followingCount}</div>
                    <div className={`text-sm font-bold mt-2 ${currentTheme.statLabel}`}>Siguiendo</div>
                  </div>
                  <div className={`text-center p-4 rounded-xl ${currentTheme.statBox} col-span-2 lg:col-span-1`}>
                    <div className={`text-sm font-black ${currentTheme.stats[3]}`}>{new Date(user.createdAt).toLocaleDateString('es-ES')}</div>
                    <div className={`text-xs font-bold mt-2 ${currentTheme.statLabel}`}>Miembro desde</div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <Button onClick={cycleTheme} variant="ghost" className={`flex items-center gap-2 ${currentTheme.button} px-6 py-3 rounded-xl`}>
                    <Palette className="w-5 h-5" />
                    Tema: {theme === 'halloween' ? '🎃 Halloween' : theme === 'christmas' ? '🎄 Navidad' : theme === 'cyberpunk' ? '🌃 Cyberpunk' : '🌌 Aurora'}
                  </Button>
                  {isOwnProfile ? (
                    <Link href="/settings">
                      <Button variant="outline" className="px-6 py-3 shadow-lg font-bold">Editar Perfil</Button>
                    </Link>
                  ) : authUser ? (
                    <FollowButton userId={user.id} initialIsFollowing={isFollowing} />
                  ) : null}
                </div>
              </div>
            </div>

            {user.bio && (
              <div className={`mt-8 p-6 rounded-2xl ${currentTheme.bio}`}>
                <div className={`prose prose-sm max-w-none font-semibold ${currentTheme.bioText}`}>
                  <ReactMarkdown>{user.bio}</ReactMarkdown>
                </div>
              </div>
            )}

            {(user.websiteUrl || user.githubUrl || user.publicEmail || user.facebookUrl || user.instagramUrl || user.linkedinUrl) && (
              <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start items-center">
                {user.websiteUrl && (
                  <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-5 py-3 ${currentTheme.button} rounded-xl group`}>
                    <Globe className="w-5 h-5 group-hover:scale-125 transition-transform" />
                    <span className="font-bold">Sitio Web</span>
                  </a>
                )}
                {user.githubUrl && (
                  <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-5 py-3 ${currentTheme.button} rounded-xl group`}>
                    <Github className="w-5 h-5 group-hover:scale-125 transition-transform" />
                    <span className="font-bold">GitHub</span>
                  </a>
                )}
                {user.facebookUrl && (
                  <a href={user.facebookUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-5 py-3 ${currentTheme.button} rounded-xl group`}>
                    <Facebook className="w-5 h-5 group-hover:scale-125 transition-transform" />
                    <span className="font-bold">Facebook</span>
                  </a>
                )}
                {user.instagramUrl && (
                  <a href={user.instagramUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-5 py-3 ${currentTheme.button} rounded-xl group`}>
                    <Instagram className="w-5 h-5 group-hover:scale-125 transition-transform" />
                    <span className="font-bold">Instagram</span>
                  </a>
                )}
                {user.linkedinUrl && (
                  <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-5 py-3 ${currentTheme.button} rounded-xl group`}>
                    <Linkedin className="w-5 h-5 group-hover:scale-125 transition-transform" />
                    <span className="font-bold">LinkedIn</span>
                  </a>
                )}
                {user.publicEmail && (
                  <div className={`flex items-center gap-2 px-5 py-3 ${currentTheme.button} rounded-xl`}>
                    <Mail className="w-5 h-5" />
                    <span className="font-bold text-sm">{user.publicEmail}</span>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className={`text-3xl font-black drop-shadow-lg ${currentTheme.sectionTitle}`}>
                {isOwnProfile ? 'Mis Publicaciones' : 'Publicaciones'}
              </h2>
              <p className={`mt-2 text-lg font-semibold ${currentTheme.sectionSubtitle}`}>
                {user.posts.length} posts públicos
              </p>
            </div>
            {isOwnProfile && (
              <Link href="/post/create">
                <Button variant="primary" className={`px-6 py-3 shadow-lg font-bold ${currentTheme.button}`}>
                  <FileText className="w-5 h-5 mr-2" />
                  Nuevo Post
                </Button>
              </Link>
            )}
          </div>
        </div>

        {postsWithLikes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsWithLikes.map((post) => {
              const excerpt = extractExcerpt(post.content, 100)
              const shouldFilter = post.isNSFW && (authUser?.nsfwProtection ?? true)

              return (
                <div key={post.id} className="h-full">
                  <NSFWFilter isNSFW={shouldFilter} categories={post.nsfwCategories || []}>
                    <Card variant="hover" className={`group h-full shadow-2xl hover:shadow-2xl transition-all border-2 ${currentTheme.postCard}`}>
                      {post.imageUrl && (
                        <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                      )}
                      <CardBody className="p-6 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 ring-2 ring-white/30">
                            {user.avatarUrl ? (
                              <Image src={user.avatarUrl} alt={user.displayName || user.email} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                {(user.displayName || user.email).charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className={`text-sm font-bold ${currentTheme.postText}`}>
                            {user.displayName || user.email.split('@')[0]}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {post.category && (
                            <span className={`inline-block px-3 py-1.5 rounded-full text-xs ${currentTheme.postCategory} shadow-lg`}>
                              {post.category.icon} {post.category.name}
                            </span>
                          )}
                          {post.isPinned && (
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs ${currentTheme.postPinned} shadow-lg`}>
                              <Pin className="w-3 h-3" /> Destacado
                            </span>
                          )}
                        </div>

                        <Link href={`/post/${post.slug}`}>
                          <h3 className={`text-xl font-bold mb-2 transition-all duration-300 line-clamp-2 ${currentTheme.postTitle}`}>
                            {post.title}
                          </h3>
                        </Link>

                        <p className={`text-sm mb-4 line-clamp-3 ${currentTheme.postExcerpt}`}>{excerpt}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/20">
                          <div className="flex items-center gap-3">
                            <p className={`text-xs font-semibold ${currentTheme.postDate}`}>{formatDate(post.createdAt)}</p>
                            <div className={`flex items-center gap-1 text-xs font-bold ${currentTheme.postDate}`}>
                              <Heart className="w-3 h-3 fill-current" />
                              <span>{post._count.likes}</span>
                            </div>
                          </div>
                          {isOwnProfile && <PinButton postId={post.id} initialIsPinned={post.isPinned} />}
                        </div>
                      </CardBody>
                    </Card>
                  </NSFWFilter>
                </div>
              )
            })}
          </div>
        ) : (
          <Card variant="elevated" className={`shadow-xl border-2 ${currentTheme.postCard}`}>
            <CardBody className="p-16 text-center">
              <FileText className={`w-20 h-20 mx-auto mb-6 ${
                theme === 'halloween' ? 'text-orange-400' :
                theme === 'christmas' ? 'text-[#e6be9a]' :
                theme === 'cyberpunk' ? 'text-cyan-400' :
                'text-emerald-400'
              }`} />
              <h3 className={`text-2xl font-bold mb-4 ${currentTheme.postText}`}>
                {isOwnProfile ? 'Aún no tienes publicaciones públicas' : 'Este usuario no tiene publicaciones públicas'}
              </h3>
              {isOwnProfile && (
                <>
                  <p className={`mb-8 text-lg font-semibold ${currentTheme.postExcerpt}`}>
                    Comienza a compartir tus ideas con el mundo
                  </p>
                  <Link href="/post/create">
                    <Button variant="primary" className={`px-8 py-3 text-lg shadow-lg font-bold ${currentTheme.button}`}>Crear mi primer post</Button>
                  </Link>
                </>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
