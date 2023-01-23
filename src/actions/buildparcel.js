/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const path = require('path')
const sequence = require('../helpers/sequence')
const buildHelpers = require('../helpers/build')

const fs = require('fs')
const execa = require('execa')
const isLocallyInstalled = require('../helpers/localinstallationcheck')

module.exports = (clear = false, change = null, types = ['default']) => {
  const tempDir = path.join(process.cwd(), '.parcelbuild')
  const targetDir = path.join(process.cwd(), process.env.LNG_BUILD_FOLDER || 'build')

  let metadata
  let settings
  let settingsFileName = buildHelpers.getSettingsFileName()

  const createBundlerFile = (folder, metadata) => {
    const file = path.join(folder, 'src/appBundle.js')
    //const data = fs.readFileSync(file, { encoding: 'utf8' })
    const appID = buildHelpers.makeSafeAppId(metadata)
    const wsData = `
    import * as APP from "./index.js"
    window['${appID}'] = APP
    `
    fs.writeFileSync(file, wsData)
  }

  return (
    sequence([
      () => buildHelpers.ensureLightningApp(),
      () => clear && buildHelpers.ensureCorrectGitIgnore(),
      () => clear && buildHelpers.ensureCorrectSdkDependency(),
      () => clear && buildHelpers.removeFolder(tempDir),
      () => clear && buildHelpers.removeFolder(targetDir),
      () => buildHelpers.ensureFolderExists(tempDir),
      () => buildHelpers.ensureFolderExists(targetDir),
      () => buildHelpers.copySrcFolder(tempDir),
      () => clear && buildHelpers.copySupportFiles(targetDir),
      () =>
        (clear || change === 'settings') && buildHelpers.copySettings(settingsFileName, targetDir),
      () => (clear || change === 'metadata') && buildHelpers.copyMetadata(targetDir),
      () => (clear || change === 'static') && buildHelpers.copyStaticFolder(targetDir),
      () => buildHelpers.readMetadata().then(result => (metadata = result)),
      () => buildHelpers.readSettings(settingsFileName).then(result => (settings = result)),
      () => createBundlerFile(tempDir, metadata),
      () => {
        const enterFile = fs.existsSync(path.join(process.cwd(), '.parcelbuild/src/index.ts'))
          ? '.parcelbuild/src/appBundle.ts'
          : '.parcelbuild/src/appBundle.js'

        const args = [
          'serve',
          path.join(process.cwd(), enterFile),
          '--dist-dir',
          targetDir,
          '--log-level',
          'info',
          '--config',
          path.join(__dirname, '../configs/.parcelrc'),
          '--open',
        ]
        const levelsDown = isLocallyInstalled()
          ? buildHelpers.findFile(process.cwd(), 'node_modules/.bin/parcel')
          : path.join(__dirname, '../..', 'node_modules/.bin/parcel')

        const subprocess = execa(levelsDown, args)

        subprocess.catch(e => console.log(e.stderr))
        subprocess.stdout.pipe(process.stdout)
        return subprocess
      },
    ]),
    () => clear && buildHelpers.removeFolder(tempDir)
  )
}
