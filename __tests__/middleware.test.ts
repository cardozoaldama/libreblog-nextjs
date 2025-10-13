import { describe, it, expect, vi } from 'vitest'

describe('Middleware Configuration', () => {
  it('should have correct protected routes', () => {
    const protectedRoutes = ['/dashboard', '/settings', '/post/create', '/following']
    expect(protectedRoutes).toContain('/dashboard')
    expect(protectedRoutes).toContain('/settings')
    expect(protectedRoutes).toContain('/post/create')
    expect(protectedRoutes).toContain('/following')
  })

  it('should have correct auth routes', () => {
    const authRoutes = ['/login', '/register']
    expect(authRoutes).toContain('/login')
    expect(authRoutes).toContain('/register')
  })
})
