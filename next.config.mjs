/** @type {import('next').NextConfig} */
const nextConfig = {
      output: 'export',
      distDir: 'dist',
      webpack: (config, options) => {
    return config;
  },
};

export default nextConfig;
