import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow Cloud Shell domain for development */
  allowedDevOrigins: ['3000-cs-2bd10dc8-21ba-48be-b9b0-d208fc05bc11.cs-europe-west1-iuzs.cloudshell.dev'],
};

export default nextConfig;
