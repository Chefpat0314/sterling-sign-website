/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force port 3000 for development
  devServer: {
    port: 3000,
  },
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
}

module.exports = nextConfig
