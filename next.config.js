/** @type {import('next').NextConfig} */
const defaultConfig = {
  reactStrictMode: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });

  module.exports = withBundleAnalyzer(defaultConfig);
} else {
  module.exports = defaultConfig;
}
