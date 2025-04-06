/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure your base path matches your Netlify site URL
  basePath: '',
  trailingSlash: true,
}

module.exports = nextConfig 