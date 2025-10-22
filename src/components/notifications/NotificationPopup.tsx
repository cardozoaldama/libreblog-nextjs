'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

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

export default function NotificationPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null)

  useEffect(() => {
    checkNotifications()
    const interval = setInterval(checkNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=1')
      if (res.ok) {
        const data = await res.json()
        if (data.notifications.length > 0) {
          const latest = data.notifications[0]
          if (!latest.isRead && latest.id !== lastNotificationId) {
            setNotification(latest)
            setShowPopup(true)
            setLastNotificationId(latest.id)
          }
        }
      }
    } catch (error) {
      console.error('Error checking notifications:', error)
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
      const firstActor = notif.actors[0]
      if (firstActor) {
        return `/profile/${firstActor.username || firstActor.displayName}`
      }
      return '/notifications'
    }
    if (notif.type === 'comment' || notif.type === 'like') {
      if (notif.post?.slug) {
        return notif.type === 'comment' ? `/post/${notif.post.slug}#comments` : `/post/${notif.post.slug}`
      }
    }
    if (notif.type === 'comment_reply') {
      if (notif.post?.slug && notif.commentId) {
        return `/post/${notif.post.slug}#comment-${notif.commentId}`
      }
      if (notif.post?.slug) {
        return `/post/${notif.post.slug}#comments`
      }
    }
    return '/notifications'
  }

  if (!showPopup || !notification) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-slide-in-right">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#5f638f]/30 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#000022] mb-1">
              {getNotificationText(notification)}
            </p>
            <p className="text-xs text-[#5f638f]">
              {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <button
            onClick={() => setShowPopup(false)}
            className="text-[#5f638f] hover:text-[#0c2b4d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Link
          href={getNotificationLink(notification)}
          onClick={() => setShowPopup(false)}
          className="block mt-3 text-center text-sm font-medium text-[#0c2b4d] hover:text-[#36234e] transition-colors"
        >
          Ver notificación →
        </Link>
      </div>
    </div>
  )
}
