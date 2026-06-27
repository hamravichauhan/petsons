import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Moved from experimental in Next.js 16
  serverExternalPackages: [
    '@libsql/client',
    'libsql',
    '@libsql',
    'esbuild',
    'esbuild-register',
    'drizzle-kit',
    'drizzle-orm',
    'pg',
    'sharp',
  ],
}

export default withPayload(nextConfig)
