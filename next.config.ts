/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['encrypted-tbn0.gstatic.com', 'i.ytimg.com', 't4.ftcdn.net', 'static.vecteezy.com', 't3.ftcdn.net'],
  },
};

module.exports = nextConfig;