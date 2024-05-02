/** @type {import('next').NextConfig} */
const nextConfig = {
      reactStrictMode: true,
      output: 'export',
      distDir: 'dist',
      images: { unoptimized: true },
      webpack: (config, options) => {
          return config;
      },
};

export default nextConfig;
