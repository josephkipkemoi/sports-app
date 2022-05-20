const path = require('path');
const withFonts = require('next-fonts');

const baseConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx'],
    images: {
      disableStaticImages: true,
      domains: ['images.ctfassets.net'],
    },
    webpack(config) {
        config.resolve.modules = [...config.resolve.modules, path.resolve('./')]
        return config
    },
    compiler: {
        styledComponents: true
    }
}
 
module.exports = [withFonts].reduce(
    (a,b) => b(a),
    baseConfig
)