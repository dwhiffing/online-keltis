/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/online-keltis' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/online-keltis/' : '',
  reactStrictMode: true,
}

module.exports = nextConfig
