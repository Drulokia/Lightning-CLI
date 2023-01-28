const buildHelpers = require('../helpers/build')
const path = require('path')

module.exports = (folder, globalName) => {
  return {
    entries: [`${process.cwd()}/src/index.js`],
    defaultConfig: path.join(__dirname, '../configs/.parcelrc'),
    env: {
      appID: globalName,
    },
    mode: 'development', //'development' | 'production'
    defaultTargetOptions: {
      shouldOptimize: false, // Minifies the output file, defaults to process.env.NODE_ENV === 'production'
      shouldScopeHoist: true, //Defaults to false
      sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
      publicUrl: './', // The url to serve on, defaults to dist
      distDir: 'build', // The out directory to put the build files in, defaults to dist (Not used when using targets)
      outputFormat: 'esmodule', //'esmodule' | 'commonjs' | 'global'
    },
    // serveOptions: {
    //   port: 3000,
    // },
    shouldDisableCache: true, // Enabled or disables caching, defaults to false
    shouldContentHash: false,
    additionalReporters: [
      { packageName: '@parcel/reporter-cli', resolveFrom: __filename },
      { packageName: '@parcel/reporter-dev-server', resolveFrom: __filename },
    ],
    logLevel: 'verbose', //'none' | 'error' | 'warn' | 'info' | 'verbose'
    hmr: false, // Hot module reload ()
  }
}
