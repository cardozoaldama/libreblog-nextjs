import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Hash SHA-1 de la contraseña
    const sha1Hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase()
    const prefix = sha1Hash.substring(0, 5)
    const suffix = sha1Hash.substring(5)

    // Consultar HaveIBeenPwned API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'User-Agent': 'LibreBlog-Security-Check'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ isCompromised: false, count: 0 })
    }

    const data = await response.text()
    const lines = data.split('\n')
    
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':')
      if (hashSuffix === suffix) {
        return NextResponse.json({ 
          isCompromised: true, 
          count: parseInt(count.trim()) 
        })
      }
    }

    return NextResponse.json({ isCompromised: false, count: 0 })
  } catch (error) {
    console.error('Error checking password:', error)
    return NextResponse.json({ isCompromised: false, count: 0 })
  }
}