import { describe, it, expect } from 'vitest'

describe('Build Configuration', () => {
  it('should have required environment variables defined', () => {
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'DATABASE_URL'
    ]
    
    requiredEnvVars.forEach(envVar => {
      expect(typeof process.env[envVar]).toBe('string')
    })
  })

  it('should validate Prisma schema can be generated', async () => {
    const { execSync } = await import('child_process')
    
    expect(() => {
      execSync('npx prisma validate', { stdio: 'pipe' })
    }).not.toThrow()
  })
})
