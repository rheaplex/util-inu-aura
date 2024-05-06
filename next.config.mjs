/** @type {import('next').NextConfig} */
const nextConfig = {
      reactStrictMode: true,
      output: 'export',
      trailingSlash: true,
      distDir: 'dist',
      images: { unoptimized: true },
      webpack: (config, options) => {
          return config;
      },
      experimental: {
          missingSuspenseWithCSRBailout: false,
      },
};

export default nextConfig;
