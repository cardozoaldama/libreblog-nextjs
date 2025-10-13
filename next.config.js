/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com',
      'jewfdpsayjekmsyhwugb.supabase.co',
      'www.gravatar.com'
    ],
  },
}

module.exports = nextConfig