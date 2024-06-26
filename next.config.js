/** @type {import('next').NextConfig} */

const envImagesRemotePatterns = () => {
  const remotePatterns = [];
  const urls = process.env.NEXT_IMAGES_REMOTE_PATTERNS?.split(` `) || [];

  urls.map((url) => {
    try {
      url = new URL(url);
    } catch {}

    remotePatterns.push({
      // Set protocol, default using http, remove string `:`
      protocol: url?.protocol ? url.protocol.replace(`:`, ``) : 'http',

      // Hostname domain
      hostname: url?.hostname || url,

      // Set port if exists
      port: url?.port || undefined,

      // Set pathname if exist and when not only using `/`
      pathname:
        url?.pathname && url.pathname !== '/' ? url.pathname : undefined,
    });
  });

  return remotePatterns;
};

const nextConfig = {
  output: process.env.NODE_ENV == 'production' ? 'standalone' : undefined,
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      encoding: false,
      'pino-pretty': false,
    };

    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    return config;
  },
  images: {
    minimumCacheTTL: 7,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'robohash.org',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      ...envImagesRemotePatterns(),
    ],
  },
};

module.exports = nextConfig;
