/** @type {import('next').NextConfig} */
const nextConfig = {
      reactStrictMode: true,
      output: 'export',
      distDir: 'dist',
      webpack: (config, options) => {
          return config;
      },
};

export default nextConfig;
