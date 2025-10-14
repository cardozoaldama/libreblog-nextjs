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

    const supabase = await createClient()
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, public_email, username_last_changed, display_name, bio, avatar_url, website_url, github_url, facebook_url, instagram_url, x_url, tiktok_url, linkedin_url, created_at')
      .eq('id', id)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      publicEmail: user.public_email,
      usernameLastChanged: user.username_last_changed,
      displayName: user.display_name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      websiteUrl: user.website_url,
      githubUrl: user.github_url,
      facebookUrl: user.facebook_url,
      instagramUrl: user.instagram_url,
      xUrl: user.x_url,
      tiktokUrl: user.tiktok_url,
      linkedinUrl: user.linkedin_url,
      createdAt: user.created_at,
    })
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

    const { username, publicEmail, usernameLastChanged, displayName, bio, avatarUrl, websiteUrl, githubUrl, facebookUrl, instagramUrl, xUrl, tiktokUrl, linkedinUrl } = await request.json()

    // Validar username si cambió
    if (username) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('id', id)
        .single()

      if (existingUser && username.toLowerCase() !== existingUser.username) {
        const { data: usernameExists } = await supabase
          .from('users')
          .select('id')
          .eq('username', username.toLowerCase())
          .single()

        if (usernameExists) {
          return NextResponse.json(
            { error: 'Username no disponible' },
            { status: 400 }
          )
        }
      }
    }

    const updateData: any = {
      display_name: displayName || null,
      bio: bio || null,
      avatar_url: avatarUrl || null,
      website_url: websiteUrl || null,
      github_url: githubUrl || null,
      facebook_url: facebookUrl || null,
      instagram_url: instagramUrl || null,
      x_url: xUrl || null,
      tiktok_url: tiktokUrl || null,
      linkedin_url: linkedinUrl || null,
    }

    if (username !== undefined) {
      updateData.username = username.toLowerCase()
      updateData.username_last_changed = new Date().toISOString()
    }

    if (publicEmail !== undefined) {
      updateData.public_email = publicEmail || null
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

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