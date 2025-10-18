'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FollowButton from '@/components/ui/FollowButton'
import BlockUserButton from '@/components/ui/BlockUserButton'
import NSFWFilter from '@/components/ui/NSFWFilter'
import ThemeSelector from './ThemeSelector'
import { FileText, Pin, Heart, Globe, Github, Palette, Mail, Facebook, Instagram, Linkedin } from 'lucide-react'
import { formatDate, getGravatarUrl, extractExcerpt } from '@/lib/utils'
import PinButton from '@/components/post/PinButton'

import { ThemeName, profileThemes, allDecorations } from '@/lib/profileThemes'

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
  profileTheme?: string | null
  profileDecoration?: number | null
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
  const [theme, setTheme] = useState<ThemeName>((user.profileTheme as ThemeName) || 'aurora')
  const [decoration, setDecoration] = useState<number>(user.profileDecoration || 1)
  const [blockedUsers, setBlockedUsers] = useState<string[]>([])
  const [showThemeSelector, setShowThemeSelector] = useState(false)

  useEffect(() => {
    async function loadBlockedUsers() {
      if (!authUser) return
      try {
        const res = await fetch('/api/users/blocked')
        if (res.ok) {
          const data = await res.json()
          setBlockedUsers(data.blockedUsers || [])
        }
      } catch {
        // Ignorar errores
      }
    }
    loadBlockedUsers()
  }, [authUser])

  const currentTheme = profileThemes[theme]

  const gravatarUrl = getGravatarUrl(user.email)
  const avatarUrl = user.avatarUrl || gravatarUrl

  const badges = []
  if (user.posts.length >= 5) badges.push({ text: "Escritor Activo", color: "bg-green-100 text-green-800" })
  if (followersCount >= 10) badges.push({ text: "Comunidad", color: "bg-blue-100 text-blue-800" })
  if (user.createdAt < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) badges.push({ text: "Veterano", color: "bg-purple-100 text-purple-800" })

  return (
    <>
    {showThemeSelector && (
      <ThemeSelector
        currentTheme={theme}
        currentDecoration={decoration}
        onSave={(newTheme, newDecoration) => {
          setTheme(newTheme)
          setDecoration(newDecoration)
          setShowThemeSelector(false)
        }}
        onCancel={() => setShowThemeSelector(false)}
      />
    )}
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
              <div className="flex-shrink-0 relative">
                <div className={`relative rounded-full border-4 shadow-2xl overflow-hidden ring-4 ${currentTheme.avatarBorder}`}>
                  <Image
                    src={avatarUrl}
                    alt={`Foto de perfil de ${user.displayName || user.email}`}
                    width={180}
                    height={180}
                    className="w-36 h-36 sm:w-44 sm:h-44 object-cover"
                    priority
                    unoptimized
                  />
                </div>
                <Image
                  src={allDecorations[decoration - 1].src}
                  alt="Avatar decoration"
                  width={80}
                  height={80}
                  className="absolute -bottom-3 -right-3 w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  unoptimized
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className={`${currentTheme.title}`}>
                  {user.displayName || user.email.split('@')[0]}
                </h1>
                <p className={`text-lg font-semibold mt-2 ${currentTheme.username}`}>
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

                <div className="grid grid-cols-3 gap-4 mb-6 mt-6">
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
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-3 items-center">
                  {isOwnProfile ? (
                    <>
                      <Button onClick={() => setShowThemeSelector(true)} variant="ghost" className={`flex items-center gap-2 ${currentTheme.button} px-6 py-3 rounded-xl`}>
                        <Palette className="w-5 h-5" />
                        Cambiar tema
                      </Button>
                      <Link href="/settings">
                        <Button variant="ghost" className={`px-6 py-3 shadow-lg font-bold ${currentTheme.button} rounded-xl`}>Editar Perfil</Button>
                      </Link>
                      <span className={`text-sm ${currentTheme.username}`}>
                        Integrante desde {new Date(user.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </>
                  ) : authUser ? (
                    <>
                      <FollowButton userId={user.id} initialIsFollowing={isFollowing} />
                      <BlockUserButton userId={user.id} username={user.username || user.email.split('@')[0]} />
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {user.bio && (
              <div className={`mt-8 p-6 rounded-2xl ${currentTheme.bio}`}>
                <p className={`font-semibold ${currentTheme.bioText} whitespace-pre-wrap`}>
                  {user.bio}
                </p>
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
                <Button variant="ghost" className={`px-6 py-3 shadow-lg font-bold ${currentTheme.button} rounded-xl`}>
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
              const shouldFilter = !!(post.isNSFW && (authUser?.nsfwProtection ?? true))
              const isBlocked = blockedUsers.includes(post.authorId)

              return (
                <div key={post.id} className="h-full">
                  <NSFWFilter 
                    isNSFW={shouldFilter} 
                    authorId={post.authorId}
                    blockedUsers={blockedUsers}
                  >
                    <Card variant="hover" className={`group h-full shadow-2xl hover:shadow-2xl transition-all border-2 ${currentTheme.postCard} flex flex-col`}>
                      <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                        {post.imageUrl ? (
                          <>
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className={`object-cover group-hover:scale-110 transition-transform duration-300 ${shouldFilter || isBlocked ? 'blur-xl' : ''}`}
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </>
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${currentTheme.statBox}`}>
                            {post.category ? (
                              <div className="text-center">
                                <div className="text-6xl mb-2">{post.category.icon}</div>
                                <p className={`text-lg font-bold ${currentTheme.postText}`}>{post.category.name}</p>
                              </div>
                            ) : (
                              <FileText className={`w-20 h-20 ${currentTheme.emptyIcon}`} />
                            )}
                          </div>
                        )}
                      </div>
                      <CardBody className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 ring-2 ring-white/30">
                              {user.avatarUrl ? (
                                <Image src={user.avatarUrl} alt={user.displayName || user.email} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                  {(user.displayName || user.email).charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span className={`text-xs font-bold ${currentTheme.postText}`}>
                              {user.displayName || user.email.split('@')[0]}
                            </span>
                          </div>
                          {isOwnProfile && <PinButton postId={post.id} initialIsPinned={post.isPinned} />}
                        </div>

                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {post.category && (
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${currentTheme.postCategory} shadow-md`}>
                              {post.category.icon} {post.category.name}
                            </span>
                          )}
                          {post.isPinned && (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${currentTheme.postPinned} shadow-md`}>
                              <Pin className="w-3 h-3" /> Destacado
                            </span>
                          )}
                        </div>

                        <Link href={`/post/${post.slug}`}>
                          <h3 className={`text-lg font-bold mb-2 transition-all duration-300 line-clamp-2 ${currentTheme.postTitle}`}>
                            {post.title}
                          </h3>
                        </Link>

                        <p className={`text-sm mb-3 line-clamp-3 flex-1 ${currentTheme.postExcerpt}`}>{excerpt}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/20 mt-auto">
                          <p className={`text-xs font-semibold ${currentTheme.postDate}`}>{formatDate(post.createdAt)}</p>
                          <div className={`flex items-center gap-1 text-xs font-bold ${currentTheme.postDate}`}>
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            <span>{post._count.likes}</span>
                          </div>
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
              <FileText className={`w-20 h-20 mx-auto mb-6 ${currentTheme.emptyIcon}`} />
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
    </>
  )
}
