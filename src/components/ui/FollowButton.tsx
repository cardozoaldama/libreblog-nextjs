'use client'

import { useState } from 'react'
import { UserPlus, UserMinus } from 'lucide-react'
import Button from './Button'

interface FollowButtonProps {
  userId: string
  initialIsFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

export default function FollowButton({ 
  userId, 
  initialIsFollowing, 
  onFollowChange 
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = async () => {
    setIsLoading(true)
    try {
      const method = isFollowing ? 'DELETE' : 'POST'
      const res = await fetch('/api/follows', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: userId }),
      })

      if (res.ok) {
        const newFollowingState = !isFollowing
        setIsFollowing(newFollowingState)
        onFollowChange?.(newFollowingState)
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'primary'}
      size="sm"
      onClick={handleFollow}
      isLoading={isLoading}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Dejar de seguir
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Seguir
        </>
      )}
    </Button>
  )
}