/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    {
      source: "/",
      destination: "/cms",
      permanent: true,
    },
    {
      source: "/auth",
      destination: "/auth/login",
      permanent: true,
    },
  ],
  env: {
    APP_VERSION: "1.0.0",
    BASE_META_TITLE: "Hitori Wellness | Admin",
    BASE_META_DESCRIPTION: "Hitori Wellness Admin Dashboard",
    BASE_IMAGE_URL: "storage.googleapis.com/gym-reservation/",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "audioadsmaker-bucket.s3.ap-northeast-1.amazonaws.com",
        port: "",
        pathname: "/gym/**",
      },
    ],
  },
};

export default nextConfig;
