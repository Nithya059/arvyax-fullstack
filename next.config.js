/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // fixes the “workspace root inferred” warning
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;