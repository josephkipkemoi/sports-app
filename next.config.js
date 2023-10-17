const path = require('path');
const withFonts = require('next-fonts');

const baseConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx'],
    images: {
      disableStaticImages: true,
      domains: ['media.api-sports.io', 'www.pinaclebet.co.ke', 'ke.pinaclebet.co.ke'],
    },
    webpack(config) {
        config.resolve.modules = [...config.resolve.modules, path.resolve('./')]
        return config
    },
    compiler: {
        styledComponents: true
    },
    pwa: {
        dest: 'public',
        register: true,
        skipWaiting: true,
    }
}
 
module.exports = [withFonts].reduce(
    (a,b) => b(a),
    baseConfig
)
