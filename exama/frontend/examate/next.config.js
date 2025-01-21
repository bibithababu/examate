/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:false
}

// next.config.js

module.exports = {
    async headers() {
      return [
        {
          // Define the headers you want to set
          source: '/',
          headers: [
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'require-corp',
            },
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin',
            },
          ],
        },
      ];
    },
  };
  

module.exports = nextConfig
