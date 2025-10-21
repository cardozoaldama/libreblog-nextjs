import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Post as PostType, User as UserType, Category as CategoryType } from '@prisma/client'
import { createClient } from '@/lib/supabase/server'
import Button from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { ArrowLeft, Edit } from 'lucide-react'
import DeletePostButton from '@/components/posts/DeletePostButton'
import { formatDate, getGravatarUrl, getVideoEmbed } from '@/lib/utils'
import PostActions from '@/components/post/PostActions'
import GeneratePDFButton from '@/components/post/GeneratePDFButton'
import PostReaderWithTOC from '@/components/post/PostReaderWithTOC'
import CommentSection from '@/components/comments/CommentSection'


// Definir la interfaz de props con params async
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ViewPostPage({ params }: PageProps) {
  // Await params para obtener el slug
  const { slug } = await params;
  
  const post = (await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
    },
  })) as (PostType & { author: UserType; category: CategoryType | null }) | null

  if (!post) {
    notFound()
  }

  // Verificar autenticación
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirigir a login si no está autenticado
  if (!user) {
    redirect('/login')
  }

  const isAuthor = user.id === post.authorId

  // Si el post no es público y el usuario no es el autor, no mostrar
  if (!post.isPublic && !isAuthor) {
    notFound()
  }

  const authorAvatarUrl = post.author.avatarUrl || getGravatarUrl(post.author.email)
  const videoEmbed = post.videoUrl ? getVideoEmbed(post.videoUrl) : { type: null, embedUrl: null }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between animate-in fade-in slide-in-from-top duration-500">
          <Link href="/explore">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          {isAuthor && (
            <div className="flex gap-2">
              <Link href={`/post/edit/${post.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <DeletePostButton postId={post.id} postTitle={post.title} />
            </div>
          )}
        </div>

        <div>


          <div className="max-w-6xl mx-auto">
            <Card variant="elevated" className="animate-in fade-in slide-in-from-bottom duration-700 delay-200 overflow-hidden">
              <CardBody className="p-0">
                {/* Hero Section with Gradient */}
                <div className="relative bg-gradient-to-br from-[#0c2b4d] via-[#36234e] to-[#5f638f] p-8 md:p-12">
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
                  <div className="relative z-10">
                    {/* Status Badge */}
                    {!post.isPublic && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-yellow-400 text-[#000022] shadow-lg">
                          📝 Borrador (solo tú puedes verlo)
                        </span>
                      </div>
                    )}

                    {/* Category */}
                    {post.category && (
                      <div className="mb-6">
                        <Link
                          href={`/explore?category=${post.category.id}`}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-[#dedff1]/90 text-[#0c2b4d] hover:bg-[#dedff1] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <span className="text-lg mr-2">{post.category.icon}</span>
                          {post.category.name}
                        </Link>
                      </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-black text-[#dedff1] mb-6 leading-tight drop-shadow-lg">
                      {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/profile/${post.author.username || post.author.email.split('@')[0]}`}
                        className="flex items-center gap-3 bg-[#000022]/30 backdrop-blur-sm px-4 py-3 rounded-full hover:bg-[#000022]/50 transition-all duration-300 group"
                      >
                        <Image
                          src={authorAvatarUrl}
                          alt={`Foto de perfil de ${post.author.displayName || post.author.email}`}
                          width={48}
                          height={48}
                          className="rounded-full border-2 border-[#dedff1]/50 group-hover:border-[#dedff1] transition-colors"
                          unoptimized
                        />
                        <div>
                          <p className="font-bold text-[#dedff1] group-hover:text-white transition-colors">
                            {post.author.displayName || post.author.email.split('@')[0]}
                          </p>
                          <p className="text-sm text-[#dedff1]/70">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                {post.imageUrl && (
                  <div className="-mt-20 mb-8 px-8 md:px-12">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#dedff1] group">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={1200}
                        height={700}
                        className="w-full transition-transform duration-500 group-hover:scale-105"
                        priority
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000022]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                )}

                {/* Content with integrated TOC */}
                <div className="px-8 md:px-12 pb-8">
                  <PostReaderWithTOC
                    content={post.content}
                    enablePagination={post.enablePagination ?? false}
                    showTableOfContents={post.showTableOfContents ?? true}
                  />
                </div>

                {/* Video Embed (YouTube, TikTok, Facebook) */}
                {videoEmbed.embedUrl && (
                  <div className="px-8 md:px-12 pb-8">
                    <div className={`${videoEmbed.type === 'tiktok' ? 'max-w-[325px] mx-auto' : 'aspect-video'} rounded-2xl overflow-hidden shadow-2xl border-4 border-[#5f638f]/30`}>
                      <iframe
                        src={videoEmbed.embedUrl}
                        className={`w-full ${videoEmbed.type === 'tiktok' ? 'h-[738px]' : 'h-full'}`}
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        title="Video embebido"
                      />
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-8 md:px-12 pb-8">
                  <div className="pt-8 border-t-2 border-[#5f638f]/20">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <PostActions 
                        postId={post.id} 
                        isAuthor={isAuthor}
                        initialIsPinned={post.isPinned}
                      />
                      {post.allowPdfDownload && <GeneratePDFButton postId={post.id} />}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Comments Section */}
            <Card variant="elevated" className="mt-8 animate-in fade-in slide-in-from-bottom duration-700 delay-400 overflow-hidden">
              <CardBody>
                <CommentSection
                  postId={post.id}
                  postAuthorId={post.authorId}
                  allowComments={post.allowComments ?? true}
                  currentUserId={user?.id}
                />
              </CardBody>
            </Card>

            {/* Author Card */}
            <Card variant="elevated" className="mt-8 animate-in fade-in slide-in-from-bottom duration-700 delay-500 overflow-hidden">
              <CardBody className="p-0">
                <div className="bg-gradient-to-r from-[#36234e]/10 to-[#5f638f]/10 p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#0c2b4d] to-[#36234e] rounded-full blur opacity-50"></div>
                      <Image
                        src={authorAvatarUrl}
                        alt={`Foto de perfil de ${post.author.displayName || post.author.email}`}
                        width={64}
                        height={64}
                        className="relative rounded-full border-2 border-[#dedff1]"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold bg-gradient-to-r from-[#0c2b4d] to-[#36234e] bg-clip-text text-transparent">
                        {post.author.displayName || post.author.email.split('@')[0]}
                      </h3>
                      {post.author.bio && (
                        <p className="text-[#5f638f] text-sm mt-1">{post.author.bio}</p>
                      )}
                    </div>
                    <Link href={`/profile/${post.author.username || post.author.email.split('@')[0]}`}>
                      <Button variant="primary" size="sm" className="shadow-lg hover:shadow-xl transition-shadow">
                        Ver Perfil
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
