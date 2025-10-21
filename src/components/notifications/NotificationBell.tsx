'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  type: 'follow' | 'comment' | 'like' | 'comment_reply'
  postId: string | null
  commentId: string | null
  count: number
  isRead: boolean
  createdAt: string
  actors: Array<{ displayName: string; username: string; avatarUrl: string | null }>
  post?: { title: string; slug: string }
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
    
    // Polling cada 30 segundos para actualizar notificaciones
    const interval = setInterval(() => {
      loadNotifications()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=5')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
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
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking as read:', error)
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
        return `${actorName}${others} respondió tu comentario en "${notif.post?.title}"`
      default:
        return 'Nueva notificación'
    }
  }

  const getNotificationLink = (notif: Notification) => {
    if (notif.type === 'follow') {
      // Redirigir al perfil del primer actor que te siguió
      const firstActor = notif.actors[0]
      if (firstActor) {
        return `/profile/${firstActor.username || firstActor.displayName}`
      }
      return '/notifications'
    }
    if (notif.type === 'comment' || notif.type === 'like') {
      // Redirigir al post con anchor a comentarios
      if (notif.post?.slug) {
        return notif.type === 'comment' ? `/post/${notif.post.slug}#comments` : `/post/${notif.post.slug}`
      }
    }
    if (notif.type === 'comment_reply') {
      // Redirigir al post con anchor al comentario específico
      if (notif.post?.slug && notif.commentId) {
        return `/post/${notif.post.slug}#comment-${notif.commentId}`
      }
      if (notif.post?.slug) {
        return `/post/${notif.post.slug}#comments`
      }
    }
    return '/notifications'
  }

  if (isLoading) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-[#5f638f]/10 transition-colors"
      >
        <Bell className="w-5 h-5 text-[#0c2b4d]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-md bg-white rounded-xl shadow-2xl border border-[#5f638f]/20 z-50 overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-[#5f638f]/10">
              <h3 className="font-bold text-[#0c2b4d] text-sm sm:text-base">Notificaciones</h3>
            </div>

            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-[#5f638f] text-sm">
                  No tienes notificaciones
                </div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className="relative group">
                    <Link
                      href={getNotificationLink(notif)}
                      onClick={() => {
                        if (!notif.isRead) markAsRead(notif.id)
                        setShowDropdown(false)
                      }}
                      className={`block p-3 sm:p-4 hover:bg-[#5f638f]/5 transition-colors border-b border-[#5f638f]/10 ${
                        !notif.isRead ? 'bg-[#dedff1]/30' : ''
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-[#000022] break-words pr-6">
                        {getNotificationText(notif)}
                      </p>
                      <p className="text-[10px] sm:text-xs text-[#5f638f] mt-1">
                        {new Date(notif.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </Link>
                    <button
                      onClick={async (e) => {
                        e.preventDefault()
                        await fetch(`/api/notifications/${notif.id}`, { method: 'DELETE' })
                        loadNotifications()
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <Link
                href="/notifications"
                onClick={() => setShowDropdown(false)}
                className="block p-3 text-center text-sm font-medium text-[#0c2b4d] hover:bg-[#5f638f]/5 transition-colors"
              >
                Ver todas las notificaciones
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  )
}
