import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    reactRemoveProperties: { properties: ['^data-testid$', '^data-testdata$'] },
  },
};

export default nextConfig;
