const path = require('path')

module.exports = (folder, globalName) => {
  const sourcemap =
    process.env.NODE_ENV === 'production' ||
    process.env.LNG_BUILD_SOURCEMAP === 'true' ||
    process.env.LNG_BUILD_SOURCEMAP === undefined
      ? true
      : process.env.LNG_BUILD_SOURCEMAP === 'inline'
      ? { inline: true }
      : false

  return {
    entries: `${process.cwd()}/src/index.js`,
    defaultConfig: path.join(__dirname, '../configs/.parcelrc'),
    env: {
      appID: globalName,
    },
    mode: 'development', //'development' | 'production'
    targets: {
      modern: {
        optimize: false,
        context: 'browser',
        sourceMap: sourcemap,
        distDir: folder, // The out directory to put the build files in, defaults to dist (Not used when using targets)
      },
    },
    defaultTargetOptions: {
      shouldScopeHoist: true, //Defaults to false
      publicUrl: './', // The url to serve on, defaults to dist
      outputFormat: 'esmodule', //'esmodule' | 'commonjs' | 'global'
    },
    shouldDisableCache: false, // Enabled or disables caching, defaults to false
    shouldContentHash: false,
    additionalReporters: [{ packageName: '@parcel/reporter-cli', resolveFrom: __filename }],
    logLevel: 'info', //'none' | 'error' | 'warn' | 'info' | 'verbose'
    hmr: false, // Hot module reload ()
  }
}
