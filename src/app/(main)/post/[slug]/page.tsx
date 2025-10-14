import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Post as PostType, User as UserType, Category as CategoryType } from '@prisma/client'
import { createClient } from '@/lib/supabase/server'
import Button from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { ArrowLeft, Edit } from 'lucide-react'
import DeletePostButton from '@/components/posts/DeletePostButton'
import { formatDate, getGravatarUrl, extractYouTubeId } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PostActions from '@/components/post/PostActions'


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

  // Verificar permisos
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthor = user?.id === post.authorId

  // Si el post no es público y el usuario no es el autor, no mostrar
  if (!post.isPublic && !isAuthor) {
    notFound()
  }

  const authorAvatarUrl = post.author.avatarUrl || getGravatarUrl(post.author.email)
  const youtubeId = post.videoUrl ? extractYouTubeId(post.videoUrl) : null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
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

        <Card variant="elevated">
          <CardBody className="p-8 md:p-12">
            {/* Status Badge */}
            {!post.isPublic && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  📝 Borrador (solo tú puedes verlo)
                </span>
              </div>
            )}

            {/* Category */}
            {post.category && (
              <div className="mb-4">
                <Link
                  href={`/explore?category=${post.category.id}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  {post.category.icon} {post.category.name}
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
              <Link
                href={`/profile/${post.author.email.split('@')[0]}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Image
                  src={authorAvatarUrl}
                  alt={`Foto de perfil de ${post.author.displayName || post.author.email}`}
                  width={48}
                  height={48}
                  className="rounded-full"
                  unoptimized
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {post.author.displayName || post.author.email.split('@')[0]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </Link>
              

            </div>

            {/* Featured Image */}
            {post.imageUrl && (
              <div className="mb-8">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={1200}
                  height={700}
                  className="w-full rounded-lg shadow-lg"
                  priority
                  unoptimized
                />
              </div>
            )}

            {/* Content */}
            <article className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </article>

            {/* YouTube Video */}
            {youtubeId && (
              <div className="mt-8">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    className="w-full h-full rounded-lg shadow-lg"
                    allowFullScreen
                    title="YouTube video"
                  />
                </div>
              </div>
            )}

            {/* Post Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <PostActions 
                postId={post.id} 
                isAuthor={isAuthor}
                initialIsPinned={post.isPinned}
              />
            </div>
          </CardBody>
        </Card>

        {/* Author Card */}
        <Card variant="elevated" className="mt-8">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <Image
                src={authorAvatarUrl}
                alt={`Foto de perfil de ${post.author.displayName || post.author.email}`}
                width={64}
                height={64}
                className="rounded-full"
                unoptimized
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {post.author.displayName || post.author.email.split('@')[0]}
                </h3>
                {post.author.bio && (
                  <p className="text-gray-600 text-sm mt-1">{post.author.bio}</p>
                )}
              </div>
              <Link href={`/profile/${post.author.email.split('@')[0]}`}>
                <Button variant="outline" size="sm">
                  Ver Perfil
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}