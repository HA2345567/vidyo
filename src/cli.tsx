import {render} from 'ink'
import {App} from './App.js'
import {parseArgs} from './lib/args.js'
import {captureFrames} from './lib/click-map.js'
import {readClipboard} from './lib/clipboard.js'

const args = parseArgs(process.argv.slice(2))

if (args.help) {
  console.log(`
vidyo - CLI Video Downloader

Usage:
  vidyo [url] [options]

Options:
  -h, --help            Show help
  -v, --version         Show version
  --theme <mode>        Set theme mode
`)
  process.exit(0)
}

if (args.version) {
  console.log('vidyo v0.0.0')
  process.exit(0)
}

if (args.error) {
  console.error(`Error: ${args.error}`)
  process.exit(1)
}

const stdout = captureFrames(process.stdout)
const clipboardUrl = readClipboard()

render(<App initialUrl={args.initialUrl} initialThemeMode={args.themeMode} clipboardUrl={clipboardUrl} />, {
  stdout,
  patchConsole: false,
})

