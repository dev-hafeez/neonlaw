/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dev.recht-viehweger.de' },
      // optional: { protocol: 'https', hostname: 'dev.recht-viehweger.de', pathname: '/wp-content/uploads/**' },
    ],
    // unoptimized: true, // only if you want to disable Next image optimization
  },
};

export default nextConfig;
