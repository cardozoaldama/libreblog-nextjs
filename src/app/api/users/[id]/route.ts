import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        websiteUrl: true,
        githubUrl: true,
        facebookUrl: true,
        instagramUrl: true,
        xUrl: true,
        tiktokUrl: true,
        linkedinUrl: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (authUser.id !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { displayName, bio, avatarUrl, websiteUrl, githubUrl, facebookUrl, instagramUrl, xUrl, tiktokUrl, linkedinUrl } = await request.json()

    const user = await prisma.user.update({
      where: { id },
      data: {
        displayName: displayName || null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
        websiteUrl: websiteUrl || null,
        githubUrl: githubUrl || null,
        facebookUrl: facebookUrl || null,
        instagramUrl: instagramUrl || null,
        xUrl: xUrl || null,
        tiktokUrl: tiktokUrl || null,
        linkedinUrl: linkedinUrl || null,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (authUser.id !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Eliminar usuario de la base de datos (CASCADE eliminará posts)
    await prisma.user.delete({
      where: { id },
    })

    // Eliminar de Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(id)
    
    if (error) {
      console.error('Error deleting from Supabase Auth:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}