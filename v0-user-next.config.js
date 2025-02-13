/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sjc.microlink.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Add error handling for stream responses
  onError: (error, req, res) => {
    console.error("Server error:", error)
    res.statusCode = 500
    res.end("Internal Server Error")
  },
  // Ensure consistent response IDs
  generateEtags: false,
}

module.exports = nextConfig

