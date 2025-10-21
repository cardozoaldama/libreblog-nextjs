import { prisma } from './prisma'

/**
 * Reglas de comentarios:
 * - Usuario normal: 1 comentario inicial + puede responder a quien le responda (máx 2 total)
 * - Autor del post: hasta 10 comentarios/respuestas
 * - Usuarios pueden responderse entre ellos 1 vez
 */

export async function canUserComment(
  userId: string,
  postId: string,
  postAuthorId: string,
  parentId?: string
): Promise<{ canComment: boolean; reason?: string }> {
  const isAuthor = userId === postAuthorId

  // Contar comentarios del usuario en este post
  const userComments = await prisma.comment.count({
    where: { postId, userId }
  })

  // Autor puede hacer hasta 10 comentarios
  if (isAuthor) {
    if (userComments >= 10) {
      return { canComment: false, reason: 'Has alcanzado el límite de 10 comentarios' }
    }
    return { canComment: true }
  }

  // Usuario normal
  if (!parentId) {
    // Comentario inicial
    if (userComments >= 1) {
      return { canComment: false, reason: 'Ya has comentado en este post' }
    }
    return { canComment: true }
  }

  // Es una respuesta
  if (userComments >= 2) {
    return { canComment: false, reason: 'Has alcanzado el límite de comentarios' }
  }

  // Verificar a quién está respondiendo
  const parentComment = await prisma.comment.findUnique({
    where: { id: parentId },
    select: { userId: true }
  })

  if (!parentComment) {
    return { canComment: false, reason: 'Comentario padre no encontrado' }
  }

  // Puede responder si:
  // 1. Le está respondiendo al autor del post
  // 2. Le está respondiendo a alguien que le respondió a él
  const userHasCommented = await prisma.comment.findFirst({
    where: {
      postId,
      userId,
      parentId: null // Su comentario inicial
    }
  })

  if (parentComment.userId === postAuthorId) {
    // Respondiendo al autor
    return { canComment: true }
  }

  // Verificar si el padre es una respuesta a su comentario
  if (userHasCommented) {
    const isReplyToUser = await prisma.comment.findFirst({
      where: {
        id: parentId,
        parentId: userHasCommented.id
      }
    })

    if (isReplyToUser) {
      return { canComment: true }
    }
  }

  return { canComment: false, reason: 'Solo puedes responder al autor o a quien te respondió' }
}

export async function canUserEditComment(userId: string, commentId: string): Promise<boolean> {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true }
  })

  return comment?.userId === userId
}

export async function canUserDeleteComment(
  userId: string,
  commentId: string,
  postAuthorId: string
): Promise<boolean> {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true }
  })

  if (!comment) return false

  // Puede eliminar si es su comentario o si es el autor del post
  return comment.userId === userId || userId === postAuthorId
}
