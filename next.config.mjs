import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from 'next/dist/shared/lib/constants';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        unoptimized: true,
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'www.placehold.co'
            },{
                protocol: 'https',
                hostname: 'www.watchart.com'
            }, {
                protocol: 'https',
                hostname: 'ttwatches.com'
            }, {
                protocol: 'https',
                hostname: 'www.rdwatch.com.tw'
            }, {
                protocol: 'https',
                hostname: 'www.999watch.com'
            }, {
                protocol: 'https',
                hostname: 'www.369rolexwatch.com'
            }, {
                protocol: 'https',
                hostname: 'www.watchart.com'
            }, {
                protocol: 'https',
                hostname: 'watchstore.tw'
            }, {
                protocol: 'https',
                hostname: 'www.watchart.com'
            }, {
                protocol: 'https',
                hostname: 's.yimg.com'
            }, {
                protocol: 'https',
                hostname: 'www.goodtimezone.com.tw'
            }, {
                protocol: 'https',
                hostname: 'www.emc2watches.com'
            }, {
                protocol: 'http',
                hostname: 'www.playwatch.com.tw'
            }, {
                protocol: "https",
                hostname:"www.egps.com.tw"
            }
        ]
    },
    experimental:{
        esmExternals: "loose", // <-- add this
        serverComponentsExternalPackages: ["mongoose"] // <-- and this
    },
    webpack: (config) => {
        return config;
      },
};





export default nextConfig;
