/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "kfcvn-static.cognizantorderserv.com",
      "static.kfcvietnam.com.vn",
      "firebasestorage.googleapis.com",
      "raw.githubusercontent.com",
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
