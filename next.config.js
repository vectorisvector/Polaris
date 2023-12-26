/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.globalObject = "self";
    }

    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: "worker-loader",
      options: {
        filename: "static/[hash].worker.js",
        publicPath: "/_next/",
      },
    });

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
