/** @type {import('next').NextConfig} */
const nextConfig = {
     // Enable React strict mode
  reactStrictMode: true,

  // Customize Webpack configuration
  webpack: (config, { isServer }) => {
    // Example: Handle server-only or client-only code
    if (!isServer) {
      // Mock Node.js-specific modules on the client side
      config.resolve.fallback = {
        fs: false, // Ignore file system module on the client side
        path: false, // Ignore path module on the client side
      };
    }

    // Add other custom rules or loaders if needed
    return config;
  },
};

export default nextConfig;
