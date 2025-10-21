import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: { 
        author: {
          select: {
            displayName: true,
            email: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (!post.allowPdfDownload) {
      return NextResponse.json({ error: 'PDF download not allowed' }, { status: 403 })
    }

    return NextResponse.json({
      title: post.title,
      content: post.content,
      coverImage: post.imageUrl,
      author: post.author.displayName || post.author.email.split('@')[0],
      createdAt: post.createdAt
    })
  } catch (error) {
    console.error('Error fetching post for PDF:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
