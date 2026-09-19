import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["nodemailer", "bcryptjs"],
  allowedDevOrigins: ["14.97.242.234", "14.97.242.234:3000"],
};

export default nextConfig;
