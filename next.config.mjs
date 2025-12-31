/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    typedRoutes: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-label",
    ],
    serverComponentsExternalPackages: [
      "@libsql/client",
      "@libsql/linux-x64-gnu",
      "@libsql/hrana-client",
      "libsql",
      "@prisma/adapter-libsql",
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
