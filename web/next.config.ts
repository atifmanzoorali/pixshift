import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // All API calls go to the FastAPI backend
  // NEXT_PUBLIC_API_URL is used in /src/lib/axios.ts
};

export default nextConfig;
