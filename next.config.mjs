import withPlaiceholder from "@plaiceholder/next";


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

    images: {
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
          },
          {
            protocol: 'https',
            hostname: 'images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
          }
        ],
      }
};

export default withPlaiceholder(nextConfig);