/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is the guaranteed fix.
  // It reads your secrets on the server and safely exposes them
  // to the browser-side code with the 'NEXT_PUBLIC_' prefix.
  env: {
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
  },
}

module.exports = nextConfig