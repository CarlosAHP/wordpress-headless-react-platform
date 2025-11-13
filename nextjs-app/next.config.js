/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json',
  },
}

module.exports = nextConfig

