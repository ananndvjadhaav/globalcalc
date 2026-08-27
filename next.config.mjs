/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/categories",
        destination: "/calculators",
        permanent: true,
      },
      {
        source: "/categories/:slug",
        destination: "/calculators/:slug",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
