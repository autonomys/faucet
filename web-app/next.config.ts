import type { NextConfig } from 'next'

// Import plugins in a CommonJS-compatible way
// since many Next.js plugins still use CommonJS under the hood
// @ts-ignore
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

// @ts-ignore
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/\/_not-found\/page-.*\.js$/],
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
})

const baseConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // e.g. serverActions: true
  },
  images: {
    // e.g. domains: ['example.com']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false }
    }
    return config
  }
}

const KEYS_TO_OMIT = ['webpackDevMiddleware', 'configOrigin', 'target', 'analyticsId', 'webpack5', 'amp', 'assetPrefix']

// Final export function for typed Next.js config
const nextConfig = (_phase: string, { defaultConfig }: { defaultConfig: NextConfig }) => {
  const plugins: [any, Record<string, any>?][] = [[withPWA], [withBundleAnalyzer, {}]]

  const wConfig = plugins.reduce((acc, [plugin, pluginConfig = {}]) => plugin({ ...acc, ...pluginConfig }), {
    ...defaultConfig,
    ...baseConfig
  })

  const finalConfig: Record<string, any> = {}
  Object.keys(wConfig).forEach((key) => {
    if (!KEYS_TO_OMIT.includes(key)) {
      finalConfig[key] = wConfig[key]
    }
  })

  return finalConfig
}

export default nextConfig
