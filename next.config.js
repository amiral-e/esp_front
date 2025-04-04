/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  webpack: (config, { dev, isServer }) => {
    // Activer les source maps en développement
    if (dev && !isServer) {
      config.devtool = "source-map";
    }

    return config;
  },
};

module.exports = nextConfig;
