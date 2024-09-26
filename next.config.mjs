import withPlaiceholder from "@plaiceholder/next";


/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['localhost:3000', 'https://utfs.io'],
      path: '/_next/image',
      loader: 'default',
      unoptimized: false,
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'utfs.io',
          },
          {
            protocol: 'https',
            hostname: 'files.edgestore.dev',
          },
          {
            protocol: 'https',
            hostname: 'cdn.discordapp.com',
          },
          {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
          }
          ,
          {
            protocol: 'https',
            hostname: 'images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com',
          }
        ],
      },
      experimental: {
        missingSuspenseWithCSRBailout: false,
      },
};

export default withPlaiceholder(nextConfig);