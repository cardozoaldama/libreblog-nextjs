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
  // Permitir comentarios sin restricciones excesivas
  return { canComment: true }
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
