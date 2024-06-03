/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://storage.googleapis.com/;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    connect-src 'self' https://api.hitoriwellness.jp/ https://dev.api.hitoriwellness.jp/ https://gymapi.reddtech.ai/;`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
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
    BASE_META_TITLE: "HITORI WELLNESS | ADMIN",
    BASE_META_DESCRIPTION: "Hitori Wellness Admin Dashboard",
    BASE_IMAGE_URL: "storage.googleapis.com/gym-reservation/",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com/gym-reservation/",
        port: "",
        pathname: "/gym/**",
      },
    ],
  },
};

export default nextConfig;
