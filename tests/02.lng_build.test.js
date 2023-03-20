const fs = require('fs-extra')
const { addMsg } = require('jest-html-reporters/helper')

require('dotenv').config()

const buildApp = require('../src/actions/build')
const buildHelpers = require('../src/helpers/build')

jest.mock('is-online', () => jest.fn())

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}))

const spinner = require('../src/helpers/spinner')

describe('lng build', () => {
  let originalExit = process.exit
  let buildFolder

  beforeEach(() => {
    spinner.start.mockReset()
  })

  beforeAll(async () => {
    process.chdir(global.appConfig.appPath)
    buildFolder = `${process.cwd()}/build`
    process.exit = jest.fn()
  })

  afterAll(async () => {
    process.exit = originalExit
    process.chdir(global.originalCWD)
  })
  it('settings.json should have the correct data structure', async () => {
    const settings = await buildHelpers.readSettings()

    expect(settings).toEqual({
      // Define the expected structure of the JSON file
      appSettings: expect.objectContaining({
        stage: expect.objectContaining({
          clearColor: expect.any(String),
          useImageWorker: expect.any(Boolean),
        }),
        debug: expect.any(Boolean),
      }),
      platformSettings: expect.objectContaining({
        path: expect.any(String),
        log: expect.any(Boolean),
        showVersion: expect.any(Boolean),
      }),
    })
  })

  it('settings.json should have the correct data', async () => {
    const settings = await buildHelpers.readSettings()
    expect(settings.platformSettings.path).toBe('./static')
  })

  //Not very usefull error message when npm install is not run
  it('Should build app with esbuild and es5', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    // global.setEnvironmentValue('LNG_BUNDLER', 'esbuild')
    process.env.LNG_BUNDLER = 'esbuild'
    global.changeEsEnv('es5')

    const buildResult = await buildApp(true)
    await addMsg({ message: JSON.stringify(buildResult, null, 2) })
    //TODO inconsistent return value -> es5 returns object with metadata.json content, es6 returns Boolean false

    await addMsg({ message: spinner.start.mock.calls.join('\n') })

    //Check if build folder exists
    expect(fs.pathExistsSync(buildFolder)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/startApp.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/index.html`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js.map`)).toBe(true)
  })

  it('Should build app with esbuild and es6', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)
    jest.spyOn(console, 'log').mockImplementation(() => {})
    // global.setEnvironmentValue('LNG_BUNDLER', 'esbuild')
    process.env.LNG_BUNDLER = 'esbuild'
    global.changeEsEnv('es6')

    const buildResult = await buildApp(true)
    await addMsg({ message: JSON.stringify(buildResult, null, 2) })

    //TODO inconsistent return value -> es5 returns object with metadata.json content, es6 returns Boolean false

    await addMsg({ message: spinner.start.mock.calls.join('\n') })

    //Check if build folder exists
    expect(fs.pathExistsSync(buildFolder)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/startApp.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/index.html`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js.map`)).toBe(true)
  })

  it('should build app with rollup and es5', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)
    jest.spyOn(console, 'log').mockImplementation(() => {})
    // global.setEnvironmentValue('LNG_BUNDLER', 'rollup')
    process.env.LNG_BUNDLER = 'rollup'
    global.changeEsEnv('es5')

    const buildResult = await buildApp(true)
    await addMsg({ message: JSON.stringify(buildResult, null, 2) })
    //TODO inconsistent return value -> es5 returns object with metadata.json content, es6 returns Boolean false

    await addMsg({ message: spinner.start.mock.calls.join('\n') })

    //Check if build folder exists
    expect(fs.pathExistsSync(buildFolder)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/startApp.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/index.html`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.es5.js.map`)).toBe(true)
  }, 10000)

  it('Should build app with rollup and es6', async () => {
    // Clean up the test by deleting the app folder
    fs.removeSync(`${global.appConfig.appPath}/build`)
    jest.spyOn(console, 'log').mockImplementation(() => {})
    // global.setEnvironmentValue('LNG_BUNDLER', 'rollup')
    process.env.LNG_BUNDLER = 'rollup'
    global.changeEsEnv('es6')

    const buildResult = await buildApp(true)
    await addMsg({ message: JSON.stringify(buildResult, null, 2) })
    //TODO inconsistent return value -> es5 returns object with metadata.json content, es6 returns Boolean false

    expect(spinner.start).toHaveBeenCalledWith('Building ES6 appBundle and saving to build')
    await addMsg({ message: spinner.start.mock.calls.join('\n') })

    //Check if build folder exists
    expect(fs.pathExistsSync(buildFolder)).toBe(true)
    //Check for files and directories
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/settings.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/metadata.json`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/startApp.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/index.html`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.js`)).toBe(true)
    expect(fs.existsSync(`${buildFolder}/appBundle.js.map`)).toBe(true)

    //Check file contents
    const metadataJson = fs.readJsonSync(`${buildFolder}/metadata.json`)
    expect(metadataJson.identifier).toBe(global.appConfig.id)

    const indexHtml = fs.readFileSync(`${buildFolder}/index.html`, 'utf8')
    expect(indexHtml).toContain('<script src="./startApp.js"></script>')

    console.log(buildHelpers.getAppVersion())
  })
})
