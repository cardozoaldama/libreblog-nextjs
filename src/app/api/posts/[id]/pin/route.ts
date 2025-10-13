import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true, isPinned: true },
    })

    if (!post || post.authorId !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const updated = await prisma.post.update({
      where: { id },
      data: { isPinned: !post.isPinned },
      select: { isPinned: true },
    })

    return NextResponse.json({ isPinned: updated.isPinned })
  } catch {
    return NextResponse.json({ error: 'Error al pinear post' }, { status: 500 })
  }
}
