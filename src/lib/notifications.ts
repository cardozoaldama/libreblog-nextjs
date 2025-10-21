import { prisma } from './prisma'

type NotificationType = 'follow' | 'comment' | 'like' | 'comment_reply'

/**
 * Crear o actualizar notificación agregada
 * Tipos:
 * - follow: Alguien te siguió
 * - comment: Alguien comentó tu post
 * - like: Alguien dio like a tu post
 * - comment_reply: Alguien respondió tu comentario
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  actorId: string,
  postId?: string,
  commentId?: string
) {
  // No notificar a uno mismo
  if (userId === actorId) return

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días

  // Buscar notificación existente para agregar
  const existing = await prisma.notification.findUnique({
    where: {
      userId_type_postId_commentId: {
        userId,
        type,
        postId: postId || null,
        commentId: commentId || null
      }
    }
  })

  if (existing) {
    // Actualizar existente (agregación)
    if (!existing.actorIds.includes(actorId)) {
      await prisma.notification.update({
        where: { id: existing.id },
        data: {
          actorIds: { push: actorId },
          count: { increment: 1 },
          isRead: false,
          updatedAt: new Date(),
          expiresAt // Renovar TTL
        }
      })

      // Incrementar contador
      await prisma.user.update({
        where: { id: userId },
        data: { unreadNotifications: { increment: 1 } }
      })
    }
  } else {
    // Crear nueva
    await prisma.notification.create({
      data: {
        userId,
        type,
        postId,
        commentId,
        actorIds: [actorId],
        count: 1,
        expiresAt
      }
    })

    // Incrementar contador
    await prisma.user.update({
      where: { id: userId },
      data: { unreadNotifications: { increment: 1 } }
    })
  }
}

export async function markAsRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  })

  if (notification && !notification.isRead && notification.userId === userId) {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })

    // Decrementar contador
    await prisma.user.update({
      where: { id: userId },
      data: {
        unreadNotifications: {
          decrement: notification.count
        }
      }
    })
  }
}

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  })

  await prisma.user.update({
    where: { id: userId },
    data: { unreadNotifications: 0 }
  })
}

export async function cleanExpiredNotifications() {
  const deleted = await prisma.notification.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  })

  console.log(`🗑️ Eliminadas ${deleted.count} notificaciones expiradas`)
  return deleted.count
}
