'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

interface Notification {
  id: string
  type: 'follow' | 'comment' | 'like' | 'comment_reply'
  postId: string | null
  count: number
  isRead: boolean
  createdAt: string
  actors: Array<{ displayName: string; avatarUrl: string | null }>
  post?: { title: string; slug: string }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)
  const [clearingRead, setClearingRead] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [page])

  const loadNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?page=${page}&limit=20`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setHasMore(data.hasMore)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PUT' })
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const markAllAsRead = async () => {
    setMarkingAll(true)
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT' })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    } finally {
      setMarkingAll(false)
    }
  }

  const clearReadNotifications = async () => {
    if (!confirm('¿Borrar todas las notificaciones leídas?')) return
    
    setClearingRead(true)
    try {
      await fetch('/api/notifications/clear-read', { method: 'DELETE' })
      loadNotifications()
    } catch (error) {
      console.error('Error clearing read notifications:', error)
    } finally {
      setClearingRead(false)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationText = (notif: Notification) => {
    const actorName = notif.actors[0]?.displayName || 'Alguien'
    const others = notif.count > 1 ? ` y ${notif.count - 1} más` : ''

    switch (notif.type) {
      case 'follow':
        return `${actorName}${others} te siguió`
      case 'comment':
        return `${actorName}${others} comentó en "${notif.post?.title}"`
      case 'like':
        return `${actorName}${others} le gustó "${notif.post?.title}"`
      case 'comment_reply':
        return `${actorName}${others} respondió tu comentario`
      default:
        return 'Nueva notificación'
    }
  }

  const getNotificationLink = (notif: Notification) => {
    if (notif.type === 'follow') return '/profile'
    if (notif.postId && notif.post?.slug) return `/post/${notif.post.slug}`
    return '/notifications'
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0c2b4d]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dedff1] via-[#dedff1] to-[#5f638f]/20 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        <Card variant="hover">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#0c2b4d]" />
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#0c2b4d] to-[#5f638f] bg-clip-text text-transparent">
                  Notificaciones
                </h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    isLoading={markingAll}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Marcar leídas
                  </Button>
                )}
                {notifications.some(n => n.isRead) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearReadNotifications}
                    isLoading={clearingRead}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    🗑️ Limpiar leídas
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardBody>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto text-[#5f638f]/30 mb-4" />
                <p className="text-[#5f638f] text-lg">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map(notif => (
                  <div key={notif.id} className="relative group">
                    <Link
                      href={getNotificationLink(notif)}
                      onClick={() => !notif.isRead && markAsRead(notif.id)}
                      className={`block p-3 sm:p-4 rounded-xl hover:bg-[#5f638f]/5 transition-all duration-200 border ${
                        !notif.isRead
                          ? 'bg-[#dedff1]/50 border-[#0c2b4d]/20'
                          : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0 pr-8">
                          <p className="text-sm sm:text-base text-[#000022] font-medium break-words">
                            {getNotificationText(notif)}
                          </p>
                          <p className="text-sm text-[#5f638f] mt-1">
                            {new Date(notif.createdAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <div className="w-2 h-2 bg-[#0c2b4d] rounded-full mt-2" />
                        )}
                      </div>
                    </Link>
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Borrar notificación"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {(page > 1 || hasMore) && (
              <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-[#5f638f]/10">
                {page > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p - 1)}
                  >
                    Anterior
                  </Button>
                )}
                {hasMore && (
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                  >
                    Siguiente
                  </Button>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
